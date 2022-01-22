//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "hardhat/console.sol";

/**
Test ERC20 token for testing.
*/
contract VaultToken is ERC20 {

    address owner;
    address payable contractAddr;

    constructor() ERC20("Vault Test Token", "VT") {
        owner = msg.sender;
        contractAddr = payable(address(this));
    }

    function mint(uint256 value) public {
        console.log("mint", value);
        _mint(msg.sender, value);
    }

    function burn(uint256 value) payable public {
        _burn(msg.sender, value);
    }

}