//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Vault1 is ERC20  {

    mapping(address => uint256) public balance;
    address public owner;

    constructor() ERC20('DepositCoin', 'DC'){
        _mint(msg.sender, 1000000);
        owner = msg.sender;
    }

    function deposit(uint256 _amount) public {
        require(_amount > 0, "Deposit amount must be greater than zero.");
        balance[msg.sender]+= _amount;
    } 

    function withdraw(uint256 _amount) public {
        require(_amount > 0, "Withdraw amount must be greater than zero.");
        require(_amount <= balance[msg.sender], "Withdraw amount greater than balance.");
        balance[msg.sender]-= _amount;
    }
}