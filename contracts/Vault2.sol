//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;

import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Vault2 is ERC20 {
    event Minted(address indexed wallet, uint256 _amount);
    event Burned(address indexed wallet, uint256 _amount);

    constructor() ERC20("Vault", "VAULT") {}

    function mint() external payable {
        require(msg.value > 0, "Amount must be > 0");

        _mint(msg.sender, msg.value);
        emit Minted(msg.sender, msg.value);
    }

    function burn(uint256 _amount) public {
        require(_amount > 0, "Amount must be > 0");

        uint256 balance = balanceOf(msg.sender);
        require(balance >= _amount, "Not enough balance");

        _burn(msg.sender, _amount);

        (bool sent, bytes memory data) = msg.sender.call{value: _amount}("");
        require(sent, "Failed to send Ether");

        emit Burned(msg.sender, _amount);
    }
}
