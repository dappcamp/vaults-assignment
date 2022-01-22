//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "hardhat/console.sol";

contract Vault2 is ERC20 {

    constructor () ERC20("Vault", "VAULT") {
    }

    function mint(uint _amount) public payable {
        require(_amount > 0, "Can't mint zero");
        require(msg.value == _amount*(1 ether), "Mint amount differs from sent amount");
        super._mint(msg.sender, msg.value);
    }

    function burn(uint _amount) public {
        require(_amount > 0, "Can't burn zero");
        require(super.balanceOf(msg.sender) >= _amount * (1 ether), "Insufficient balance");

        super._burn(msg.sender, _amount * (1 ether));
        payable(msg.sender).transfer(_amount * (1 ether));
    }
}
