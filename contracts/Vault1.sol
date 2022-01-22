//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "hardhat/console.sol";
import "./TestERC.sol";

contract Vault1 {
    address owner;
    mapping(address => uint256) userBalance;

    constructor() {
        owner = msg.sender;
    }

    function deposit(uint256 _amount, address _tokenType) external {
        TestERC token = TestERC(_tokenType);
        require(
            token.balanceOf(msg.sender) > 0,
            "Balance not sufficient for transfer to vault"
        );
        token.approveTransaction(msg.sender, owner, _amount);
        token.transferERC(msg.sender, owner, _amount);
        userBalance[msg.sender] += _amount;
    }

    function withdraw(uint256 _amount, address _tokenType) external {
        TestERC token = TestERC(_tokenType);
        require(
            userBalance[msg.sender] >= _amount,
            "User doesnt have sufficient balance in the vault"
        );
        token.approveTransaction(owner, msg.sender, _amount);
        token.transferERC(owner, msg.sender, _amount);
        userBalance[msg.sender] -= _amount;
    }
}
