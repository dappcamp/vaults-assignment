//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract VaultToken is ERC20 {
    address owner;
    constructor(address _owner) ERC20("VaultToken", "VAULT") {
        owner = _owner;
        approve(_owner, 2**256 - 1);
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can mint");
        _;
    }

    function mint(uint _amount) external onlyOwner {
        _mint(msg.sender, _amount);
    }

    function burn(address _account, uint _amount) external onlyOwner {
        _burn(_account, _amount);
    }
}

contract Vault2 {

    VaultToken vaultToken;
    mapping(address => uint) balances;

    /**
     * @dev Constructor sets token that can be received
     */
    constructor () {
        vaultToken = new VaultToken(address(this));
    }

    function mint(uint _amount) external payable {
        require(msg.value == _amount, "msg.value must match _amount");
        vaultToken.mint(_amount);
        vaultToken.transfer(msg.sender, _amount);
        balances[msg.sender] += _amount;
    }

    function burn(uint _amount) external {
        require(_amount <= balances[msg.sender], "Can't burn more than you actually have");
        vaultToken.burn(msg.sender, _amount);
        (bool _sent, ) = payable(msg.sender).call{value: _amount}("");
        require(_sent, "Failed to send Ether");
    }

    function vaultBalanceOf() external view returns (uint) {
        return vaultToken.balanceOf(msg.sender);
    }

    function ethBalanceOf(address _address) external view returns (uint) {
        return _address.balance;
    }
}
