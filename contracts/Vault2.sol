//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "hardhat/console.sol";

contract Vault2 is ERC20 {

  constructor() ERC20("VAULT", "VT") {}

  event Minted(address _account, uint256 _amount);
  event Burn(address _account, uint256 _amount);

  modifier positiveAmount(uint256 _amount) {
    if(_amount == 0)
      revert("Amount should be bigger than 0");
    _;
  }

  function mint(uint _amount) external payable positiveAmount(_amount) {
    if(msg.value != _amount)
      revert("ETH amount should be the same with minting amount");

    _mint(msg.sender, _amount);

    emit Minted(msg.sender, _amount);
  }

  function burn(uint _amount) external positiveAmount(_amount) {
    if(_amount > balanceOf(msg.sender))
      revert("Balance is lower than requested amount");

    (bool success, ) = msg.sender.call{value: _amount}("");
    if(!success) {
      revert("Payback failed");
    }

    _burn(msg.sender, _amount);

    emit Burn(msg.sender, _amount);
  }
}
