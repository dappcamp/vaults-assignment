//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Vault1 is ERC20 {
    constructor() ERC20("VAULT", "VAULT") {}

    function deposit(uint256 _amount) external payable {}

    function withdraw(uint256 _amount) external {}
}
