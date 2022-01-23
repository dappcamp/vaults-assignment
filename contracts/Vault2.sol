//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/*
### Goal

Develop a vault where users can wrap their ether. Users should be able to send ether and receive an equal amount of `VAULT` tokens. On burning those tokens, users should get ether back. Complete this contract in `contracts/Vault2.sol`

### Specifications

-   `function mint(_amount)` - A payable function which should take ether and mint equal amount of `VAULT` tokens.
-   `function burn(_amount)` - Should allow users to burn their tokens and get equal amount of ether back.
*/

contract Vault2Token is ERC20 {
    
    address owner;

    constructor(address _owner) ERC20("VaultToken", "VAULT") {
        owner = _owner;
        approve(_owner, 1000**18);
    }

    function mint(uint _amount) external {
        _mint(owner, _amount);
    }

    function burn(address user, uint _amount) external {
        _burn(user, _amount);
    }
}

contract Vault2 {
    mapping (address => uint) userBalance;
    Vault2Token vault2Token;

    constructor() {
        vault2Token = new Vault2Token(address(this));
    }

    function mint(uint _amount) external payable {
        require (_amount > 0, "Invalid amount");

        vault2Token.mint(_amount);
        userBalance[msg.sender] += _amount;
        vault2Token.transfer(msg.sender, _amount);
    }

    function burn(uint _amount) external {
        require (_amount > 0, "Invalid amount");
        vault2Token.burn(msg.sender, _amount);
        (bool success, ) = payable(msg.sender).call{value : _amount}("");
        userBalance[msg.sender] -= _amount;
    }

    function balanceInVault() external view returns (uint) {
        return vault2Token.balanceOf(msg.sender);
    }    
}
