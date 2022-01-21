//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Vault1 is ERC20 {
    address public owner;
    mapping(address => uint) balances;

    constructor() ERC20('DappCamp Token', 'DCMP'){
        _mint(msg.sender, 10000);
        owner = msg.sender;
    }

    function deposit(uint _amount) external {
        balances[msg.sender] += _amount;
    }

    function checkBalance() public view returns(uint256){
       return balances[msg.sender];
    }

    function withdraw(uint _amount) external {
        require(_amount <= balances[msg.sender], "The amount you are attempting to withdraw is higher than your balance.");
        balances[msg.sender] = balances[msg.sender] - _amount; 
    }
}
