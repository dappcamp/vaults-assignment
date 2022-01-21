const { expect } = require("chai");
const { BigNumber } = require("ethers");
const { ethers } = require("hardhat");

describe("Vault 2", () => {
  beforeEach(async () => {
    Vault2 = await ethers.getContractFactory("Vault2");
    [owner, owner2] = await ethers.getSigners();

    vault2 = await Vault2.deploy();

    await vault2.deployed();
  });

  describe("mint", function () {
    it("should revert when amount is 0", async function () {
      await expect(
        vault2.connect(owner).mint({ value: ethers.utils.parseEther("0") })
      ).to.be.revertedWith("Please deposit more than 0 tokens");
    });

    it("should mint an given amount of tokens", async () => {
      let initialBalance = await vault2.balanceOf(owner.address);
      initialBalance = initialBalance.toNumber();
      await vault2
        .connect(owner)
        .mint({ value: ethers.utils.parseUnits("5", "gwei") });
      let increasedBalance = await vault2.balanceOf(owner.address);
      increasedBalance = increasedBalance.toNumber();
      expect(increasedBalance).to.equal(initialBalance + 5000000000);
    });
    it("should emit Mint event when token is minted", async function () {
      await expect(
        vault2
          .connect(owner)
          .mint({ value: ethers.utils.parseUnits("500", "wei") })
      )
        .to.emit(vault2, "Mint")
        .withArgs(500);
    });
  });
  describe("burn", function () {
    it("should revert when amount is less than balance", async function () {
      await vault2
        .connect(owner)
        .mint({ value: ethers.utils.parseUnits("500", "wei") });
      let currentBalance = await vault2.balanceOf(owner.address);
      currentBalance = currentBalance.toNumber();
      await expect(vault2.connect(owner).burn(600)).to.be.revertedWith(
        "Not enough VAULT tokens to burn"
      );
    });

    it("should burn a given amount of tokens", async () => {
      await vault2
        .connect(owner)
        .mint({ value: ethers.utils.parseUnits("500", "wei") });
      await vault2.connect(owner).burn(400);
      let decreasedBalance = await vault2.balanceOf(owner.address);
      decreasedBalance = decreasedBalance.toNumber();
      expect(decreasedBalance).to.equal(100);
    });

    it("should emit Burn event when token is burned", async function () {
      await vault2
        .connect(owner)
        .mint({ value: ethers.utils.parseUnits("500", "wei") });
      await expect(vault2.connect(owner).burn(100))
        .to.emit(vault2, "Burn")
        .withArgs(100);
    });
  });

  describe("balanceOfEth", function () {
    it("should show total balance of ether", async () => {
      let initialBalance = await vault2.balanceOfEth();
      initialBalance = initialBalance.toNumber();
      await vault2
        .connect(owner)
        .mint({ value: ethers.utils.parseUnits("500", "wei") });
      let increasedBalanceOwner1 = await vault2.balanceOfEth();
      increasedBalanceOwner1 = increasedBalanceOwner1.toNumber();
      expect(increasedBalanceOwner1).to.equal(initialBalance + 500);
      await vault2
        .connect(owner2)
        .mint({ value: ethers.utils.parseUnits("600", "wei") });
      let increasedBalanceOwner2 = await vault2.balanceOfEth();
      increasedBalanceOwner2 = increasedBalanceOwner2.toNumber();
      expect(increasedBalanceOwner2).to.equal(initialBalance + 500 + 600);
    });
  });
});
