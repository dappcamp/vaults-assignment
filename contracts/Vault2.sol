//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

// not sure we are supposed to use this...
//import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Wrapper.sol";

contract Vault2 is ERC20 {
    event Mint(address _address, uint256 _amount);
    event Burn(address _address, uint256 _amount);

    constructor() ERC20("Vault", "CAPS") {}

    modifier validateAmount(uint256 _amount) {
        require(_amount > 0, "Invalid amount 0 tokens");
        _;
    }

    // external should save gas...
    function mint(uint256 _amount) external payable validateAmount(_amount) {
        require(msg.value == _amount, "Sent ether and _amount are not equal");
        _mint(msg.sender, _amount);
        emit Mint(msg.sender, _amount);
    }

    function burn(uint256 _amount) external validateAmount(_amount) {
        require(
            _amount <= balanceOf(msg.sender),
            "Cant burn more than you got"
        );
        _burn(msg.sender, _amount);
        emit Burn(msg.sender, _amount);
    }
}
