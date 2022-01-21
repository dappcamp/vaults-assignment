//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;

contract Vault1 {
    event Depositted(address by, uint256 amount);
    event Withdrawn(address by, uint256 amount);

    address public tokenAddress;

    mapping(address => uint256) private balanceOf;

    constructor(address _tokenAddress) {
        tokenAddress = _tokenAddress;
    }

    modifier noneZeroAmount(uint256 _amount) {
        require(_amount > 0, "Amount should be greater than 0");
        _;
    }

    function deposit(uint256 _amount)
        external
        payable
        noneZeroAmount(_amount)
    {}

    function withdraw(uint256 _amount) external noneZeroAmount(_amount) {}
}
