pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

//erc20 token
contract SimpleToken is ERC20{

      constructor() ERC20("SimpleToken", "SIMPLE"){
        _mint(msg.sender, 10000);
    }
}
