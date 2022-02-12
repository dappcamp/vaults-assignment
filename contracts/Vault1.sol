//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Vault1 {
    IERC20 public token;

    constructor(IERC20 _tokenAddress) {
        token = _tokenAddress;
    }

    mapping(address => uint256) public balances;

    event Deposit( uint256 _amount);
    event Withdraw( uint256 _amount);

    function deposit(uint _amount) public payable {
        require(token.balanceOf(msg.sender) >= _amount, "Insufficient balance to deposit");
        token.transferFrom(msg.sender, address(this), _amount);
        balances[msg.sender] += _amount;
    }

    function withdraw(uint _amount) public {
        require(balances[msg.sender] >= _amount, "Insufficient balance to withdraw");
        token.transfer(msg.sender, _amount);
        balances[msg.sender] -= _amount;
    }

}
