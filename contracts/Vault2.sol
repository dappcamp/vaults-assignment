//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Vault2 is ERC20 {

  address vault;

  constructor() ERC20("Vault", "VLT") {
    vault = msg.sender;
  }

  function mint() external payable {
    _mint(msg.sender, msg.value);
  }

  function burn(uint256 _amount) external {
    _burn(msg.sender, _amount);
    payable(msg.sender).transfer(_amount);
  }
    
}
