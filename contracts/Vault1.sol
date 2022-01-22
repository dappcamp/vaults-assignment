//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Vault1 {
  ERC20 token;

  event Deposited(uint amount);
  event Withdrawn(uint amount);

  mapping (address => uint) public addressToDeposits;

  constructor(address _tokenAddress) {
    token = ERC20(_tokenAddress);
  }

  function deposit(uint _amount) external {
    require(_amount > 0, "Amount must be greater than 0");
    require(token.balanceOf(msg.sender) >= _amount, "Attemped to deposit amount greater than balance");

    token.transferFrom(msg.sender, address(this), _amount);
    addressToDeposits[msg.sender] = addressToDeposits[msg.sender] + _amount;

    emit Deposited(_amount);
  }

  function withdraw(uint _amount) external {  
    require(_amount > 0, "Amount must be greater than 0");

    uint amountDeposited = addressToDeposits[msg.sender];
    require(_amount <= amountDeposited, "Amount must be less than the amount already deposited");

    token.transfer(msg.sender, _amount);
    addressToDeposits[msg.sender] = addressToDeposits[msg.sender] - _amount;

    emit Withdrawn(_amount);
  }
}
