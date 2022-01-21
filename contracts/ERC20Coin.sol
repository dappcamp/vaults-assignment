//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";


contract ERC20Coin is ERC20 {
  address private owner;

  constructor(string memory _name, string memory _symbol, uint _totalSupply) ERC20(_name, _symbol) {
    owner = msg.sender;
    _mint(msg.sender, _totalSupply * 10 ** uint(decimals()));
  }
}
