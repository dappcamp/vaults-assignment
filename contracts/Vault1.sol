//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.2;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "hardhat/console.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract DummyToken is ERC20 {
  constructor(uint256 _amount) ERC20('DummyToken', 'DTN') {
    _mint(msg.sender, _amount);
  }
}

contract Vault1 is ERC20, ReentrancyGuard{

  IERC20 private myToken;
  mapping(address => uint256) private _balances;

  event Deposited(address _account, uint256 _amount);
  event Withdrawn(address _account, uint256 _amount);

  constructor(string memory _name, string memory _symbol, IERC20 _token) ERC20(_name, _symbol) {
    myToken = IERC20(_token);
  }

  modifier positiveAmount(uint256 _amount) {
    if(_amount == 0)
      revert("Amount should be bigger than 0");
    _;
  }

  function deposit(uint _amount) payable external positiveAmount(_amount) nonReentrant{
    myToken.transferFrom(msg.sender, address(this), _amount);
    _balances[msg.sender] += _amount;

    emit Deposited(msg.sender, _amount);
  }

  function withraw(uint _amount) external positiveAmount(_amount) nonReentrant {
    if(_amount > balanceOf(msg.sender))
      revert("Balance is lower than requested amount");

    myToken.transfer(msg.sender, _amount);
    _balances[msg.sender] -= _amount;

    emit Withdrawn(msg.sender, _amount);
  }

  function balanceOf(address _account) public view virtual override returns (uint256) {
    return _balances[_account];
  }
}
