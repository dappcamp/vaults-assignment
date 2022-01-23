//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Vault2 is ERC20 {
    constructor() ERC20('Vault2 Token', "VAULT2") {}

    mapping(address => uint) public balance;

    // I think `amount` argument is unnecessary here so I omitted it.
    // User just sends eth to mint function and gets equal amt of VAULT2
    function mint() external payable {
        balance[msg.sender] += msg.value;
        _mint(msg.sender, msg.value);
    }

    function burn(uint amount) external reentrancyLock {
        require(balance[msg.sender] > amount, "Not enough balance");
        balance[msg.sender] -= amount;
        _burn(msg.sender, amount);
        (bool sent,) = msg.sender.call{value: amount}("");
        require(sent, "Count not send ETH back");
    }

    bool private _locked;
    modifier reentrancyLock {
        require(!_locked);
        _locked = true;
        _;
        _locked = false;
    }
}
