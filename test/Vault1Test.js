const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Vault 1", () => {
	beforeEach("deploy contract", async () => {
		Vault1 = await ethers.getContractFactory("Vault1");
		[owner, account1] = await ethers.getSigners();

		vault1 = await Vault1.deploy(account1.address);

		await vault1.deployed();
	});

	describe("deposit", () => {
		it("should revert when the amount is zero", async function() {
			await expect(
				vault1.connect(account1).deposit(0)
			).to.be.revertedWith("Invalid amount to deposit");
		});
		
		it("correctly adds balance to the caller", async function() {
			await vault1.connect(account1).deposit(10);

			const accountBalance = await vault1.balanceOf(account1.address);
			console.log("accountBalance", accountBalance);
			await expect(accountBalance.toNumber()).to.eq(20);
		});

		// it("should emit deposit event when account deposits", async function () {
		// 	await expect(vault1.connect(account1).deposit(10))
		// 		.to.emit(vault1, "Deposit")
		// 		.withArgs(10);
		// });
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
