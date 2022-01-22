*Note* - The expectation is for you to write the tests to validate the contracts follow the specs. Once you understand whats asked of the contracts, you will realize thats its not that hard to get a basic working version. Tests will take a little more work though.  You can take a look at the pet park assignment tests for some inspiration and use [this](https://hardhat.org/tutorial/testing-contracts.html) for reference


## Vault 1 Assignment

### Goal

Develop a vault where users can deposit and withdraw any ERC20 token. Complete this contract in `contracts/Vault1.sol`.

### Specifications

-   `function deposit(_amount)` - Should take in deposit amount. Assume that the contract is pre-approved to transfer that amount
-   `function withdraw(_amount)` - Should allow users to withdraw amount lesser than or equal to what they have deposited


## Vault 2 Assignment

### Goal

Develop a vault where users can wrap their ether. Users should be able to send ether and receive an equal amount of `VAULT` tokens. On burning those tokens, users should get ether back. Complete this contract in `contracts/Vault2.sol`

### Specifications

-   `function mint(_amount)` - A payable function which should take ether and mint equal amount of `VAULT` tokens.
-   `function burn(_amount)` - Should allow users to burn their tokens and get equal amount of ether back.

## Steps

-   Create a fork of this repo
-   Create a new branch with your name. You can use the following command

    ```
    git checkout -b my-name
    ```

-   Install all dependencies

    ```
    npm install
    ```

-   Run Tests
    ```
    npx hardhat test
    ```
-   Submit a PR from forked repo to main branch of this repo

## Notes

-   Prefer using OpenZeppelin contracts instead of implementing your own.
-   Use events where necessary.
-   Write tests for your contracts. Add them in `test` directory.
