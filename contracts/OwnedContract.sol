//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;

contract OwnedContract {
    address owner;

    constructor ()  {
       owner = msg.sender;
    }

    modifier ownerOnly() {
        require(msg.sender == owner, "Not an owner");
        _;
    }
}
