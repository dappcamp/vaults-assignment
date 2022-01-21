//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Vault2 is ERC20 {
  event Minted(uint256 _amount);
  event Burned(uint256 _amount);

  constructor () ERC20("Vault Wrapper", "VAULT") {}

  function mint(uint256 _amount) payable public {
    require(_amount > 0, "Invalid amount, should be greater than 0.");
    require(msg.value == _amount, "Invalid amount, it should equal the amount of wei in the transaction.");

    ERC20._mint(msg.sender, msg.value);

    emit Minted(_amount);
  }

  function burn(uint256 _amount) public {
    require(_amount > 0, "Invalid amount, should be greater than 0.");

    ERC20._burn(msg.sender, _amount);

    (bool sent,) = msg.sender.call{value: _amount}("");
    require(sent, "Failed to send Ether");

    emit Burned(_amount);
  }
}
