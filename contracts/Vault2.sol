//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/**
  * @title Mint and burn vault
  */
contract Vault2 is ERC20 {
  constructor () ERC20("Vault Wrapper", "VAULT") {}

  function mint(uint256 _amount) payable external {
    require(_amount > 0, "Invalid amount, should be greater than 0.");
    require(msg.value == _amount, "Invalid amount, it should equal the amount of wei in the transaction.");

    ERC20._mint(msg.sender, msg.value);
  }

  function burn(uint256 _amount) external {
    require(_amount > 0, "Invalid amount, should be greater than 0.");

    ERC20._burn(msg.sender, _amount);

    (bool sent,) = msg.sender.call{value: _amount}("");
    require(sent, "Failed to send Ether");
  }
}
