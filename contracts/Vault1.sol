//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;

contract Vault1 {
    address payable public owner;

    constructor() public {
        owner = payable(msg.sender);
    }

    function deposit(uint _amount) public payable {

    }

    function withdraw(uint _amount) public {

    }
}
