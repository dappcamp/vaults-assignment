//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;

import "hardhat/console.sol";

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

// TODO: just make Vault2 the token
// basic VAULT token
contract VaultToken is ERC20 {

    address m_owner;

    constructor() ERC20("VAULT Token", "VAULT") {
        m_owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == m_owner, "must be called by owner");
        _;
    }

    function mint(address _account, uint _amount) public onlyOwner {
        // mint VAULT tokens to contract owner for requested amount
        _mint(_account, _amount);
    }
    //    function mint(uint _amount) public onlyOwner {
    //        // mint VAULT tokens to contract owner for requested amount
    //        _mint(msg.sender, _amount);
    //    }
    //    function burn(uint _amount) public onlyOwner {
    //        // burn VAULT tokens of
    //        _burn(msg.sender, _amount);
    //    }
    function burn(address _account, uint _amount) public onlyOwner {
        _burn(_account, _amount);
    }
}

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
        console.log("In[EtherReceiver::receive]");
    }

    // Fallback function is called when msg.data is not empty
    fallback() external payable {
        console.log("In[EtherReceiver::fallback]");
    }

    function getBalance() public view returns (uint) {
        return address(this).balance;
    }
}

// Develop a vault where users can wrap their ether.
// Users should be able to send ether and receive an equal amount of VAULT tokens.
// On burning those tokens, users should get ether back.
// TODO: remove when ready
contract Vault2 is EtherReceiver {// } is ERC20 {

    address m_owner;
    // TODO: remove when ready
    uint m_eth_treasury;
    // TODO: ETH receiving issues separate; make Vault2 inherit ERC20
    VaultToken m_vault_token;

    // TODO: remove comment
    constructor() {// ERC20("VAULT Token", "VAULT") {
        m_owner = msg.sender;
        m_vault_token = new VaultToken();
    }

    function getBalanceEth() external view returns (uint) {
        return getBalance();
    }
    function getBalanceVaultForUser(address _user) external view returns(uint) {
        return m_vault_token.balanceOf(_user);
    }
    function getBalanceVault() external view returns(uint) {
        return m_vault_token.balanceOf(msg.sender);
    }


    //TODO: for mint
    //Guard against re-entrancy by
    //
    //making all state changes before calling other contracts
    //using re-entrancy guard modifier

    // A payable function which should take ether and mint equal amount of VAULT tokens
    function mintInner(uint256 _amount) private {
        require(_amount > 0, "invalid value of amount");
        require(msg.sender != m_owner, "contract owner cannot call: mintInner");
        require(msg.sender != address(this), "contract itself cannot call: mintInner");
        uint caller_balance_eth = msg.sender.balance;
        console.log("_amount: %d", _amount);
        console.log("caller_balance_eth: %d", caller_balance_eth);

        // send submitted ETH to this contract
//        payable(address(this)).transfer(_amount);
        (bool sent,) = payable(address(this)).call{value : _amount}("");
        require(sent, "Vault failed to receive Ether");

        // mint VAULT tokens to caller in 1:1 ratio of submitted ETH
        m_vault_token.mint(msg.sender, _amount);
    }
    function mint() public payable {
        mintInner(msg.value);
    }

    // Should allow users to burn their tokens and get equal amount of ether back.
    function burn(uint _amount) public {
        // ERC20 does relevant checks for:
        // - valid caller address
        // - caller address has sufficient balance

        // send ETH back to caller
        (bool sent,) = payable(msg.sender).call{value : _amount}("");
        require(sent, "Vault failed to send back Ether");

        // burn VAULT tokens of caller
        m_vault_token.burn(msg.sender, _amount);
    }

}
