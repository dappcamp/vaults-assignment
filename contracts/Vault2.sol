//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Vault2 is ERC20 {
    //checks if the user has an account or not
    mapping(address => bool) hasAccount;
    event Mint(uint256 amount);
    event Burn(uint256 amount);

    constructor() payable ERC20("VaultToken", "VAULT") {}

    receive() external payable {}

    function mint() public payable {
        require(msg.value > 0, "Please deposit more than 0 tokens");
        _mint(msg.sender, msg.value);
        emit Mint(msg.value);
    }

    function burn(uint256 _amount) public payable {
        require(
            _amount <= balanceOf(msg.sender),
            "Not enough VAULT tokens to burn"
        );

        _burn(msg.sender, _amount);
        payable(msg.sender).transfer(_amount);

        emit Burn(_amount);
    }

    function balanceOfEth() public view returns (uint256) {
        return address(this).balance;
    }
}
