//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/// @title A contract for Minting/Burning ERC20 tokens
/// @author Ashwin Rachakonda 💯💯😎💯💯
/// @notice Used for minting/burning ERC20 tokens that user obtained by sending ether

contract Vault2 is ERC20{

    constructor() ERC20("Vault", "VAULT") {
    }

    /// @notice Shows the Contract balance amount for vault token
    function getContractVaultBalance() public view returns (uint){
        return balanceOf(address(this));
    }

    /// @notice Shows the Contract ETH balance amount
    function getContractEthBalance() public view returns (uint){
        return address(this).balance;
    }

    /// @notice Let's users mint vault tokens by submitting ether
    function mint() external payable {
        //require(msg.value == _amount, "Correct amount of ether is not sent");
        _mint(msg.sender, msg.value);
    }

    /// @notice Let's users burn vault tokens and get back ether
    /// @param _amount number of tokens to be burned
    function burn(uint _amount) external payable {
        //require(balanceOf(msg.sender) >= _amount, "User doesn't have enough Vault tokens to burn");
        _burn(msg.sender, _amount);
        (bool sent, ) = payable(msg.sender).call{value: _amount}("");
        require(sent, "Failed to send Ether");
    }
}
