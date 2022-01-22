//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Vault1 {
    mapping (address => mapping (address => uint)) deposits; 

    event Deposit(address userAddress, uint amount, address contractAddress);
    event Withdraw(address userAddress, uint amount, address contractAddress);

    modifier hasRequiredBalanceInWallet(uint amount, address tokenAddress) {
        IERC20 token = IERC20(tokenAddress);

        require(token.balanceOf(msg.sender) >= amount, "Insufficient balance");
        _;
    }
    modifier hasRequiredBalanceInVault(uint amount, address tokenAddress) {
        require(deposits[msg.sender][tokenAddress] >= amount, "Insufficient balance");
        _;
    }
    
    function deposit(uint amount, address tokenAddress) public hasRequiredBalanceInWallet(amount, tokenAddress) {
        IERC20 token = IERC20(tokenAddress);
        
        token.transferFrom(msg.sender, address(this), amount);

        deposits[msg.sender][tokenAddress] += amount;
        emit Deposit(msg.sender, amount, tokenAddress);
    }

    function withdraw(uint amount, address tokenAddress) public hasRequiredBalanceInVault(amount, tokenAddress) {
        IERC20 token = IERC20(tokenAddress);

        token.transfer(msg.sender, amount);

        deposits[msg.sender][tokenAddress] -= amount;
        emit Withdraw(msg.sender, amount, tokenAddress);
    }

    function getBalance(address tokenAddress) public view returns(uint) {
        return deposits[msg.sender][tokenAddress];
    }
}
