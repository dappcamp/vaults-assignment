//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;

import "./Owner.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Vault1 is ERC20, Owner {

    mapping(address => mapping(string => uint)) private holdings;
    
    function deposit(_amount) external returns (bool) {
        require(_amount > 0, "amount should be greater than 0");
        return transfer(address(this), _amount);
    }

    function withdraw(_amount) external {
        // TODO
    }
}
