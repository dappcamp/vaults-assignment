//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Vault1 {
    ERC20 token;
    mapping (address => uint) balances;

    constructor(address _tokenAddress) {
        token = ERC20(_tokenAddress);
    } 

    function deposit(uint _amount) external {
        bool _success = token.transferFrom(msg.sender, address(this), _amount);
        require(_success);
        balances[msg.sender] += _amount;
    }

    function withdraw(uint _amount) external {
        require(balances[msg.sender] >= _amount, "Insufficient funds");
        bool _success = token.transfer(msg.sender, _amount);
        require(_success);
        balances[msg.sender] -= _amount;
    }

    function balance() external view returns(uint) {
        return balances[msg.sender];
    }
}
