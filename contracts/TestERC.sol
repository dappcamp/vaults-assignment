//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract TestERC is ERC20 {

    constructor() ERC20("TestERC","TERC") {
        _mint(msg.sender, 1000*10 ** 18);
    }

    function mint(address _account,uint _amount) external{
        _mint(_account, _amount);
    } 

    function approveTransaction(address _owner,address _spender,uint _amount) external {
        _approve(_owner, _spender, _amount);
    }

    function transferERC(address sender,address recipient,uint amount) external {
        _transfer(sender, recipient, amount);
    }
}