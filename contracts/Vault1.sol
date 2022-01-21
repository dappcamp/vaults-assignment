//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.4;

import "hardhat/console.sol";

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

// Develop a vault where users can deposit and withdraw any ERC20 token
contract Vault1 {

    // addr (user) => addr (token) => user amt in escrow
    mapping(address => mapping(address => uint256)) private m_token_to_depositor_to_balance;

    // Should take in deposit amount.
    // Assume that the contract is pre-approved to transfer that amount
    function deposit(uint256 _amount, IERC20 _token) public payable {

        // require deposit not in excess of users balance
        uint caller_balance = _token.balanceOf(msg.sender);
        console.log("caller_balance: %d", caller_balance);
        require(_token.balanceOf(msg.sender) >= _amount,
            "insufficient funds for specified deposit amount");

        // submit to contract
        _token.transferFrom(msg.sender, address(this), _amount);

        // update local balance for m_user_to_token_balance
        m_token_to_depositor_to_balance[address(_token)][msg.sender] += _amount;

        // TODO: emit event?

        // return bool to indicate success
        return true;
    }

    function getDepositedAmount(IERC20 _token) external view returns (uint256){
        return m_token_to_depositor_to_balance[address(_token)][msg.sender];
    }

    // allow users to withdraw amount lesser than or equal to what they have deposited
    function withdraw(uint256 _amount, IERC20 _token) public {
        // require user exists and has a balance of this token
        require(m_token_to_depositor_to_balance[address(_token)][msg.sender] > 0, "user/token lookup not found");

        // get that token balance from storage
        uint token_balance = m_token_to_depositor_to_balance[address(_token)][msg.sender];
        require(token_balance >= _amount, "insufficient funds for withdrawal request");

        // TODO: emit an event?

        // transfer from this contract to the caller
        _token.transferFrom(address(this), msg.sender, _amount);

        // update token balance in local storage
        m_token_to_depositor_to_balance[address(_token)][msg.sender] -= _amount;
    }
}
