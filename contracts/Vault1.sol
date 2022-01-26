//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "hardhat/console.sol";

/// @title A contract for Depositing and withdrawing any ERC20 tokens
/// @author Ashwin Rachakonda 💯💯😎💯💯
/// @notice Used for depositing and withdrawing any ERC20 tokens

contract Vault1 {

    event Deposited(address from, IERC20 _token, uint amount);
    event Withdrawn(address to, IERC20 _token, uint amount);

    mapping(address => mapping(IERC20 => uint)) userTokenDepositsMap;

    /// @notice Shows the balance amount of a particular token per user
    /// @param _token ERC20 token address
    /// @param depositor address of the depositor
    function getAccountBalance(IERC20 _token, address depositor) public view returns (uint){
        return userTokenDepositsMap[depositor][_token];
    }

    /// @notice Shows the Contract balance amount for a particular token
    /// @param _token ERC20 token address
    function getContractTokenBalance(IERC20 _token) public view returns (uint){
        return _token.balanceOf(address(this));
    }

    /// @notice Shows the Contract ETH balance amount
    function getContractEthBalance() public view returns (uint){
        return address(this).balance;
    }

    /// @notice Let's users deposit any number of ERC20 tokens
    /// @param _token ERC20 token address
    /// @param _amount number of ERC20 tokens to be deposited
    function deposit(IERC20 _token, uint _amount) external payable {
        require(_amount > 0, "Amount should be more than zero");
        _token.transferFrom(msg.sender, address(this), _amount);
        userTokenDepositsMap[msg.sender][_token] +=_amount;
        emit Deposited(msg.sender, _token, _amount);
    }

    /// @notice Let's users wihdraw ERC20 tokens that they deposited
    /// @param _token ERC20 token address
    /// @param _amount number of ERC20 tokens to be withdrawn
    function withdraw(IERC20 _token, uint _amount) external {
        require(userTokenDepositsMap[msg.sender][_token] >= _amount, "User's deposit balance is lesser than the amount he is trying to withdraw");
        require(_amount > 0, "Amount should be more than zero");
        bool sent = _token.transfer(msg.sender, _amount);
        require(sent, "Failed to send Ether");
        userTokenDepositsMap[msg.sender][_token]-=_amount;
        emit Withdrawn(msg.sender, _token, _amount);
    }
}
