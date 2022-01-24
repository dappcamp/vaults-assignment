//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract SongToken is ERC20, Ownable {
    constructor() ERC20("Song Token", "SONG") {
        _mint(msg.sender, 10000);
    }

    function mint(address _to, uint256 _amount) public onlyOwner {
        _mint(_to, _amount);
    }

    function burn(uint _amount) external onlyOwner {
        _burn(msg.sender, _amount);
    }
}