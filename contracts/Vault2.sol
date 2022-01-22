//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Address.sol";

contract Vault2 is ERC20, ReentrancyGuard {
    
    constructor() ERC20("Vault2", "VAULT") {}

    function mint(uint _amount) payable external nonReentrant {
        require(_amount == msg.value, "Amount of VAULT requested != Ether passed");

        // Question says "user" but not does not explicitly say if a contract
        // is allowed to mint or not. If we really only want EOA to mint and not 
        // other contracts uncomment tIhe below line though this is not fool proof
        // as per openzepplin docs.
        //Address.isContract(msg.sender);
        _mint(msg.sender, _amount);
    }

    function burn(uint _amount) external nonReentrant {
        // question says "user" but not does not explicitly say if a contract
        // is allowed to mint or not. f we really only want EOA to mint and not 
        // other contracts uncomment the below line though this is not fool proof
        // as per openzepplin docs.
        //Address.isContract(msg.sender);
        _burn(msg.sender, _amount);
        (bool sent, ) = payable(msg.sender).call{value: _amount}("");
        require(sent, "Failed to send Ether");
    }

    // Below functions I added for my convinience to try some 
    // exploit testing. Not needed for assignment.
    function getBalance() public view returns (uint) {
        return address(this).balance;
    }
    function load() external payable {}
}

// Below contract I added for my convinience to try some 
// exploit testing. Not needed for assignment.
contract ReentrancyExploit {

    Vault2 vault2Contract;

    constructor(Vault2 _vault2Contract) payable {
        vault2Contract = _vault2Contract;
    }

    function initiateAttack() external payable {
        // first mint some VAULT by sending ether and
        // then try burning VAULT and recieving as much 
        // ether as possible.
        uint amount = address(this).balance;
        vault2Contract.mint{value: amount}(amount);
        vault2Contract.burn(amount);
    }

    // default function trying to steal / burn all ether
    // of vault2Contract
    fallback() external payable {
        vault2Contract.burn(1);
    }

    receive() external payable {
        vault2Contract.burn(1);
    }

    function getBalance() public view returns (uint) {
        return address(this).balance;
    }
}
