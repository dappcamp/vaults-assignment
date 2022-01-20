//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Vault1 {
    IERC20 public token;
    
    constructor(address tokenAddress) {
        token = IERC20(tokenAddress);
    }
    // events
    event Deposit(uint _amount);
    event Withdraw(uint _amount);

    function deposit(uint _amount) payable external {
        require(_amount > 0, "Invalid amount to deposit");

        token.transferFrom(msg.sender, address(this), _amount);

        emit Deposit(_amount);
    }

    // prevent caller from withdrawing amount more than the balance
    function withdraw(uint _amount) payable external {
        require(token.balanceOf(msg.sender) >= _amount, "Invalid amount to withdraw");

        token.transferFrom(address(this), msg.sender, _amount);

        emit Withdraw(_amount);
    }
}
