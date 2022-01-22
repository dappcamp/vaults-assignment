//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;

import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Vault2 is ERC20("Vault Test Token", "VT") {

    address payable contractAddr;

    event Minted(uint256 amount);
    event Burned(uint256 amount);

    constructor() {
        contractAddr = payable(address(this));
    }

    function mint() payable public {
        _mint(msg.sender, msg.value);
        emit Minted(msg.value);
    }

    function burn(uint256 _amount) payable public {
        (bool success, ) = msg.sender.call{value: _amount}("");
        if (success) {
            _burn(msg.sender, _amount);
            emit Burned(_amount);
        }
    }

    function balance() public view returns (uint256) {
        return contractAddr.balance;
    }
    
}
