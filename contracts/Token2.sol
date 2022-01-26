//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

/// @title A contract for minting APE tokens
/// @author Ashwin Rachakonda 💯💯😎💯💯
/// @notice Used for minting ERC721 APE tokens

contract Token2 is ERC721("Apes", "APE") {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    /// @notice Let's owner mint new APE token
    function mint() external returns(uint){
        uint newTokenId = _tokenIds.current();
        _mint(msg.sender, newTokenId);
        _tokenIds.increment();
        return newTokenId;
    }
}