//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.4;

import "hardhat/console.sol";

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Wrapper.sol";

// Develop a vault where users can deposit and withdraw any ERC20 token
contract Vault1 is ERC20Wrapper {

    address m_owner;

    // wraps a single erc20 token type
    constructor(address _owner, IERC20 _underlying) ERC20Wrapper(_underlying) ERC20("Vault Tokens", "VALT") {
        m_owner = _owner;
    }

    // region: events

    event Deposit(address caller, uint amount);
    event Withdraw(address caller, uint amount);

    // endregion

    function deposit(uint256 _amount) public {

        // call erc20 wrapper
        // -> deposit underlying
        // -> mint wrapped token back to user
        depositFor(msg.sender, _amount);

        // emit event
        emit Deposit(msg.sender, _amount);
    }

    // allow users to withdraw amount lesser than or equal to what they have deposited
    function withdraw(uint256 _amount) public {

        // call erc20 wrapper
        // -> user burns wrapped tokens
        // -> withdraw same number of underlying tokens
        withdrawTo(msg.sender, _amount);

        // emit event
        emit Withdraw(msg.sender, _amount);
    }

}
