const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Vault 1", () => {
  let owner;
  let token;

  beforeEach("deploy contracts", async () => {
    const accounts = await ethers.getSigners();
    owner = accounts[0];
    account1 = accounts[0];

    const Vault2 = await ethers.getContractFactory("Vault2");
    vault2 = await Vault2.deploy();
    await vault2.deployed();
  });

  describe("mintTokens", function () {
    // Testing to prevent adding 0 tokens
    it("The amount sent must be a non-negative, non-zero number", async function () {
      await expect(
        vault2.connect(owner).mintTokens(account1["address"], 0)
      ).to.be.revertedWith("You must put a non-zero, positive deposit");
    });
    // Testing to ensure that the owner receives tokens
    it("The amount sent must be equal the amount requested", async function () {
      let depositAmount = 10;
      const originalBalance = await vault2
        .connect(owner)
        .checkBalance(account1["address"]);
      await vault2
        .connect(owner)
        .mintTokens(account1["address"], depositAmount);
      const newBalance = await vault2
        .connect(owner)
        .checkBalance(account1["address"]);
      await expect(originalBalance + depositAmount == newBalance);
    });
    // Testing to ensure that we are emitting events
    it("Mints should emit minting event when minting occurs", async function () {
      let depositAmount = 10;
      let address = account1["address"];
      await expect(
        vault2
          .connect(owner)
          .mintTokens(address, depositAmount)
          .to.emit(vault2, "tokensMinted")
          .withArgs(address, depositAmount)
      );
    });
  });
  describe("burnTokens", function () {
    // Testing to prevent adding 0 tokens
    it("The amount burnt must be a non-negative, non-zero number", async function () {
      await expect(
        vault2.connect(owner).burnTokens(account1["address"], 0)
      ).to.be.revertedWith("You must put a non-zero, positive deposit");
    });
    // Testing to ensure that the owner burn matches in new balance
    it("The amount burnt must match the new balance", async function () {
      let depositAmount = 10;
      let burnAmount = 5;
      await vault2
        .connect(owner)
        .mintTokens(account1["address"], depositAmount);
      const originalBalance = await vault2
        .connect(account1["address"], depositAmount)
        .checkBalance(account1["address"]);
      await vault2.connect(owner).burnTokens(account1["address"], burnAmount);
      const newBalance = await vault2
        .connect(account1["address"], depositAmount)
        .checkBalance(account1["address"]);
      await vault2.connect(owner).burnTokens(account1["address"], burnAmount);
      await expect(originalBalance - burnAmount == newBalance);
    });
    it("Burns should emit burning event when burning occurs", async function () {
      let depositAmount = 10;
      let burnAmount = 5;
      await vault2
        .connect(owner)
        .mintTokens(account1["address"], depositAmount);
      await vault2
        .connect(owner)
        .mintTokens(account1["address"], burnAmount)
        .to.emit(vault2, "tokensBurned")
        .withArgs(account1["address"], burnAmount);
    });
  });
});
