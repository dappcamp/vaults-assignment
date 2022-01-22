//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Vault1 {
    IERC20 private token;
    mapping(address => uint256) public balanceOf;

    constructor(address _tokenAddress) {
        token = IERC20(_tokenAddress);
    }

    function deposit(uint256 amount) external payable {
        token.transferFrom(msg.sender, address(this), amount);
        balanceOf[msg.sender] += amount;
    }

    function withdraw(uint256 amount) public {
        require(
            balanceOf[msg.sender] >= amount,
            "Attempted to withdraw more than current balance"
        );
        token.transfer(msg.sender, amount);
        balanceOf[msg.sender] -= amount;
    }
}
