//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";


contract Vault2 is ERC20, Ownable {
    // Events
    event Mint(uint amount);
    event Burn(uint amount);


    constructor() ERC20("Vault2", "VAULT") {}

    function mint(uint _amount) external payable onlyOwner {
        require(_amount == msg.value, "amount does not equal to msg.value");
        _mint(msg.sender, _amount);
        emit Mint(_amount);
    }

    function burn(uint _amount) external payable onlyOwner {
        _burn(msg.sender, _amount);
        (bool success,) = msg.sender.call{value: _amount}("");
        require(success, "Withdraw failed");
        emit Burn(_amount);
    }

}
