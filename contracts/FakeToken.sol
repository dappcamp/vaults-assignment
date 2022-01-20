//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract FakeToken is ERC20 {
    constructor() 
        ERC20("FakeToken", "FAKE") {}

    function faucet(uint amount) public {
        _mint(msg.sender, amount);
    }
}
