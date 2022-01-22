//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

/**
Develop a vault where users can deposit and withdraw any ERC20 token.
*/
contract Vault1 {

    event Deposited(uint256 amount);
    event Withdrawn(uint256 amount);

    address contractAddr;

    constructor() {
        contractAddr = address(this);
    }

    function deposit(address tokenAddress, uint256 amount) public {
        IERC20 targetERC20 = IERC20(tokenAddress);
        targetERC20.transferFrom(msg.sender, contractAddr, amount);
        emit Deposited(amount);
    }

    function withdraw(address tokenAddress, uint256 amount) public {
        IERC20 targetERC20 = IERC20(tokenAddress);
        targetERC20.transfer(msg.sender, amount);
        emit Withdrawn(amount);
    }

}
