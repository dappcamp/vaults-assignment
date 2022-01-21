//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Vault2 is ERC20 {
    constructor() ERC20("VAULT", "VAULT") {}

    function mint() public payable {
        _mint(msg.sender, msg.value);
    }

    function burn(uint256 _amount) public {
        // get the amount of Ether stored in this contract
        uint256 contractBalance = address(this).balance;
        require(contractBalance > _amount, "This contract does not have enough ether to burn tokens");

        uint256 tokenCount = balanceOf(msg.sender);
        require(tokenCount > _amount, "Account does not have enough tokens minted");

        _burn(msg.sender, _amount);
        (bool success, ) = payable(msg.sender).call{value: _amount}("");
        require(success, "Failed to send Ether");
    }
}
