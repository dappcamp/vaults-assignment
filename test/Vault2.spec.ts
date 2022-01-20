import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { Contract, ContractFactory } from "ethers";
import { ethers } from "hardhat";
import { Vault2 as Vault2Type } from "../typechain-types/Vault2";

describe("Vault2", () => {
  let Vault2: ContractFactory;
  let vault2: Vault2Type;
  let accounts: SignerWithAddress[];
  let owner: SignerWithAddress;
  let account1: SignerWithAddress;

  beforeEach(async () => {
    Vault2 = await ethers.getContractFactory("Vault2");

    accounts = await ethers.getSigners();
    [owner] = accounts;
    [account1] = accounts;

    vault2 = (await Vault2.deploy()) as Vault2Type;

    await vault2.deployed();
  });

  describe("mint", () => {
    it("Should revert when an invalid mint amount is provided", async () => {
      await expect(vault2.connect(account1).mint(0)).to.be.revertedWith(
        "Invalid amount, should be greater than 0."
      );
    });

    it("Should revert when the deposit amount is different to msg.value", async () => {
      await expect(
        vault2.connect(account1).mint(10, { value: 1 })
      ).to.be.revertedWith(
        "Invalid amount, it should equal the amount of Ether in the transaction."
      );
    });

    it("Should add the amount of wei specified in msg.value to the contract's balance", async () => {
      await vault2.connect(account1).mint(10, { value: 10 });

      const balance = await vault2.provider.getBalance(vault2.address);

      expect(balance).to.eq(10);
    });

    it("Should mint the amount of tokens specified in _amount", async () => {
      await vault2.connect(account1).mint(10, { value: 10 });

      const totalSupply = await vault2.totalSupply();

      expect(totalSupply).to.eq(10);
    });

    it("Should add the minted tokens to the sender's address", async () => {
      await vault2.connect(account1).mint(10, { value: 10 });

      const accountBalance = await vault2.balanceOf(account1.address);

      expect(accountBalance).to.eq(10);
    });

    it("Should emit a `Minted` event with _amount as value", async () => {
      await expect(vault2.connect(account1).mint(10, { value: 10 }))
        .to.emit(vault2, "Minted")
        .withArgs(10);
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

    it("Should send wei equivalent to _amount to msg.sender", async () => {
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
