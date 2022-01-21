//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
// import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
// import "./SafeERC20.sol";

// @title Vault1 
// @notice a vault where users can deposit and withdraw any ERC20 token.
contract Vault1 {

  event newDeposit(uint _amount);
  event newTransfer(uint _amount);

  // token contract will hold
  IERC20 private immutable _holdToken;

  // who can withdraw
  address private immutable _owner;

  // @dev to receive deposit in the deploy transaction add "payable"
  constructor (address _canWithdraw, IERC20 _token)  {
    _owner = _canWithdraw;
    _holdToken = _token;
  }

  // @notive function deposit(_amount) - Should take in deposit amount. 
  // @notice Assume that the contract is pre-approved to transfer that amount
  // @dev sending ETH is handled by the protocol
  function Deposit(uint _amount) external {
    require(_amount > 0, "Zero tokens");

    // @dev if _holdToken is address
    // (bool allowance, ) = 
    //     _holdToken.call(abi.encodeWithSelector(IERC20.approve.selector, address(this), _amount));
    // require(allowance, "Could not allow");

    // @dev if _holdToken is address
    // (bool success, bytes memory data) =
    //     _holdToken.call(abi.encodeWithSelector(ERC20.transfer.selector, address(this), _amount));
    // require(success && (data.length == 0 || abi.decode(data, (bool))), 'Not Allowed');

    _holdToken.transferFrom(msg.sender, address(this), _amount);
    emit newDeposit(_amount);
  }

  modifier canWithdraw() {
    require(msg.sender == _owner, "Sender not allowed to withdraw");
    _;
  }

  // @notice function withdraw(_amount) - Should allow users to withdraw <= deposited
  // @dev use CALL to send ETH
  function Withdraw(uint _amount) external canWithdraw() {
    
    // @dev openzepeling implementation of transfer already checks balance
    // require(_amount <= _checkBalance(), "Withdraw exceeds Balance");  
    require(_amount > 0, "Zero tokens");

    // @dev if _holdToken is address
    // (bool success, bytes memory data) =
    //     _holdToken.call(abi.encodeWithSelector(ERC20.transfer.selector, _owner, _amount));
    // require(success && (data.length == 0 || abi.decode(data, (bool))), 'TF');
    _holdToken.transfer(msg.sender, _amount);

    emit newTransfer(_amount);
  }

  function checkBalance() public view returns(uint256){
    // @dev if _holdToken is address
    // (bool success, bytes memory data) =
    //     _holdToken.staticcall(abi.encodeWithSelector(ERC20.balanceOf.selector, address(this)));
    // require(success && data.length >= 32);
    // return abi.decode(data, (uint256));

    return _holdToken.balanceOf(address(this));
  }
}
