//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;

contract Vault1 {
    address payable public owner;

    constructor() {
        owner = payable(msg.sender);
    }

    function deposit(uint _amount) public payable {
        require(_amount > 0, "Invalid amount to deposit");
    }

    function withdraw(uint _amount) public onlyOwner {

    }

    // Modifier to check that the caller is the owner of
    // the contract.
    modifier onlyOwner() {
        require(owner == msg.sender, "Not owner");
        _;
    }
}
