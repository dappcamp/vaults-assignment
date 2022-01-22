//SPDX-License-Identifier: <SPDX-License>

pragma solidity ^0.8.4;
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Vault1 {
    address public immutable owner;
    IERC20 private immutable vaultToken;
    uint256 public _amount;

    mapping(address => mapping(IERC20 => uint256)) vaultBalance;

    event depositEvent(uint256 _amount);
    event transferEvent(uint256 _amount);

    constructor(address _vaultOwner, IERC20 _vaultToken) {
        owner = _vaultOwner;
        vaultToken = _vaultToken;
    }

    //Should take in deposit amount. Assume that the contract is pre-approved to transfer that amount
    function deposit(IERC20 _vaultToken, uint256 _amount) public payable {
        if (_amount < 0) {
            revert("Cannot add negative tokens"); //test
        }
        if (_amount == 0) {
            revert("Cannot add 0 tokens"); //test
        }
        vaultToken.transfer(address(this), _amount);
        vaultBalance[msg.sender][_vaultToken] =
            vaultBalance[msg.sender][_vaultToken] +
            _amount;

        emit depositEvent(_amount);
    }

    //Should allow users to withdraw amount lesser than or equal to what they have deposited
    function withdraw(IERC20 _vaultToken, uint256 _amount) public payable {
        require(
            vaultBalance[msg.sender][_vaultToken] < _amount,
            "Withdrawing more than in the vault"
        ); //test
        vaultToken.transferFrom(address(this), msg.sender, _amount); //test
        emit transferEvent(_amount);
    }

    //Should allow users to check their balance
    function checkBalance(IERC20 _vaultToken) public returns (uint256) {
        return vaultBalance[msg.sender][_vaultToken];
    }
}
