//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Vault1 {

    IERC20 token;
    mapping(address => uint) balances;

    /**
     * @dev Constructor sets token that can be received
     */
    constructor (IERC20 _token) {
        token = _token;
    }

    function deposit(uint _amount) external payable {
        require(token.balanceOf(msg.sender) >= _amount, "Caller doesn't have sufficient funds");
        token.transferFrom(msg.sender, address(this), _amount);
        balances[msg.sender] += _amount;
    }

    function withdraw(uint _amount) external {
        require(balances[msg.sender] <= _amount, "Cannot withdraw more than current balance");
        bool success = token.transfer(msg.sender, _amount);
        require(success, "Transfer failed");
    }
}
