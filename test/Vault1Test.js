const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Vault 1", () => {
  let owner;
  let account1;
  let startingBalance;

  beforeEach(async () => {
    Vault1 = await ethers.getContractFactory("Vault1");
    [owner] = await ethers.getSigners();

    vault1 = await Vault1.deploy();

    await vault1.deployed();
  });

  describe("deposit", function () {
    it("it take in the deposit amount", async function () {
      await expect(
        petPark.connect(account1).deposit(address, startingBalance)
      ).to.be.revertedWith("Deposit not successful!");
    });
  });
});
