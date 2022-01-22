//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;

import "../openzeppelin-contracts/contracts/token/ERC20/IERC20.sol";


/// @notice Vault to deposit and withdraw any ERC20 token.
contract Vault1 {
    address token;
    IERC20 token_contract;

    constructor(address _token) {
        token = _token; // address of ERC20 contract that this Vault is for
        token_contract = IERC20(_token);
    }

    // Should take in deposit amount. Assume that the contract is pre-approved to transfer that amount
    function deposit(uint _amount) external {
        token_contract.transferFrom(msg.sender, address(this), _amount);
    }

    // Should allow users to withdraw amount lesser than or equal to what they have deposited
    function withdraw(uint _amount) external {
        require(_amount <= token_contract.balanceOf(msg.sender), "Insufficient token balance");
        token_contract.transfer(msg.sender, _amount);
    }
}
