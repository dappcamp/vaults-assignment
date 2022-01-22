//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/interfaces/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract Vault1 is ReentrancyGuard {

    IERC20 erc20Contract;
    mapping(address => uint) balances;

    constructor(IERC20 _erc20Contract) {
        erc20Contract = _erc20Contract;
    }

    function deposit(uint _amount) external nonReentrant {
        require(erc20Contract.transferFrom(msg.sender, address(this), _amount), "Transfer from sender failed");
        balances[msg.sender] += _amount;
    }

    function withdraw(uint _amount) external nonReentrant {
        require(balances[msg.sender] >= _amount, "Insufficient balance");
        // first substract and then transfer to avoid reentry or other issues
        balances[msg.sender] -= _amount;
        require(erc20Contract.transfer(msg.sender, _amount), "Transfer to sender failed");
    }

    function getBalance(address addr) view external returns (uint) {
        return balances[addr];
    }
 
}
