//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Vault2 is ERC20 {

  address vault;

  constructor() ERC20("Vault", "VLT") {
    vault = msg.sender;
    _mint(msg.sender, 42*10**18);
  }

  function wrap() {

  }

  function burn() {

  }
    
}
