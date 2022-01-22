const { expect } = require("chai");
const { ethers } = require("hardhat");
const { test } = require("mocha");


describe("Vault 1", () => {
	beforeEach("deploy contract", async () => {
		Vault1 = await ethers.getContractFactory("Vault1");
		TedToken = await ethers.getContractFactory("TedToken");
		
		[owner] = await ethers.getSigners();

		tedToken = await TedToken.deploy();
		await tedToken.deployed();

		vault1 = await Vault1.deploy(tedToken.address);

		await vault1.deployed();
	});

	describe("test tedtoken", async () => {
		it("should have total supply set", async function() {
			expect(await tedToken.totalSupply()).to.equal(10000);
			expect(await tedToken.balanceOf(owner.address)).to.equal(10000);
		});
	});

	describe("deposit", () => {
		it("should revert when there are insufficient funds", async function() {
			await expect(vault1.connect(owner).deposit(100000)).to.be.revertedWith("Does not have enough funds");
		});
		
		it("correctly adds balance to the caller", async function() {
			await tedToken.approve(vault1.address, 5000);
			await vault1.connect(owner).deposit(5000);
			expect(await tedToken.balanceOf(owner.address)).to.equal(5000);
		});

		it("should emit deposit event when account deposits", async function () {
			await tedToken.approve(vault1.address, 10); //has to approve

			await expect(vault1.connect(owner).deposit(10))
				.to.emit(vault1, "Deposit")
				.withArgs(10);
		});
	});

	describe("withdraw", () => {
		// it("should revert when the withdraw amount is more than balance ", async function() {
		// 	const currentBalance = await vault1.connect(account1).getBalance();
		// 	console.log("currentBalance: ", currentBalance.toNumber());
			
		// 	await expect(
		// 		vault1.connect(account1).withdraw(10)
		// 	).to.be.revertedWith("Invalid amount to withdraw");
		// });
		
		// it("correctly withdraws balance", async function() {
		// 	await vault1.connect(account1).deposit(100);

		// 	await vault1.connect(account1).withdraw(10);
		// 	await expect(
		// 		await vault1.connect(account1).getBalance()
		// 	).to.eq("90");
		// });

		// it("should emit withdraw event when account deposits", async function () {
		// 	await expect(vault1.connect(account1).withdraw(10))
		// 		.to.emit(vault1, "Withdraw")
		// 		.withArgs(10);
		// });
	});
});
