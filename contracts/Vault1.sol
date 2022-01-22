// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Vault1 {
    mapping (address => uint) public balances; // mapping from user address to deposited amount
    address token; // token address

    constructor(address _token) {
        token = _token;
    }

    function deposit(uint _amount) external {
        ERC20(token).transferFrom(msg.sender, address(this), _amount);
        balances[msg.sender] += _amount;
    }

    function withdraw(uint _amount) external {
        require(_amount <= balances[msg.sender], "can't withdraw more amount than balances");
        ERC20(token).transfer(msg.sender, _amount);
        balances[msg.sender] -= _amount;
    }
}
