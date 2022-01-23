//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;

// Smart Contract to deposit and withdraw 
contract Vault1 {

    // Mapping to store each account balance.
    mapping(address => uint256) balances;

    // fire an event to let the app know that amount is deposited
    event AmountDeposited(address _depositer, uint _amount);

    // fire an event to let the app know that amount is withdrew
    event AmountWithdrew(address _depositer, uint _amount);

    function deposit(uint _amount) external {
        require(_amount > 0, "Deposit amount should be greater than zero");

        // increment the balance
        balances[msg.sender] += _amount;

        //fire event
        emit AmountDeposited(msg.sender, _amount);
    }

    function withdraw(uint _amount) external {
        //verify condition withdraw amount should be lesser than or equal to deposited amount
        require(balances[msg.sender] >= _amount, "withdraw amount should be lesser than or equal to deposited amount");

        require(_amount > 0, "Withdraw amount should be greater than zero");

        // deduct the the amount from the balance
        balances[msg.sender] -= _amount;

        //fire event
        emit AmountWithdrew(msg.sender, _amount);
    }

    function balanceOf(address account) external view returns (uint256) {
        return balances[account];
    }    
}