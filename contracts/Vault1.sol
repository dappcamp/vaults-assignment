//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "hardhat/console.sol";

contract Vault1 is Ownable {
    // what does this do exactly?
    IERC20 public tokenContract;

    constructor(address _contractAccount) {
        tokenContract = IERC20(_contractAccount);
    }

    // should this be private?
    mapping(address => uint256) public deposits;
    
    function deposit(uint256 _amount) external hasEnoughTokens(_amount) isValidAmount(_amount) {
        tokenContract.allowance(msg.sender, address(this));
        bool success = tokenContract.transferFrom(msg.sender, address(this), _amount);
        require(success, "Deposit failed");
        deposits[msg.sender] += _amount;
    }

    function withdraw(uint256 _amount) external hasSufficientFunds(_amount) isValidAmount(_amount) {
        bool success = tokenContract.transferFrom(address(this), msg.sender, _amount);
        require(success, "Withdrawal failed");
        deposits[msg.sender] -= _amount;
    }

    modifier isValidAmount(uint _amount) {
        require(_amount > 0, "Amount should be greater than zero");
        _;
    }

    modifier hasSufficientFunds(uint _amount) {
        require(deposits[msg.sender] >= _amount, "Insufficient funds");
        _;
    }

    modifier hasEnoughTokens(uint _amount) {
        require(tokenContract.balanceOf(msg.sender) >= _amount, "Insufficient tokens");
        _;
    }
}
