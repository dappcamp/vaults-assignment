//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Vault is ERC20 {

    constructor() ERC20("VaultERC","VAULT") {
        _mint(msg.sender, 1000*10 ** 18);
    }

    function mint(address _account,uint _amount) external{
        _mint(_account, _amount);
    } 
     
    function burn(address _account,uint _amount)  external {
        _burn(_account, _amount);
    } 

    
}