//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;

import "./Owner.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Vault1 {

    // state storage should have the amounts of different ERC20s deposited by each address
    // addr1 -> (DAI, 14)
    //       -> (UNI, 10)

    // store map of symbols to contract addresses?
    
    function deposit(uint _amount, string memory _symbol) public {
        // must be able to identify the ERC20 that is being deposited
        // must be able to find the ERC20 contract and call the transfer function
        // keep track of deposited amounts for the sender
    }

    function withdraw(uint _amount) public {
        // must be able to identify the ERC20 that is being requested
        // check the contract balance of the sender
        // amount should be less than the sender's balance in the contract 
        // call the ERC20 contract transfer function
        // keep track of the withdrawal
    }
}
