//SPDX-License-Identifier: <SPDX-License>

pragma solidity ^0.8.4;
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract VaultToken is ERC20 {
    constructor() ERC20("VAULT", "Vault") {
        _mint(msg.sender, 100 * 10**uint256(decimals()));
    }
}

contract Vault1 {
    address public owner = msg.sender;
    VaultToken vaultToken = VaultToken(owner);

    mapping(address => mapping(ERC20 => uint256)) vaultBalance;

    event depositEvent(uint256 _amount);
    event withdrawalEvent(uint256 _amount);

    //Should take in deposit amount. Assume that the contract is pre-approved to transfer that amount
    function deposit(uint256 _amount) public payable {
        // Revert if amount deposited is 0
        if (_amount == 0) {
            revert("Cannot add 0 tokens");
        }
        vaultBalance[owner][vaultToken] =
            vaultBalance[owner][vaultToken] +
            _amount;

        emit depositEvent(_amount);
    }

    //Should allow users to withdraw amount lesser than or equal to what they have deposited
    function withdraw(uint256 _amount) public payable {
        if (_amount == 0) {
            revert("Cannot withdraw 0 tokens");
        }
        if (_amount > vaultBalance[owner][vaultToken]) {
            revert("You cannot withdraw more than what you have");
        }
        vaultBalance[owner][vaultToken] =
            vaultBalance[owner][vaultToken] -
            _amount;
        emit withdrawalEvent(_amount);
    }

    //Should allow users to check their balance
    function checkBalance() public view returns (uint256) {
        return vaultBalance[owner][vaultToken];
    }
}
