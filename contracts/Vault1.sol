//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Vault1 {
    struct Account {
        mapping (IERC20 => uint256) erc20Balances;
    }

    mapping (address => Account) accounts;

    event Deposit(address _addr, uint256 _amount, IERC20 _token_addr);
    event Withdraw(address _addr, uint256 _amount, IERC20 _token_addr);

    function balance(IERC20 _token_addr) external view returns (uint256 _balance) {
        mapping(IERC20 => uint256) storage balances = accounts[msg.sender].erc20Balances;
        return balances[_token_addr];
    }

    function deposit(uint256 _amount, IERC20 _token_addr) external returns (bool _success) {
        bool success = _token_addr.transferFrom(msg.sender, address(this), _amount);

        if (success) {
            mapping(IERC20 => uint256) storage balances = accounts[msg.sender].erc20Balances;
            // Overflow is prevented by solidity >=0.8; It will revert
            balances[_token_addr] = balances[_token_addr] + _amount;

            emit Deposit(msg.sender, _amount, _token_addr);
        }

        return success;
    }

    function withdraw(uint256 _amount, IERC20 _token_addr) external returns (bool _success) {
        mapping(IERC20 => uint256) storage balances = accounts[msg.sender].erc20Balances;
        require(_amount <= balances[_token_addr], "Amount exceeds balance");

        require(_token_addr.approve(address(this), _amount) == true, "Approve did not succeed");

        bool success = _token_addr.transferFrom(address(this), msg.sender, _amount);

        if (success) {
            // Underflow is prevented by solidity >=0.8; It will revert
            balances[_token_addr] = balances[_token_addr] - _amount;
            emit Deposit(msg.sender, _amount, _token_addr);
        }

        return success;
    }

}
