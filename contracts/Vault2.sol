//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Vault2 is ERC20 {
  address private owner;

  mapping (address => uint) public users;

  constructor() ERC20("Vault", "VAULT") {
    owner = msg.sender;
    _mint(msg.sender, 10000 * 10 ** uint(decimals()));
  }

  function mint() public payable {
    uint etherSent = msg.value / 10 ** uint(decimals());
    users[msg.sender] += etherSent;
  }

  function burn() public payable {
    uint howMuchToBeSent = users[msg.sender] * 10 ** uint(decimals());
    require(howMuchToBeSent > 0, "User does not have any tokens to burn");
    payable(msg.sender).transfer(howMuchToBeSent);
    users[msg.sender] = 0;
  }
}
