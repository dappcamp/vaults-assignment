const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Vault 1", () => {
  beforeEach(async () => {
    Vault1 = await ethers.getContractFactory("Vault1");
    [owner] = await ethers.getSigners();

    vault1 = await Vault1.deploy(owner.address);

    await vault1.deployed();
  });

  describe("deposit", function () {
    it("should revert deposit amount is 0", async function () {
      await expect(vault1.connect(owner).deposit(0)).to.be.revertedWith(
        "Amount should be greater than 0"
      );
    });

    it("should revert if user doesn't have enough balance.", async function () {
      await expect(
        vault1.connect(owner).add(AnimalType.None, 5)
      ).to.be.revertedWith("Invalid animal");
    });

    it("should emit deposited event when pet is added", async function () {
      await expect(vault1.connect(owner).add(AnimalType.Fish, 5))
        .to.emit(vault1, "Depositted")
        .withArgs(AnimalType.Fish, 5);
    });
  });
});
