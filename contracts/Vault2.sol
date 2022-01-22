//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Vault2 is ERC20 {


    //contructor to define erc20 token
    //constructor(string memory name_, string memory symbol_)
constructor () ERC20 ("Vault", "VLT") {}

receive() external payable {}

function mint(uint256 _amount) external payable {
    //function _mint(address account, uint256 amount)
    require(msg.value == _amount, "eth should equal to amount");
    _mint(msg.sender, _amount);

}


function burn(uint256 _amount) external {
    //function _burn(address account, uint256 amount)
 
    require(_amount > 0, "Invalid amount");
    payable(msg.sender).transfer(_amount);
    _burn(msg.sender, _amount);
    
}




}