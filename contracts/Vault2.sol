//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Vault2 is ERC20 {
    event Minted(address owner, uint amount);
    event Burned(address owner, uint amount);

    constructor() 
        ERC20("Vault2", "VALT2") {}

    function mint(uint _amount) public payable {
        require(_amount != 0, "Must mint a non-zero value.");
        require(msg.value == _amount, "Must send exactly the same amount of ether.");
        _mint(msg.sender, _amount);
        emit Minted(msg.sender, _amount);
    }

    function burn(uint _amount) public {
        require(_amount != 0, "Must burn a non-zero value.");
        _burn(msg.sender, _amount);
        payable(msg.sender).transfer(_amount);
        emit Burned(msg.sender, _amount);
    }
}
