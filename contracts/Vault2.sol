//SPDX-License-Identifier: Unlicense

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

pragma solidity ^0.8.4;

contract Vault2 is ERC20 {
    address public owner;
    mapping(address => uint256) vaultBalances;

    // Event for the ERC20 Token
    event tokensMinted(address _owner, uint256 _amount);
    event tokensBurned(address _owner, uint256 _amount);

    // Constructor for ERC20 Token
    constructor() ERC20("Vault Token", "VAULT") {
        owner = msg.sender;
        _mint(owner, 10000**18);
    }

    // Modifier to force positive, non-zero amounts
    modifier positiveAmounts(uint256 _amount) {
        if (_amount <= 0) {
            revert("You must put a non-zero, positive deposit");
        }
        _;
    }

    //A payable function which should take ether and mint equal amount of VAULT
    function mintTokens(address _toAddress, uint256 _amount)
        external
        payable
        positiveAmounts(_amount)
    {
        emit tokensMinted(_toAddress, _amount);
        transfer(_toAddress, _amount);
    }

    //Should allow users to burn their tokens and get equal amount of ether back.
    function burnTokens(address _toAddress, uint256 _amount)
        external
        payable
        positiveAmounts(_amount)
    {
        emit tokensBurned(_toAddress, _amount);
        _burn(_toAddress, _amount);
    }

    //Should check the balance of the vault
    function checkBalance(address _address) public view returns (uint256) {
        return vaultBalances[_address];
    }
}
