const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Vault 1", () => {
	beforeEach(async () => {
		[owner, account1, account2, account3] = await ethers.getSigners();
		Zeichen = await ethers.getContractFactory("MintableToken");
		zeichen = await Zeichen.deploy("Zeichen", "ZCN");
		await zeichen.deployed();

		Vault1 = await ethers.getContractFactory("Vault1");
		vault1 = await Vault1.deploy(zeichen.address);
		await vault1.deployed();

		// Accounts 1,2,3 start with ZCN 1000 each. 
		await zeichen.connect(owner).mint(account1.address, 1000);
		await zeichen.connect(owner).mint(account2.address, 1000);
		await zeichen.connect(owner).mint(account3.address, 1000);
	});

	describe("Deposit", function () {
		it("should emit deposited event when a deposit is made & decrease account balance", async function () {
			await zeichen.connect(account1).approve(vault1.address, 50);
			await expect(vault1.connect(account1).deposit(50))
				.to.emit(vault1, "Deposited")
				.withArgs(account1.address, 50);
			account1_balance = await zeichen.balanceOf(account1.address);
			vault1_balance = await zeichen.balanceOf(vault1.address);
			await expect(account1_balance).to.equal(950);
			await expect(vault1_balance).to.equal(50);
			
		});
		it("should revert when there is insufficient balance for deposit", async function () {
			await zeichen.connect(account1).approve(vault1.address, 1200);
			await expect(
				vault1.connect(account1).deposit(1200)
			).to.be.revertedWith("Insufficient account balance for deposit");
		});
	});

	describe("Withdrawal", function () {
		it("should emit withdrawal event when a withdrawal is made & increase account balance", async function () {
			await zeichen.connect(account1).approve(vault1.address, 50);
			await vault1.connect(account1).deposit(50);
			await expect(vault1.connect(account1).withdraw(40))
				.to.emit(vault1, "Withdrawn")
				.withArgs(account1.address, 10);
				account1_balance = await zeichen.balanceOf(account1.address);
				vault1_balance = await zeichen.balanceOf(vault1.address);
				await expect(account1_balance).to.equal(990);
				await expect(vault1_balance).to.equal(10);
		});
		it("should revert when there is insufficient deposit to withdraw", async function () {
			await zeichen.connect(account1).approve(vault1.address, 500);
			await vault1.connect(account1).deposit(500);
			await expect(
				vault1.connect(account1).withdraw(800)
			).to.be.revertedWith("Insufficient deposit balance for withdrawal");
		});
	});
});
