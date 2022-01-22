//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Vault2 is ERC20{
    /*
        Skeleton
        Users should be able to wrap ETHER and receive VAULT
        Users should be able to burn VAULT and receive that amount of ETHER back

        function mint(_amount) - A payable function which should take ether and 
        mint equal amount of `VAULT` tokens.
        
        `function burn(_amount)` - Should allow users to burn their tokens and get 
        equal amount of ether back.
    */
    // base variables
    address owner;
    uint256 balance;

    // events
    event Minted(address user, uint amount);
    event Burned(address user, uint amount);

    // construct the VAULT token
    constructor() ERC20('Vault2 Token', 'VAULT'){
        _mint(msg.sender, 1000);
        owner = msg.sender;
    }

    // modifiers
    modifier amountGreaterThanZero (uint256 _amount){
        require (_amount > 0, "Deposit must be greater than zero.");
        _;
    }

    // functions

    /* 
        @dev Mints an amount of VAULT tokens equal to the Ether sent in transaction
    */
    function mint (uint _amount) external payable  amountGreaterThanZero(_amount){
        require(msg.value == _amount, "Amount must equal the number of eth sent");
        _mint(msg.sender, _amount);
        emit Minted(msg.sender, _amount);
    }

    /* 
        @dev Burns an amount of VAULT tokens and transfers the same amount of Eth to the user 
    */
    function burn (uint _amount) external payable amountGreaterThanZero(_amount){
        require(msg.value == _amount, "Amount must equal the number of tokens sent");
        _burn(msg.sender,_amount);
        emit Burned(msg.sender, _amount);
    }
}
