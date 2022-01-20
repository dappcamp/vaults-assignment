//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Vault2 is ERC20 {
    event Deposit(address indexed _from, uint256 amount);
    event Withdraw(address indexed _to, uint256 amount);

    constructor() ERC20("VAULT", "VLT") {}

    function mint() public payable {
        _mint(msg.sender, msg.value);
        emit Deposit(msg.sender, msg.value);
    }

    function burn(uint256 _amount) public {
        require(balanceOf(msg.sender) >= _amount);
        _burn(msg.sender, _amount);
        payable(msg.sender).transfer(_amount);
        emit Withdraw(msg.sender, _amount);
    }
}
