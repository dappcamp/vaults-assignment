//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Carbonium is ERC20('Carbonium', 'CO2') {
    constructor() {
        _mint(msg.sender, 1000);
    }
}

contract Vault1 {

    struct TokenUserBalance {
        mapping(address => uint) balance;
    }
    mapping(address => TokenUserBalance) tokenBalances;

    function balance(address _token) public view returns(uint) {
        return tokenBalances[_token].balance[msg.sender];
    }
    function deposit(address _token, uint _amount) public {
        // Should take in deposit amount. Assume that the contract is pre-approved to transfer that amount

        IERC20(_token).transferFrom(msg.sender, address(this), _amount);
        tokenBalances[_token].balance[msg.sender] += _amount;
    }

    function withdraw(address _token, uint _amount) public {
        // Should allow users to withdraw amount lesser than or equal to what they have deposited

        require(tokenBalances[_token].balance[msg.sender] >= _amount, "Balance too low.");

        IERC20(_token).transfer(msg.sender, _amount);
        tokenBalances[_token].balance[msg.sender] -= _amount;
    }

}
