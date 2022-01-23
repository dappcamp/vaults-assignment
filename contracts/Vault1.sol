//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Vault1 {

  IERC20 public erc20Contract;
  mapping(address => uint) public addressToAmount;

  event Deposited(address _depositor, uint _amount);
  event Withdrawed(address _withdrawer, uint _amount);

  constructor(address _tokenAddress) {
    // Set the contract
    erc20Contract = IERC20(_tokenAddress);
  }

  function deposit(uint _amount) external {
    // Transfer amount from the senders address to this address
    erc20Contract.transferFrom(msg.sender, address(this), _amount);
    addressToAmount[msg.sender] += _amount;
    emit Deposited(msg.sender, _amount);
  }

  function withdraw(uint _amount) external {
    require(addressToAmount[msg.sender] >= _amount, "Not enough funds");
    erc20Contract.transfer(msg.sender, _amount);
    addressToAmount[msg.sender] -= _amount;
    emit Withdrawed(msg.sender, _amount);
  }
}
