//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;

contract Vault2 {
    
    // contract balance of ETH increases with deposit (global variable)

    // state storage to track amount of VAULT issued
    // uint supply
    
    // state storage to track amount of VAULT assigned to address (?)
    // mapping(address => uint)
    // addr1 =>  1.23455408
    // addr2 => 40.33321150

    function mint(uint _amount) public {
        // TODO
        // deposits ether from txn
        // transfer ownership of VAULT
        // track VAULT issued
    }

    function burn(uint _amount) public {
        // TODO
        // transfer VAULT to burn address
        // reduce VAULT balance from state
        // transfer ETH to address
    }
}
