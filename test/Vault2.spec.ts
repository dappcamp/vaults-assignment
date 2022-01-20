import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { Contract, ContractFactory } from "ethers";
import { ethers } from "hardhat";

describe("Vault2", () => {
  let Vault2: ContractFactory;
  let vault2: Contract;
  let accounts: SignerWithAddress[];
  let owner: SignerWithAddress;
  let account1: SignerWithAddress;

  beforeEach(async () => {
    Vault2 = await ethers.getContractFactory("Vault2");

    accounts = await ethers.getSigners();
    [owner] = accounts;
    [account1] = accounts;

    vault2 = await Vault2.deploy();

    await vault2.deployed();
  });

  describe("mint", () => {
    it("Should revert when an invalid deposit amount is provided", async () => {
      await expect(vault2.connect(account1).deposit(0)).to.be.revertedWith(
        "Invalid deposit amount, must be greater than 0"
      );
    });

    it("Should revert when the deposit amount is different to msg.value", async () => {
      //
    });

    it("Should add the amount of $ETH specified in msg.value to the contract's balance", async () => {
      //
    });

    it("Should mint the amount of tokens specified in _amount", async () => {
      //
    });

    it("Should add the minted tokens to the sender's address", async () => {
      //
    });

    it("Should emit a `Minted` event with _amount as value", async () => {
      //
    });
  });

  describe("burn", () => {
    it("Should revert when an invalid burn amount is provided", async () => {
      //
    });

    it("Should revert when the user's balance is lower than the amount to burn", async () => {
      //
    });

    it("Should be able to be used by any address, even if it hasn't directly interacted with the contract before", async () => {
      //
    });

    it("Should burn $VAULT equivalent to _amount", async () => {
      //
    });

    it("Should send $ETH equivalent to _amount to msg.sender", async () => {
      //
    });

    it("Should burn $VAULT from msg.sender", async () => {
      //
    });

    it("Should emit a `Burned` event with _amount as value", async () => {
      //
    });
  });
});
