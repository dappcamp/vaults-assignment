//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Vault1 {
    event Depositted(address by, uint256 amount);
    event Withdrawn(address by, uint256 amount);

    IERC20 public tokenContract;

    mapping(address => uint256) public balanceOf;

    constructor(address _tokenAddress) {
        tokenContract = IERC20(_tokenAddress);
    }

    modifier noneZeroAmount(uint256 _amount) {
        require(_amount > 0, "Amount should be greater than 0");
        _;
    }

    function deposit(uint256 _amount) external payable noneZeroAmount(_amount) {
        uint256 allowance = tokenContract.allowance(msg.sender, address(this));
        require(allowance >= _amount, "Not enough allowance");

        bool sent = tokenContract.transferFrom(
            msg.sender,
            address(this),
            _amount
        );
        require(sent, "Error while transferring token");

        balanceOf[msg.sender] += _amount;

        emit Depositted(msg.sender, _amount);
    }

    function withdraw(uint256 _amount) external noneZeroAmount(_amount) {
        require(balanceOf[msg.sender] >= _amount, "Not enough balance");

        bool sent = tokenContract.transfer(msg.sender, _amount);
        require(sent, "Error while transferring token");

        balanceOf[msg.sender] -= _amount;

        emit Withdrawn(msg.sender, _amount);
    }
}
