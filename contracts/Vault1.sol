//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Vault1 {

    IERC20 token;

    mapping(address => uint) public balances;

    event Deposited(address depositer, uint amount); 
    event Withdrawn(address withdrawer, uint amount);

    constructor (IERC20 _token) {
       token = _token;
    }

    function deposit(uint _amount) external payable {
        require(_amount>0, "Amount should be positive.");
        token.transferFrom(msg.sender, address(this), _amount);
        balances[msg.sender] += _amount;
        emit Deposited(msg.sender, _amount);
    }

    function withdraw(uint _amount) external payable {
        require(_amount>0, "Amount should be positive.");       
        token.transfer(msg.sender, _amount);
        balances[msg.sender] -= _amount;
        emit Withdrawn(msg.sender, _amount);
    }
    
}