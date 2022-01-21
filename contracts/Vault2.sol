//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Vault2 is ERC20 {
    address public owner;

    constructor() ERC20('Vault2', 'V2'){
        _mint(msg.sender, 10000);
        owner = msg.sender;
    }

    function mint(address to, uint amount) external {
        require(msg.sender == owner, "Only owner can mint");
        _mint(to, amount);
    }

    function burn(uint amount) external {
        require(msg.sender == owner, "Only owner can burn");
        _burn(msg.sender, amount);
    }
    
}
