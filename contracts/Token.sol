//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Token is ERC20 {
    constructor () ERC20("Token", "TOKEN") {
        _mint(msg.sender,10000*10**decimals());
    }
}
