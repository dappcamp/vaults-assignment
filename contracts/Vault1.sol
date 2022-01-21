//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract DynamiteToken is ERC20 {
  address token;
  constructor() ERC20("Dynamite", "TNT") {
    token = msg.sender;
    _mint(msg.sender, 42*10**18);
  }

  function vaultAddress() external view returns (address) {
    return token;
  }
}

contract PiolinToken is ERC20 {
  address token;
  constructor() ERC20("Piolin", "PIA") {
    token = msg.sender;
    _mint(msg.sender, 100*10**18);
  }

  function vaultAddress() external view returns (address) {
    return token;
  }

}

contract Vault1 {
  address vault;

  constructor() {
    vault = msg.sender;
  }

  mapping(address => mapping(IERC20 => uint256)) tokenBalances;

  function vaultAddress() external view returns (address) {
    return vault;
  }

  function vaultTokenBalance(address _address, IERC20 _token) external view returns (uint256){
    return tokenBalances[_address][_token];
  }

  function deposit(uint256 _amount, IERC20 _token) payable external {
    require(_amount > 0, "You need to deposit tokens");
    tokenBalances[msg.sender][_token] += _amount;
    bool output = IERC20(_token).transferFrom(msg.sender, address(this), _amount);
  }

  function withdraw(uint256 _amount, IERC20 _token) external {
    require(_amount > 0, "Withdrawal amount needs to be bigger than 0");
    require(_amount <= tokenBalances[msg.sender][_token], "Account balance needs to be larger than withdrawal amount");
    tokenBalances[msg.sender][_token] -= _amount;
    bool output = IERC20(_token).transfer(msg.sender, _amount);
  }

}
