//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";


contract token_test is ERC20{
constructor() ERC20 ("test_coin", "tc"){

    _mint(msg.sender, 100000);

}


}