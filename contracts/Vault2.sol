//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "hardhat/console.sol";

contract Vault2 is ERC20 {
    constructor() ERC20("coins", "COINS") {}

    function mint() public payable {
        _mint(msg.sender, msg.value);
    }

    function burn(uint256 _amount) public {
        _burn(msg.sender, _amount);
        (bool sent, bytes memory data) = msg.sender.call{value: _amount}("");
        require(sent, "Failed to send Ether");
    }
}
