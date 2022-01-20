//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract Vault2 is ERC20 {
    // Events
    event Mint(uint amount);
    event Burn(uint amount);

    constructor() ERC20("Vault", "VAULT") {}

    function mint(uint _amount) external payable {
        require(_amount == msg.value, "amount does not equal to msg.value");
        _mint(msg.sender, _amount);
        emit Mint(_amount);
    }

    function burn(uint _amount) external payable {
        _burn(msg.sender, _amount);
        (bool isSentSuccessfully,) = msg.sender.call{value: _amount}("");
        require(isSentSuccessfully, "Failed to send ether to caller");
        emit Burn(_amount);
    }
}
