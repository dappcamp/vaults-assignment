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

    function deposit(address _tokenAddress, uint256 _amount) public {
        IERC20 targetERC20 = IERC20(_tokenAddress);
        targetERC20.transferFrom(msg.sender, contractAddr, _amount);
        emit Deposited(_amount);
    }

    function withdraw(address _tokenAddress, uint256 _amount) public {
        IERC20 targetERC20 = IERC20(_tokenAddress);
        targetERC20.transfer(msg.sender, _amount);
        emit Withdrawn(_amount);
    }

}
