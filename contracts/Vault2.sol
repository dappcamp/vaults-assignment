//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Vault2 is ERC20 {
  event Minted(uint amount);
  event Burned(uint amount);

  constructor() ERC20("Vault", "VAULT") {

  }

  function mint(uint _amount) external payable {
    require(_amount > 0, "Amount must be greater than 0");
    require(_amount == msg.value, "Amount must equal eth sent");

    _mint(msg.sender, _amount);

    emit Minted(_amount);
  }

  function burn(uint _amount)  external {
    require(_amount > 0, "Amount must be greater than 0");

    _burn(msg.sender, _amount);

    transfer(msg.sender, _amount);

    emit Burned(_amount);
  }
}