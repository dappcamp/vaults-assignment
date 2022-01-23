//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Vault1 {
    mapping (address => mapping(ERC20 => uint)) public balance;

    event Deposited(address addr, ERC20 token, uint amount);
    event Withdrawn(address addr, ERC20 token, uint amount);

    function deposit(uint amount, ERC20 token) external {
        require(token.transferFrom(msg.sender, address(this), amount), "Could not deposit the tokens");
        balance[msg.sender][token] += amount;
        emit Deposited(msg.sender, token, amount);
    }

    function withdraw(uint amount, ERC20 token) external {
        require(balance[msg.sender][token] >= amount, "Not enough balance");
        require(token.transfer(msg.sender, amount), "Could not withdraw the tokens");
        balance[msg.sender][token] -= amount;
        emit Withdrawn(msg.sender, token, amount);
    }
}
