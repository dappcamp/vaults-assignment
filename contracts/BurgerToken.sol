//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract BurgerToken is ERC20 {
    constructor(uint256 initialSupply) ERC20("BURGERTOKEN", "BB") {
        _mint(msg.sender, initialSupply);
    }
}
