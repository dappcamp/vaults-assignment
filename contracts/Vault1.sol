//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;


contract Vault1 {

    //state variables
    mapping (address => uint256) private vaultBal;
    
    //events
    event deposited(uint256 amount);
    event withdrawed(uint256 amount);

    function deposit(uint256 _amount) external {

        vaultBal[msg.sender] += _amount;
        emit deposited(_amount);
    }

    function withdraw(uint256 _amount) external {
        
        vaultBal[msg.sender] -= _amount;
        emit withdrawed(_amount);
    }
}
