//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Vault2 is ERC20 {

    constructor() ERC20("Vault", "VAULT") {        
    }

    function mint(uint256 _amount) external payable {
        require(msg.value == _amount, "Mint amount should be equal to ETH amount.");
        _mint(msg.sender, _amount);
    }

    function burn(uint256 _amount) external {
        require(_amount > 0, "Burn amount must be greated than zero.");
        payable(msg.sender).transfer(_amount);
        _burn(msg.sender, _amount);
    }
}