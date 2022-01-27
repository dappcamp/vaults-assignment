//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Vault2 is ERC20 {

    // event Minted(address minter, uint amount);
    // event Burned(address burner, uint amount);
    
    constructor() ERC20("vault2", "VLTT") { }
    
    function mint(uint _amount) external payable {
        require(_amount!=0, "amount cannot be zero");
        require(msg.value == _amount, "message value and amount must match");
        _mint(msg.sender, _amount);
        // emit Minted(msg.sender, _amount);
    }

    function burn(uint _amount) external {
        require(_amount!=0, "Amount should be positive.");
        _burn(msg.sender, _amount);
        (bool success, ) = payable(msg.sender).call{value: _amount}("");
        require(success, "Failed to send Ether");
        // emit Burned(msg.sender, _amount);
    }
    
}
