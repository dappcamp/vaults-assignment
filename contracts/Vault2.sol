//SPDX-License-Identifier: Unlicense

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

pragma solidity ^0.8.4;

contract Vault2 is ERC20 {
    uint256 public totalSupply_;
    address public owner;
    mapping(address => uint256) balances;

    constructor() ERC20("Vault Token", "VAULT") {
        _mint(msg.sender, 10000**18);
        owner = msg.sender;
    }

    //A payable function which should take ether and mint equal amount of VAULT
    function mintTokens(address to, uint256 amount) external {
        // Mints number of ether
        _mint(owner, amount);
    }

    //Should allow users to burn their tokens and get equal amount of ether back.
    function burnTokens(uint256 amount) external {
        require(msg.sender == owner, "Only owner can burn");
        _burn(msg.sender, amount);
        transferFrom(address(this), owner, amount);
    }

    //Function to return the total token supply
    function checkSupply() public view returns (uint256) {
        return totalSupply_;
    }

    function checkBalance(address tokenOwner) public view returns (uint256) {
        return balances[tokenOwner];
    }
}
