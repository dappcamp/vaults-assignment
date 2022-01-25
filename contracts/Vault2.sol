//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Vault2 is ERC20, Ownable {

    mapping (address => uint) balances;

    constructor()
        ERC20("Vault", "VAULT")
    {}

    // A payable function which should take ether and mint equal amount of VAULT tokens.
    function mint(uint256 _amount) public payable {
        require(_amount == msg.value && _amount > 0, "invalid amount");
        balances[msg.sender] += msg.value;
        _mint(msg.sender, _amount);

    }

    // Should allow users to burn their tokens and get equal amount of ether back.
    function burn(uint256 _amount) public {
        require(_amount > 0 && _amount <= balances[msg.sender], "invalid amount");

        balances[msg.sender] -= _amount;
        _burn(msg.sender, _amount);

        (bool sent, ) = msg.sender.call{value: _amount}("");
        require(sent, "Failed to send Ether");
    }
}
