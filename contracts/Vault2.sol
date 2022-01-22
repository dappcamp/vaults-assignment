//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Vault2 is ERC20 {
    constructor() ERC20('VaultToken', "VAULT") {
    }

    function mint() external payable {
        _mint(msg.sender, msg.value);
    }

    function burn(uint _amount) external {
        require(balanceOf(msg.sender) >= _amount, "Insufficient balance");
        bool _success = payable(msg.sender).send(_amount);
        require(_success);
        _burn(msg.sender, _amount);
    }
}