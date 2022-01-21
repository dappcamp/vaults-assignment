//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/interfaces/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Vault1 {

    IERC20 erc20Contract;
    mapping(address => uint) balances;

    constructor(IERC20 _erc20Contract) {
        erc20Contract = _erc20Contract;
    }

    function deposit(uint _amount) external {
        require(erc20Contract.transferFrom(msg.sender, address(this), _amount));
        balances[msg.sender] += _amount;
    }

    function withdraw(uint _amount) external {
        require(balances[msg.sender] >= _amount, "Insufficient balance");
        // first substract and then transfer to avoid reentry or other issues
        balances[msg.sender] -= _amount;
        require(erc20Contract.transfer(msg.sender, _amount));
    }

}

contract TestERC20 is ERC20 {
    constructor() ERC20("TestERC20", "TEST") {}
}
