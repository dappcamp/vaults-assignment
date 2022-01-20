//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;

contract Vault1 {
  mapping (string => mapping(address => uint256)) public deposits;

  function deposit (uint256 _amount) public {
    require(_amount > 0, "Invalid deposit amount, must be greater than 0");
  }
}
