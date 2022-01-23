//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract DappCampToken is ERC20 {
    constructor(uint256 supply) ERC20('DappCamp Token', "DAPP") {
        _mint(msg.sender, supply);
    }
}
