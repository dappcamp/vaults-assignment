//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

// Smart Contract that allows users to wrap their ether, send ether and receive an equal amount of VAULT tokens
contract Vault2 is ERC20 {
    address public owner;

    // fire an event to let the app know that amount is minted
    event Mint(address _address, uint _amount);

    // fire an event to let the app know that amount is burned
    event Burn(address _address, uint _amount);

    constructor() ERC20("VAULT","VA") {
        _mint(msg.sender, 10000);
        owner = msg.sender;
    }

    // Function that takes ether and mint equal amount of VAULT tokens.
    function mint(uint _amount) external {
        require(_amount > 0, "Mint amount should be greater than zero");
        _mint(msg.sender, _amount);

        //fire event
        emit Mint(msg.sender, _amount);
    }

    // Function that allows Users to burn their VAULT tokens and get equal amount of ether back
    function burn(uint _amount) external {
        require(_amount > 0, "Burn amount should be greater than zero");

        //verify condition burn amount should be lesser than or equal to minted amount
        require(balanceOf(msg.sender) >= _amount, "Burn amount should be lesser than or equal to minted amount");

        _burn(msg.sender,_amount);

        //fire event
        emit Burn(msg.sender, _amount);
    }  
}
