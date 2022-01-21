//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

/**
  * @title A vault that allows depositing and withdrawing a single ERC20 token
  */
contract Vault1 {
  event Deposited(uint256 _amount);
  event Withdrawn(uint256 _amount);

  IERC20 private tokenContract;

  mapping (address => uint256) public balances;

  constructor (address _tokenAddress) {
    tokenContract = IERC20(_tokenAddress);
  }

  function deposit (uint256 _amount) external {
    require(_amount > 0, "Invalid deposit amount, must be greater than 0");

    tokenContract.transferFrom(msg.sender, address(this), _amount);
    balances[msg.sender] += _amount;

    emit Deposited(_amount);
  }

  function withdraw (uint256 _amount) external {
    require(_amount > 0, "Invalid withdraw amount, must be greater than 0");
    require(balances[msg.sender] >= _amount, "Insufficient balance");

    tokenContract.transfer(msg.sender, _amount);
    balances[msg.sender] -= _amount;

    emit Withdrawn(_amount);
  }
}
