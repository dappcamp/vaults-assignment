//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Vault2 is ERC20 {
    constructor() ERC20("Vault2", "VAULT") {}

    function mint(uint _amount) external payable {
      require(msg.value == _amount, "Ether sent should equal input amount");
      _mint(msg.sender, msg.value);
    }

    function burn(uint _amount) external {
      require(balanceOf(msg.sender) >= _amount, "Not enough to burn");
      _burn(msg.sender, _amount);
      (bool success, ) = msg.sender.call { value : _amount }("");
      require(success, "failed to transfer via call");
    }
}
