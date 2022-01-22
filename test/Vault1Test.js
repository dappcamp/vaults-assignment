const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Vault 1", () => {
  let owner;

  beforeEach("deploy contracts", async () => {
    const [owner, token] = await ethers.getSigners();
    const Vault1 = await ethers.getContractFactory("Vault1");

    vault1 = await Vault1.deploy(owner["address"], token["address"]);
    await vault1.deployed();
  });

  describe("deposit", function () {
    // Testing to prevent negative tokens
    it("The deposit should be greater than 0", async function () {
      await expect(vault1.connect(owner).deposit(-10)).to.be.revertedWith(
        "Cannot add negative tokens"
      );
    });
    // Testing to prevent adding 0 tokens
    it("The deposit cannot equal 0", async function () {
      await expect(vault1.connect(owner).deposit(0)).to.be.revertedWith(
        "Cannot add 0 tokens"
      );
    });
  });
  describe("withdraw", function () {
    // Testing to prevent withdrawing more than on the deposit
    it("The deposit should be greater than 0", async function () {
      let depositedAmount = 10;
      await vault1.connect(owner).deposit(depositedAmount);
      let withdrawAmount = 100;
      await expect(
        vault1.connect(owner).withdraw(withdrawAmount)
      ).to.not.be.below(depositedAmount)("Withdrawing more than in the vault");
    });
  });
});
