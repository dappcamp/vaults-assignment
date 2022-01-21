//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;
//import "hardhat/console.sol";

interface IERC20 {
    function totalSupply() external view returns (uint);
    function balanceOf(address account) external view returns (uint);
    function transfer(address recipient, uint amount) external returns (bool);
    function allowance(address owner, address spender) external view returns (uint);
    function approve(address spender, uint amount) external returns (bool);
    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);
    event Transfer(address indexed from, address indexed to, uint value);
    event Approval(address indexed owner, address indexed spender, uint value);
}

contract Vault1 {
    mapping(address => uint) balances;
    address public token;

    event Deposited(address addr, uint amount);
    event Withdrawn(address addr, uint amount);

    constructor (address _token){
        token = _token;
    }

    function deposit(uint _amount) public returns (bool outcome){
        require(IERC20(token).balanceOf(msg.sender)>=_amount, "Insufficient account balance for deposit");
        outcome = IERC20(token).transferFrom(msg.sender,address(this),_amount);
        require(outcome==true, "Deposit Failed");
        balances[msg.sender]+=_amount;
        emit Deposited(msg.sender, balances[msg.sender]);
    }

    function withdraw(uint _amount) public returns (bool outcome){
        require(balances[msg.sender]>=_amount, "Insufficient deposit balance for withdrawal");
        IERC20(token).approve(address(this),_amount);
        outcome = IERC20(token).transferFrom(address(this), msg.sender,_amount);
        balances[msg.sender]-=_amount;
        emit Withdrawn(msg.sender, balances[msg.sender]);
    }    
}
