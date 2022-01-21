pragma solidity ^0.8.4;

contract Vault1 {
    address public owner;
    mapping(uint256 => address) vaultBalance;

    //Should take in deposit amount. Assume that the contract is pre-approved to transfer that amount
    function deposit(uint256 _amount) public payable {
        vaultBalance[owner] += _amount;
    }

    //Should allow users to withdraw amount lesser than or equal to what they have deposited
    function withdraw(uint256 _amount) public {
        require(0 > (vaultBalance[owner] -= msg.value), "Not enough funds");
        vaultBalance[owner] -= _amount;
    }
}
