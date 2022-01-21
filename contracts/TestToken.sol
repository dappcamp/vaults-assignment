pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract TestToken is ERC20 {

    uint256 private m_id;
    constructor(uint256 _id) ERC20("TestToken", "FAKE") {
        m_id = _id;
    }

    function getSomeTestTokens(uint256 _amount) public {
        _mint(msg.sender, _amount);
    }

}
