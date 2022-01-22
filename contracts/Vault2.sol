//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Vault2 is ERC20('Vault', 'VAULT') {

    function mint() payable public {
        // A payable function which should take ether and mint equal amount of `VAULT` tokens.

        _mint(msg.sender, msg.value);
    }

    function burn(uint _amount) public {
        // Should allow users to burn their tokens and get equal amount of ether back.

        _burn(msg.sender, _amount);
        payable(msg.sender).transfer(_amount);
    }

}
