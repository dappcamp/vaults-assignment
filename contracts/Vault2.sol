//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Vault2 is ERC20 {
    event Minted(address by, uint256 amount);
    event Burned(address by, uint256 amount);

    constructor() ERC20("VAULT", "VAULT") {}

    modifier noneZeroAmount(uint256 _amount) {
        require(_amount > 0, "Amount should be greater than 0");
        _;
    }

    function mint(uint256 _amount) external payable noneZeroAmount(_amount) {
        require(
            _amount == msg.value,
            "Amount doesn't match the value of ETH sent"
        );

        _mint(msg.sender, _amount);

        emit Minted(msg.sender, _amount);
    }

    function burn(uint256 _amount) external noneZeroAmount(_amount) {
        require(
            _amount <= balanceOf(msg.sender),
            "Amount shouldn't be more than the balance"
        );

        (bool sent, ) = msg.sender.call{value: _amount}("");
        require(sent, "Failed to send Ether");

        _burn(msg.sender, _amount);

        emit Burned(msg.sender, _amount);
    }
}
