//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "hardhat/console.sol";

contract Vault2 is ERC20 {
  address private owner;

  constructor() ERC20("Vault", "VAULT") {
    owner = msg.sender;
    _mint(msg.sender, 10000 * 10 ** uint(decimals()));
  }

  function mint(uint _amount) public payable {
    console.log("ETHER sent: ", msg.value, _amount);
  }
}
