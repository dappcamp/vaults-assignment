//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;

import "hardhat/console.sol";

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";


// source: https://solidity-by-example.org/sending-ether/
contract EtherReceiver {
    /*
    Which function is called, fallback() or receive()?

           send Ether
               |
         msg.data is empty?
              / \
            yes  no
            /     \
receive() exists?  fallback()
         /   \
        yes   no
        /      \
    receive()   fallback()
    */

    // Function to receive Ether. msg.data must be empty
    receive() external payable {
    }

    // Fallback function is called when msg.data is not empty
    fallback() external payable {
    }

    function getBalance() public view returns (uint) {
        return address(this).balance;
    }
}

// Develop a vault where users can wrap their ether.
// Users should be able to send ether and receive an equal amount of VAULT tokens.
// On burning those tokens, users should get ether back.
contract Vault2 is ERC20, EtherReceiver {

    address m_owner;

    constructor() ERC20("VAULT Token", "VAULT2") {
        m_owner = msg.sender;
    }

    // region: getters
    function getBalanceEth() external view returns (uint256) {
        return getBalance();
    }

    function getBalanceVaultForUser(address _user) external view returns (uint256) {
        return balanceOf(_user);
    }

    function getBalanceVault() external view returns (uint256) {
        return balanceOf(msg.sender);
    }
    // endregion

    // region: events
    event Mint(address mintee, uint256 amount);
    event Burn(address burnee, uint256 amount);
    // endregion

    // A payable function which should take ether and mint equal amount of VAULT tokens
    function mintInner(uint256 _amount) private {
        require(_amount > 0, "invalid value of amount");
        require(msg.sender != m_owner, "contract owner cannot call: mintInner");
        require(msg.sender != address(this), "contract itself cannot call: mintInner");

        // send submitted ETH to this contract
        (bool sent,) = payable(address(this)).call{value : _amount}("");
        require(sent, "Vault failed to receive Ether");

        // mint VAULT tokens to caller in 1:1 ratio of submitted ETH
        _mint(msg.sender, _amount);

        // emit event
        emit Mint(msg.sender, _amount);
    }
    function mint() public payable {
        mintInner(msg.value);
    }

    // Should allow users to burn their tokens and get equal amount of ether back.
    function burn(uint256 _amount) public {
        // ERC20 does relevant checks for:
        // - valid caller address
        // - caller address has sufficient balance

        // send ETH back to caller
        (bool sent,) = payable(msg.sender).call{value : _amount}("");
        require(sent, "Vault failed to send back Ether");

        // burn VAULT tokens of caller
        _burn(msg.sender, _amount);

        // emit event
        emit Burn(msg.sender, _amount);
    }

}
