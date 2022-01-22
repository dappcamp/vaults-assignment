//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract EggToken is ERC20 {
    address public owner;

    constructor() ERC20('Egg Token', 'EGGZ'){
        _mint(msg.sender, 1000);
        owner = msg.sender;
    }

    function mint(address _to, uint _amount) external {
        require(msg.sender == owner, "Only owner can mint");
        _mint(_to,_amount);
    }
}

contract Vault1 {
    /*
        Skeleton
        Users should be able to deposit and withdraw any ERC20 token

        function deposit(_amount) take a deposit amount, assume the contract is pre-approved
        to transfer that amount

        function withdraw(_amount) should allow users to withdraw amount lesser than or equal
        to what they have deposited
    */
    // variables
    address public owner;
    IERC20 private token;
    // a mapping of user addresses to the token and amount they have
    mapping (address => uint256) depositorBalance;

    // constructor, sets the token address
    constructor(IERC20 _token) {
        owner = msg.sender;
        token = _token;
    }

    // events
    event Deposited(address _depositor, uint256 _amount);
    event Withdrawn(address _depositor, uint256 _amount);

    // modifiers
    modifier amountGreaterThanZero (uint256 _amount){
        require (_amount > 0, "Deposit must be greater than zero.");
        _;
    }

    // functions
    /*
        @dev function to deposit an amount into the vault
    */
    function deposit(uint _amount) payable external amountGreaterThanZero(_amount) {
        require(msg.value == _amount, "Incorrect amount");
        token.transferFrom(msg.sender, address(this), _amount);
        depositorBalance[msg.sender] += _amount;
        emit Deposited(msg.sender, _amount);
    }

    function withdraw(uint _amount) external amountGreaterThanZero(_amount){
        require (_amount <= depositorBalance[msg.sender], "Not enough funds available.");
        token.transfer(msg.sender, _amount);
        emit Withdrawn(msg.sender, _amount);
    }
}
