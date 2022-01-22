//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;

import "../openzeppelin-contracts/contracts/token/ERC20/IERC20.sol";
import "./ERC20.sol";

/// @notice Vault to wrap ether. Send ether and receive an equal amount of VAULT tokens. 
/// When burning, get your ether back. 
abstract contract Vault2 is ERC20("Vault token", "VAULT") {
    
    // A payable function which should take ether and mint equal amount of VAULT tokens.
    function mint() external payable {
        _mint(msg.sender, msg.value);
    }

    // Should allow users to burn their tokens and get equal amount of ether back.
    function burn(uint _amount) external {
        _burn(msg.sender, _amount);
        (bool sent, ) = msg.sender.call{value: _amount}("");
        require(sent, "Failed to send ether");
    }
}
