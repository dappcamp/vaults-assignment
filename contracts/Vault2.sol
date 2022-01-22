//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Vault2 is ERC20 {
    constructor() ERC20("Vault Token", "VAULT") {}

    event Mint(address userAddress, uint amount);
    event Burn(address userAddress, uint amount);

    modifier ensureEthAndAmountAreSame(uint amount) {
        require(amount == msg.value, "Invalid amount");
        _;
    }

    modifier ensureVaultBalanceIsGreaterThanAmount(uint amount) {
        require(balanceOf(msg.sender) >= amount, "Invalid amount");
        _;
    }

    function mint(uint amount) external payable ensureEthAndAmountAreSame(amount) {
        _mint(msg.sender, amount);

        emit Mint(msg.sender, amount);
    }

    function burn(uint amount) external ensureVaultBalanceIsGreaterThanAmount(amount) {
        _burn(msg.sender, amount);
        payable(msg.sender).transfer(amount);

        emit Burn(msg.sender, amount);
    }
}
