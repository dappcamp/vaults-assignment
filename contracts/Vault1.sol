//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Vault1 {
    event Deposit(address _address, uint256 _amount);
    event Withdraw(address _address, uint256 _amount);

    address owner;
    IERC20 private tokenContract;

    mapping(address => uint256) amountByAddress;

    constructor(address tokenContractAddress) {
        owner = msg.sender;
        tokenContract = IERC20(tokenContractAddress);
    }

    modifier validateAmount(uint256 _amount) {
        require(_amount > 0, "Invalid amount 0 tokens");
        _;
    }

    function deposit(uint256 _amount) public validateAmount(_amount) {
        tokenContract.transferFrom(msg.sender, address(this), _amount);
        amountByAddress[msg.sender] += _amount;
        emit Deposit(msg.sender, _amount);
    }

    function withdraw(uint256 _amount) public validateAmount(_amount) {
        uint256 balance = amountByAddress[msg.sender];
        require(_amount <= balance, "Insufficient funds");
        tokenContract.transfer(msg.sender, _amount);
        emit Withdraw(msg.sender, _amount);
    }
}
