//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

import "hardhat/console.sol";

contract Vault2 is ERC20, ERC20Burnable {
    using SafeMath for uint256;
    mapping (address => uint256) public tokenBalances; // token => owner => balance

    constructor() ERC20("Vault Token", "VAULT") {
        // Mint 100 tokens to msg.sender
        // Similar to how
        // 1 dollar = 100 cents
        // 1 token = 1 * (10 ** decimals)
        _mint(address(this), 100 * 10**uint(decimals()));
    }


    function mint(uint256 _amount) external payable returns(bool) {
        
        tokenBalances[msg.sender] = tokenBalances[msg.sender].add(_amount);
        this.approve(msg.sender, _amount);
        return this.transfer(msg.sender, _amount); //send Vault tokens back

        // _id = ++depositCount;
    }

    function burn(uint256 _amount) public override virtual {
        console.log("Burn %s tokens from %s balance", _amount, tokenBalances[msg.sender]);
        require( _amount <= tokenBalances[msg.sender], "Cannot withdraw more than balance");
        bool success;
        (success,) = address(msg.sender).call{value: tokenBalances[msg.sender]}("");
        require(success, "Did not send ether");
        tokenBalances[msg.sender] = tokenBalances[msg.sender].sub(_amount);
        super.burn(_amount);
        
    }

    function balanceOf(address _account) public override view virtual returns (uint256) {
        return tokenBalances[_account];
    }
}
