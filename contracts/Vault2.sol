//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Vault2 is ERC20 {
    constructor(uint256 initialSupply) ERC20("Vault", "VAULT") public {
        _mint(msg.sender, initialSupply);
    }

    function mint(uint _amount) public payable {
        require(_amount == msg.value, "Amount must match the value of the transaction");
        _mint(msg.sender, _amount);
    }

    function burn(uint _amount) public {
//        require(balanceOf(msg.sender) >= _amount, "Amount exceeds balance");
        _burn(msg.sender, _amount);
        payable(msg.sender).transfer(_amount);
    }

}
