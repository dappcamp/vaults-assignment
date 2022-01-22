const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Vault 2", () => {
  let vault2;
  let owner, account1;

  beforeEach(async () => {
    Vault2 = await ethers.getContractFactory("Vault2");
    [owner, account1] = await ethers.getSigners();

    vault2 = await Vault2.deploy();

    await vault2.deployed();
  });

  describe("Vault2 basic functionality", function () {
    it("tokens can be deposited into vault", async function () {
      await vault2.connect(account1).mint({
        value: ethers.utils.parseEther("1000"),
      });
      expect(
        await vault2.connect(account1).balanceOf(account1.address)
      ).to.equal(ethers.utils.parseEther("1000"));
    });

    it("tokens can be burned after deposit", async function () {
      await vault2.connect(account1).mint({
        value: 1000,
      });
      await vault2.connect(account1).burn(20);
      expect(
        await vault2.connect(account1).balanceOf(account1.address)
      ).to.equal(980);
    });

    it("wallet can't burn more tokens than they deposited", async function () {
      await vault2.connect(account1).mint({
        value: 1000,
      });
      await expect(vault2.connect(account1).burn(1001)).to.be.revertedWith(
        "Insufficient balance"
      );
      expect(
        await vault2.connect(account1).balanceOf(account1.address)
      ).to.equal(1000);
    });
  });
});
