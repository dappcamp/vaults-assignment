//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

// Specifications
// function deposit(_amount) - Should take in deposit amount. Assume that the contract is pre-approved to transfer that amount
// function withdraw(_amount) - Should allow users to withdraw amount lesser than or equal to what they have deposited
contract Vault1 is ERC20 {

    mapping(address => uint256) private _balances;

    constructor() ERC20("Vault", "vault") public {
        // super._mint(msg.sender,100*10**18);
     }

    function deposit(uint256 _amount) external payable returns(bool) {
        // _balances[msg.sender] += _amount;
        super.approve(msg.sender, _amount);
        return super.transferFrom(msg.sender,address(this), _amount);
    }

    function withdraw(uint256 _amount) external returns(bool) {
        require(_amount <= super.balanceOf(msg.sender), "Cannot withdraw more than balance");
        // _balances[msg.sender] -= _amount;
        return super.transferFrom(address(this),msg.sender, _amount);
    }

    // function balanceOf(address _account) public view virtual override returns (uint256) {
    //     return _balances[_account];
    // }
}
