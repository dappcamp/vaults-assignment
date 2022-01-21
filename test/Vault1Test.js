const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Vault 1", () => {
  const tokenAddress = "0x6b175474e89094c44da98b954eedeac495271d0f";
  beforeEach(async () => {
    Vault1 = await ethers.getContractFactory("Vault1");
    [user1, user2] = await ethers.getSigners();

    vault1 = await Vault1.deploy(tokenAddress);

    await vault1.deployed();
  });
  describe("deposit", function () {
    it("should revert when amount is 0", async function () {
      await expect(vault1.connect(user1).deposit(0)).to.be.revertedWith(
        "Deposit more than 0"
      );
    });

    it("should add the amount to the user's balance", async () => {
      const tokenAmount = 4;
      let initialBalance = await vault1.balancesOf(user1.address);
      initialBalance = initialBalance.toNumber();
      await vault1.connect(user1).deposit(tokenAmount);
      let increasedBalance = await vault1.balancesOf(user1.address);
      increasedBalance = increasedBalance.toNumber();
      expect(increasedBalance).to.equal(initialBalance + tokenAmount);
    });

    it("should set userExists true", async () => {
      let initialUserExists = await vault1.userExists(user1.address);
      expect(initialUserExists).to.equal(false);
      await vault1.connect(user1).deposit(2);
      let userExists = await vault1.userExists(user1.address);
      expect(userExists).to.equal(true);
    });

    it("should emit deposit event when token is deposited", async function () {
      await expect(vault1.connect(user1).deposit(5))
        .to.emit(vault1, "Deposit")
        .withArgs(user1.address, 5);
    });
  });
  describe("withdraw", function () {
    it("should revert when the user is not an existing user", async function () {
      await expect(vault1.connect(user2).withdraw(2)).to.be.revertedWith(
        "You don't have a deposit here"
      );
    });

    it("should revert if the user's balance is smaller than the amount to withdraw", async function () {
      let amountToWithdraw = 5;
      await vault1.connect(user1).deposit(4);
      await expect(
        vault1.connect(user1).withdraw(amountToWithdraw)
      ).to.be.revertedWith("Not enough tokens");
    });

    it("should decrease the balance by the amount withdrawn", async () => {
      let initialBalance = await vault1.balancesOf(user1.address);
      initialBalance = initialBalance.toNumber();
      await vault1.connect(user1).deposit(4);
      await vault1.connect(user1).withdraw(3);
      let finalBalance = await vault1.balancesOf(user1.address);
      finalBalance = finalBalance.toNumber();
      expect(finalBalance).to.equal(initialBalance + 1);
    });

    it("should emit Withdraw event when token is withdrawn", async function () {
      await vault1.connect(user1).deposit(4);
      await expect(vault1.connect(user1).withdraw(2))
        .to.emit(vault1, "Withdraw")
        .withArgs(user1.address, 2);
    });
  });
});
