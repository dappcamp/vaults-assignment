//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;

import "./Vault.sol";
import "hardhat/console.sol";


contract Vault2 {

  Vault token;

     constructor (address _tokenAddress) {
         token=Vault(_tokenAddress);
     }

    function mint(uint256 amount) external payable {
        uint ethAmount= (uint)(msg.value/10**18);      
        require(ethAmount == amount, "Not enough ether to mint");
        token.mint(msg.sender, amount);
    }

    function burn(uint256 amount) external payable {
        require(
            amount <= token.balanceOf(msg.sender),
            "Not enough vault to burn"
        );
        token.burn(msg.sender, amount);
        address receiver = msg.sender;
        receiver.call{value:msg.value}("");

    }
}
