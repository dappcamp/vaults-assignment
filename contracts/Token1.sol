//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/// @title A contract for minting TGR tokens
/// @author Ashwin Rachakonda 💯💯😎💯💯
/// @notice Used for minting ERC20 TGR tokens

contract Token1 is ERC20{
    address public owner;

    constructor() ERC20("Tiger", "TGR") {
        _mint(msg.sender, 10000 * 10 ** 18 );
        owner = msg.sender;
    }

    /// @notice Let's owner mint new TGR tokens and send to a user
    /// @param to User address who will be sent tokens
    /// @param amount number of TGR tokens to be minted
    function mint(address to, uint amount) external {
        require(msg.sender == owner, "Only owner can mint new tokens");
        _mint(to, amount);
    }
}