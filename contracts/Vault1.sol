//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Vault1 {
    address tokenAddress;
    mapping (address => uint) userBalances;

    event Deposit(address account, uint amount);
    event Withdraw(address account, uint amount);
    
    constructor(address _tokenAddress) {
        tokenAddress = _tokenAddress;
    }

    function deposit(uint _amount) external {
        require(_amount > 0, "invalid amount");
        IERC20(tokenAddress).transferFrom(msg.sender, address(this), _amount);
        userBalances[msg.sender] += _amount;

        emit Deposit(msg.sender, _amount);
    }

    function withdraw(uint _amount) external {
        require(_amount > 0, "invalid amount");
        require(_amount <= userBalances[msg.sender], "insufficient funds");

        IERC20 token = IERC20(tokenAddress);
        require(_amount <= token.balanceOf(address(this)), "insufficient funds");

        userBalances[msg.sender] -= _amount;
        token.transfer(msg.sender, _amount);

        emit Withdraw(msg.sender, _amount);
    }
}
