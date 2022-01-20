//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Vault1 {
    string public constant name = "Vault1";
    string public constant symbol = "VAULT1";
    IERC20 public token;
    
    constructor() {
        token = new ERC20(name, symbol);
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
    // function withdraw(uint _amount) public {
    //     require(_balances[msg.sender] >= _amount, "Invalid amount to withdraw");

    //     _balances[msg.sender] -= _amount;

    //     emit Withdraw(_amount);
    // }
}
