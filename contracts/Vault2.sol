//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";


contract Vault2 is ERC20{

    constructor() ERC20("Vault", "VAULT") {
    }
    
    function getContractVaultBalance() public view returns (uint){
        return balanceOf(address(this));
    }
    
    function getContractEthBalance() public view returns (uint){
        return address(this).balance;
    }
   
    function mint() external payable {
        _mint(msg.sender, msg.value);
    }

   
    function burn(uint _amount) external payable {
        require(balanceOf(msg.sender) >= _amount, "User doesn't have enough Vault tokens to burn");
        _burn(msg.sender, _amount);
        (bool sent, ) = payable(msg.sender).call{value: _amount}("");
        require(sent, "Failed to send Ether");
    }
}