const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Vault 1", () => {
  let owner;
  let token;

  beforeEach("deploy contracts", async () => {
    const accounts = await ethers.getSigners();
    const Token1 = await ethers.getContractFactory("VaultToken");
    owner = accounts[0];

    const Vault1 = await ethers.getContractFactory("Vault1");

    token = await Token1.deploy();
    await token.deployed();

    vault1 = await Vault1.deploy();
    await vault1.deployed();
  });

  describe("deposit", function () {
    // Testing to prevent adding 0 tokens
    it("The deposit cannot equal 0", async function () {
      await expect(vault1.connect(owner).deposit(0)).to.be.revertedWith(
        "Cannot add 0 tokens"
      );
    });
    // Testing to ensure that we are adding the right values
    it("The deposit increases by expected amount", async function () {
      let depositAmount = 10;
      const originalBalance = await vault1.connect(owner).checkBalance();
      await vault1.connect(owner).deposit(depositAmount);
      const newBalance = await vault1.connect(owner).checkBalance();
      await expect(originalBalance + depositAmount == newBalance);
    });
    it("Deposits should emit borrowed event when deposit occurs", async function () {
      let depositAmount = 10;

      await expect(vault1.connect(owner).deposit(depositAmount))
        .to.emit(vault1, "depositEvent")
        .withArgs(depositAmount);
    });
  });
  describe("withdraw", function () {
    // Testing to prevent adding 0 tokens
    it("You cannot withdraw 0 tokens", async function () {
      await expect(vault1.connect(owner).withdraw(0)).to.be.revertedWith(
        "Cannot withdraw 0 tokens"
      );
    });
    // Testing to ensure that we are adding the right values
    it("The withdrawal cannot be more than what was deposited", async function () {
      let depositAmount = 100;
      let withdrawAmount = 150;
      await vault1.connect(owner).deposit(depositAmount);
      await expect(
        vault1.connect(owner).withdraw(withdrawAmount)
      ).to.be.revertedWith("You cannot withdraw more than what you have");
    });
    it("Withdrawals should emit borrowed event when deposit occurs", async function () {
      let depositAmount = 100;
      await vault1.connect(owner).deposit(depositAmount);

      let withdrawalAmount = 10;
      await expect(vault1.connect(owner).withdraw(withdrawalAmount))
        .to.emit(vault1, "withdrawalEvent")
        .withArgs(withdrawalAmount);
    });
  });
});
