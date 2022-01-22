const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Vault 2", () => {
  beforeEach("deploy contracts", async () => {
    const [owner] = await ethers.getSigners();
    const Vault2 = await ethers.getContractFactory("Vault2");

    vault2 = await Vault2.deploy();
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
});
