const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Vault 1", () => {
  beforeEach(async () => {
    Vault1 = await ethers.getContractFactory("Vault1");
    TestERC20 = await ethers.getContractFactory("TestERC20");
    [_, user] = await ethers.getSigners();

    testERC20 = await TestERC20.deploy(user.address, 100);
    await testERC20.deployed();

    vault1 = await Vault1.deploy(testERC20.address);
    await vault1.deployed();
  });

  describe("deposit", function () {
    describe("revert", () => {
      it("should revert deposit amount is 0", async function () {
        await expect(vault1.connect(user).deposit(0)).to.be.revertedWith(
          "Amount should be greater than 0"
        );
      });

      it("should revert if user doesn't have enough allowance.", async function () {
        await expect(vault1.connect(user).deposit(10)).to.be.revertedWith(
          "Not enough allowance"
        );
      });
    });

    describe("success", () => {
      async function depositValidAmountToVault(amount) {
        await testERC20.connect(user).increaseAllowance(vault1.address, amount);
        return vault1.connect(user).deposit(amount);
      }

      it("should emit deposited event when pet is added", async function () {
        await expect(depositValidAmountToVault(10))
          .to.emit(vault1, "Depositted")
          .withArgs(user.address, 10);
      });

      it("should increase balance in the vault and update ERC20 balances", async function () {
        // before
        expect((await testERC20.balanceOf(user.address)).toNumber()).to.equal(
          100
        );
        expect((await testERC20.balanceOf(vault1.address)).toNumber()).to.equal(
          0
        );

        await depositValidAmountToVault(10);

        // after
        expect((await vault1.balanceOf(user.address)).toNumber()).to.equal(10);

        // ERC20
        expect((await testERC20.balanceOf(user.address)).toNumber()).to.equal(
          90
        );
        expect((await testERC20.balanceOf(vault1.address)).toNumber()).to.equal(
          10
        );
      });
    });
  });
});
