//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

abstract contract Vault2 is IERC20 {

    //events
    event Minted(address to, uint256 value);

    //state variables
    address owner;

    //mappings
    mapping (address => uint256) vaultBalOf;
    mapping (address => uint256) etherBalOf;

    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    

    function mint(uint256 _amount) external payable onlyOwner {

        require(_amount == msg.value, "Amount doesn't match paid ether value");

        (bool sent, ) = address(this).call{value: msg.value}("");
        require(sent, "Failed to send Ether");

        vaultBalOf[msg.sender] += _amount;

        emit Minted(msg.sender, _amount);
    }

    function burn(uint256 _amount) external onlyOwner {

        require(_amount <= balanceOf(address(this)));
        
        (bool sent, ) = owner.call{value: msg.value}("");
        require(sent, "Failed to send Ether");
        
    }
    
}
