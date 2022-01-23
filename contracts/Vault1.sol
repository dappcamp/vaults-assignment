//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "hardhat/console.sol";

contract Vault1 {
    IERC20 public token;
    
    mapping(address => uint) balances;

    constructor(IERC20 _tokenAddress) {
        token = _tokenAddress;
    }
    // events
    event Deposit(uint _amount);
    event Withdraw(uint _amount);

    function deposit(uint _amount) payable external {
        require(token.balanceOf(msg.sender) >= _amount, "Does not have enough funds");

        token.transferFrom(msg.sender, address(this), _amount);

        balances[msg.sender] += _amount;

        emit Deposit(_amount);
    }

    // prevent caller from withdrawing amount more than the balance
    function withdraw(uint _amount) payable external {
        require(balances[msg.sender] >= _amount, "Invalid amount to withdraw");

        bool success = token.transfer(msg.sender, _amount);
        
        // require(balances[msg.sender] <= _amount, "Cannot withdraw more than current balance");

        require(success, "Withdraw failed");
        emit Withdraw(_amount);
    }
}
