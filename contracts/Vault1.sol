//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Vault1 {

    ERC20 token;
    //mapping of address to balance
    mapping(address => uint256) public balance;

    //contructor to set token type accepted by the vault
constructor () {
    
       token =  ERC20(0xc778417E063141139Fce010982780140Aa0cD5Ab);

    }

    function deposit(uint256 _amount) public
    {

        require(_amount > 0, "Enter valid amount");
        token.transferFrom(msg.sender, address(this), _amount);
        balance[msg.sender]+= _amount;

    } 

    function withdraw(uint256 _amount) public 
    {

        require(_amount > 0, "Enter valid amount");
        require(_amount <= balance[msg.sender], "Withdrawal amount too high");
        token.transferFrom(address(this),msg.sender, _amount);
        balance[msg.sender]-= _amount;


    }

}