//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract KNMToken is ERC20 {
    constructor(uint _initialsupply) ERC20("Konmaru", "KNM") {
        _mint(msg.sender, _initialsupply);
    }
}