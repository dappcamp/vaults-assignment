//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract Vault1 {
    using SafeMath for uint256;

    mapping(address => mapping(address => uint256)) public tokenBalances;

    function deposit(uint256 _amount, IERC20 _token) public {
        (bool success, uint256 newBalance) = tokenBalances[msg.sender][
            address(_token)
        ].tryAdd(_amount);
        require(success, "Could not deposit token amount error in balance");

        success = _token.transfer(address(this), _amount);
        require(success, "Could transfer the token");

        tokenBalances[msg.sender][address(_token)] = newBalance;
    }

    function withdraw(uint256 _amount, IERC20 _token) public {

        require(
            tokenBalances[msg.sender][address(_token)] >= _amount,
            "Insufficient balance to withdraw tokens"
        );

        (bool success, uint256 newBalance) = tokenBalances[msg.sender][
            address(_token)
        ].trySub(_amount);
        require(success, "Could not withdraw amount error in balance");

        success = _token.transferFrom(address(this), address(_token), _amount);
        require(success, "Could transfer the token");

        tokenBalances[msg.sender][address(_token)] = newBalance;
    }
}
