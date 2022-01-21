//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Vault1  {
    //mapping that the user exists
    mapping(address => bool) public userExists; 

    //mapping user => balance
    mapping(address => uint) public balancesOf;

    event Deposit(address user, uint amount);
    event Withdraw(address owner, uint amount);

    ERC20 public token;

    constructor(address tokenAddress) {
        token = ERC20(tokenAddress);
    }

    function deposit(uint256 _amount) public {
        //check that the deposited amount is greater than 0
        require(_amount > 0, "Deposit more than 0");
        //add sender to the list of owners
        userExists[msg.sender] = true;

        //add the amount to the balance of the user
        balancesOf[msg.sender] += _amount;


        emit Deposit(msg.sender, _amount);
    }

    function withdraw(uint _amount) public  {
        //check if the user exists
        require(userExists[msg.sender], "You don't have a deposit here");

        //check if the user has enough tokens in the account to withdraw the desired amount
        require(balancesOf[msg.sender] >= _amount, "Not enough tokens" );

        //withdraw the tokens 
        balancesOf[msg.sender] -= _amount;

        //emit Withdraw event
        emit Withdraw(msg.sender, _amount);

    }
}