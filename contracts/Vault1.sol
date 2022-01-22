//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

// Specifications
// function deposit(_amount) - Should take in deposit amount. Assume that the contract is pre-approved to transfer that amount
// function withdraw(_amount) - Should allow users to withdraw amount lesser than or equal to what they have deposited
contract Vault1 {
    using SafeMath for uint256;
    mapping (address => mapping(address => uint256)) public tokenBalances; // token => owner => balance

    function deposit(ERC20 _token, uint256 _amount) external returns(bool) {
        
        tokenBalances[address(_token)][msg.sender] = tokenBalances[address(_token)][msg.sender].add(_amount);
        return _token.transferFrom(msg.sender, address(this), _amount);

        // _id = ++depositCount;
    }

    function withdraw(ERC20 _token, uint256 _amount) external returns(bool) {
        require( _amount <= tokenBalances[address(_token)][msg.sender], "Cannot withdraw more than balance");
        
        tokenBalances[address(_token)][msg.sender] = tokenBalances[address(_token)][msg.sender].sub(_amount);
        // _token.approve(msg.sender, _amount);
        // return _token.transferFrom(address(this),msg.sender, _amount);
        return _token.transfer(msg.sender, _amount);
    }

    function balanceOf(ERC20 _token, address _account) public view virtual returns (uint256) {
        return tokenBalances[address(_token)][_account];
    }
}
