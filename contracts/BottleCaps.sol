//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract BottleCaps is ERC20 {
    constructor() ERC20("Bottle Caps", "CAPS") {
        // Mint 100 tokens to msg.sender
        // Similar to how
        // 1 dollar = 100 cents
        // 1 token = 1 * (10 ** decimals)
        // _mint(msg.sender, 100 * 10**uint256(decimals()));
        _mint(msg.sender, 100);
    }
}
