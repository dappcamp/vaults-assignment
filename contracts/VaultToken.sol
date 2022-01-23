//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract VaultToken is ERC20 {
    constructor(uint initialSupply, string memory _name, string memory _token) ERC20(_name, _token) {
        _mint(msg.sender, initialSupply);
    }
}