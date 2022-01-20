//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract Vault1 {
    // Extensions
    using SafeMath for uint256;
    // Events
    event Deposit(uint amount);
    event Withdraw(uint amount);
    // State variables
    mapping(address => uint) private _balances;

    function deposit(uint _amount) external payable {
        _balances[msg.sender] = SafeMath.add(_amount, _balances[msg.sender]);
        emit Deposit(_amount);
    }

    function withdraw(uint _amount) external {
        require(_amount <= _balances[msg.sender], "Cannot withdraw more than balance");
        _balances[msg.sender] = SafeMath.sub(_balances[msg.sender], _amount);
        (bool isSentSuccessfully,) = msg.sender.call{value: _amount}("");
        require(isSentSuccessfully, "Failed to send ether to caller");
        emit Withdraw(_amount);
    }
}
