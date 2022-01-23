//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/access/Ownable.sol";
import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

/*
Develop a vault where users can deposit and withdraw any ERC20 token. Complete this contract in `contracts/Vault1.sol`.

### Specifications

-   `function deposit(_amount)` - Should take in deposit amount. Assume that the contract is pre-approved to transfer that amount
-   `function withdraw(_amount)` - Should allow users to withdraw amount lesser than or equal to what they have deposited
*/


contract Vault1 {
    IERC20 _token;
    mapping (address => uint) private _userFunds;
    event Transfer(address indexed from, address indexed to, uint256 value);

    constructor(IERC20 token) {
        _token = token;
    }

    function deposit(uint _amount) external payable {
        require(_amount > 0, "Invalid deposit amount");
        _userFunds[msg.sender] += _amount;
        _token.transferFrom(msg.sender,address(this), _amount);
        emit Transfer(msg.sender, address(this), _amount);
    }

    function withdraw(uint _amount) external {
        require(_userFunds[msg.sender] >= _amount, "User does not have enough funds to withdraw");
        _userFunds[msg.sender] -= _amount;
        _token.transfer(msg.sender, _amount);
        emit Transfer(address(this), msg.sender, _amount);
    }

    function balanceOf(address user) external view returns (uint) {
        return _userFunds[user];
    }
}