// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Vault1 {
   address public vaultOwnerAddress;
   // userAddress --> erc20TokenAddress --> balance
   mapping (address => mapping(address => uint)) public users;

   event Deposit(uint amount, address tokenAddress);
   event Withdraw(uint amount, address tokenAddress);

   constructor() {
      vaultOwnerAddress = msg.sender;
   }

  function deposit(uint _amount, address _tokenAddress) public {
    uint tokenBalanceOfDepositor = IERC20(_tokenAddress).balanceOf(msg.sender);

    require(tokenBalanceOfDepositor >= _amount, "Insufficient token balance to deposit");

    IERC20(_tokenAddress).transferFrom(msg.sender, address(this), _amount);

    uint existingAmount = users[msg.sender][_tokenAddress];
    users[msg.sender][_tokenAddress] = existingAmount + _amount;

    emit Deposit(_amount, _tokenAddress);
  }

  function withdraw(uint _amount, address _tokenAddress) public {
    uint existingAmount = users[msg.sender][_tokenAddress];
    
    require(existingAmount >= _amount, "You have insufficient token balance to withdraw");

    IERC20(_tokenAddress).transfer(msg.sender, _amount);
    users[msg.sender][_tokenAddress] = existingAmount - _amount;

     emit Withdraw(_amount, _tokenAddress);
  }

  function getBalance(address _user, address _token) view public returns (uint) {
    return users[_user][_token];
  }
}