//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/**
Test ERC20 token for testing.
*/
contract MimuToken is ERC20 {

    address owner;

    constructor() ERC20("Mimusyun Test Token", "MIMU") {
        owner = msg.sender;
        _mint(msg.sender, 1000);
    }

}