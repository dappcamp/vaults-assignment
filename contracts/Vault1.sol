//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";


contract Vault1 {
    IERC20 public token;

    mapping(address => uint) public vaultBalances;

    constructor(address _erc20Contract) {
        token = IERC20(_erc20Contract);
        token.approve(address(this), type(uint).max);
    }

    function deposit(uint _amount) external {
        require(_amount > 0, "Invalid deposit amount");
        require(token.balanceOf(msg.sender) >= _amount, "Insufficient balance");

        token.transferFrom(msg.sender, address(this), _amount);
        vaultBalances[msg.sender] = _amount;
    }

    function withdraw (uint _amount) external {
        require(_amount > 0, "Invalid withdraw amount");
        require(vaultBalances[msg.sender] >= _amount, "Insufficient balance in vault");

        vaultBalances[msg.sender] -= _amount;
        token.transferFrom(address(this), msg.sender, _amount);
    }
}