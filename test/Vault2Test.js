const { expect } = require("chai");
const { BigNumber } = require("ethers");
const { ethers } = require("hardhat");

describe("Vault 2", () => {
  beforeEach(async () => {
    Vault2 = await ethers.getContractFactory("Vault2");
    [_, user] = await ethers.getSigners();

    vault2 = await Vault2.deploy();

    await vault2.deployed();
  });

  async function mintValidAmount(amount) {
    return vault2.connect(user).mint(amount, { value: amount });
  }

  describe("mint", function () {
    describe("revert", () => {
      it("should revert deposit amount is 0", async function () {
        await expect(vault2.connect(user).mint(0)).to.be.revertedWith(
          "Amount should be greater than 0"
        );
      });

      it("should revert if user doesn't send enough ETH.", async function () {
        await expect(
          vault2.connect(user).mint(10, { value: 0 })
        ).to.be.revertedWith("Amount doesn't match the value of ETH sent");
      });

      it("should revert if user sends too much ETH.", async function () {
        await expect(
          vault2.connect(user).mint(10, { value: 20 })
        ).to.be.revertedWith("Amount doesn't match the value of ETH sent");
      });
    });

    describe("success", () => {
      it("should emit minted event when minting succeeds", async function () {
        await expect(mintValidAmount(10))
          .to.emit(vault2, "Minted")
          .withArgs(user.address, 10);
      });

      it("should increase user's balance and total supply when minting succeeds", async function () {
        // before
        expect((await vault2.balanceOf(user.address)).toNumber()).to.equal(0);
        expect((await vault2.totalSupply()).toNumber()).to.equal(0);

        await mintValidAmount(10);

        // after
        expect((await vault2.balanceOf(user.address)).toNumber()).to.equal(10);
        expect((await vault2.totalSupply()).toNumber()).to.equal(10);
      });

      it("should transfer ETH from user to Vault", async function () {
        // before
        const provider = ethers.provider;
        const initialBalance = await provider.getBalance(user.address);
        expect((await provider.getBalance(vault2.address)).toNumber()).to.equal(
          0
        );

        await mintValidAmount(10);

        // after
        expect((await provider.getBalance(vault2.address)).toNumber()).to.equal(
          10
        );

        const finalBalance = await provider.getBalance(user.address);
        // finalBalance of user should be less than initialBalance-10 (considering gas)
        expect(finalBalance.lte(initialBalance.sub(10))).to.equal(true);
      });
    });
  });

  describe("burn", function () {
    describe("revert", () => {
      it("should revert deposit amount is 0", async function () {
        await expect(vault2.connect(user).burn(0)).to.be.revertedWith(
          "Amount should be greater than 0"
        );
      });

      it("should revert if user tries to burn more than they have.", async function () {
        await mintValidAmount(10);

        await expect(vault2.connect(user).burn(20)).to.be.revertedWith(
          "Amount shouldn't be more than the balance"
        );
      });
    });

    describe("success", () => {
      it("should emit burned event when minting succeeds", async function () {
        await mintValidAmount(10);

        await expect(vault2.connect(user).burn(10))
          .to.emit(vault2, "Burned")
          .withArgs(user.address, 10);
      });

      it("should decrease user's balance and total supply when burn succeeds", async function () {
        await mintValidAmount(10);

        // before
        expect((await vault2.balanceOf(user.address)).toNumber()).to.equal(10);
        expect((await vault2.totalSupply()).toNumber()).to.equal(10);

        await vault2.connect(user).burn(1);

        // after
        expect((await vault2.balanceOf(user.address)).toNumber()).to.equal(9);
        expect((await vault2.totalSupply()).toNumber()).to.equal(9);
      });

      it("should transfer ETH from Vault to user", async function () {
        const oneEth = BigNumber.from(10).pow(18);
        const tenEth = oneEth.mul(10);
        const nineEth = tenEth.sub(oneEth);

        await mintValidAmount(tenEth);

        // before
        const provider = ethers.provider;
        const initialVaultBalance = await provider.getBalance(vault2.address);
        const initialUserBalance = await provider.getBalance(user.address);

        const burnAmount = tenEth;
        await vault2.connect(user).burn(burnAmount);

        // after
        expect((await provider.getBalance(vault2.address)).toNumber()).to.equal(
          initialVaultBalance.sub(burnAmount)
        );

        const finalUserBalance = await provider.getBalance(user.address);
        const userEthBalanceIncrease = finalUserBalance.sub(initialUserBalance);
        // user's balance should increase at least 9 ETH considering any gas
        expect(userEthBalanceIncrease.gte(nineEth)).to.equal(true);
      });
    });
  });
});
