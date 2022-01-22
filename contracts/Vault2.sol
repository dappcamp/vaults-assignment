// SPDX-License-Identifier: MIT

pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Vault2 is ERC20 {
    mapping (address => uint) public balances; // mapping from user address to deposited amount

    constructor() ERC20("DAPP vault", "VAULT"){

    }

    function mint(uint _amount) external payable {
        (bool success, ) = payable(address(this)).call { value : _amount }("");
        require(success, "failed to transfer via call");

        _mint(msg.sender, _amount);
    }

    function burn(uint _amount) external {
        (bool success, ) = payable(msg.sender).call { value : _amount }("");
        require(success, "failed to transfer via call");

        _burn(msg.sender, _amount);


    }



}
