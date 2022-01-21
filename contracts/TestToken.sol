//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract TestToken is ERC20 {
    uint256 public INITIAL_SUPPLY = 1_000_000;
    constructor() ERC20("TestToken", "TST") {
        _mint(msg.sender, INITIAL_SUPPLY);
    }
}