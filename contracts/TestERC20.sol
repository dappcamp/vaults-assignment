// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract TestERC20 is ERC20 {
    constructor(address user, uint256 amount) ERC20("TestERC20", "TEST") {
        _mint(user, amount);
    }
}
