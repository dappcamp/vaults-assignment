const { expect, should } = require("chai");
const { ethers } = require("hardhat");

describe("Vault 1", () => {
	let vault1;
	let owner;
	let account;

	beforeEach("deploy contract", async () => {
		vault1ContractFactory = await ethers.getContractFactory("Vault1");
		[owner, account] = await ethers.getSigners();
		vault1 = await vault1ContractFactory.deploy();
		await vault1.deployed();
	});

	describe("deposit", () => {
		it("should emit Deposit event after successful deposit", async () => {
			const DEPOSITED_AMOUNT = 10;
			await expect(vault1.connect(account).deposit(DEPOSITED_AMOUNT))
			.to.emit(vault1, "Deposit")
			.withArgs(DEPOSITED_AMOUNT);
		});
	});

	describe("withdraw", () => {
		it("should emit Withdraw event after successful withdraw", async () => {
			const DEPOSITED_AMOUNT = 10;
			await vault1.connect(account).deposit(DEPOSITED_AMOUNT);
			await expect(vault1.connect(account).withdraw(DEPOSITED_AMOUNT))
				.to.emit(vault1, "Withdraw")
				.withArgs(DEPOSITED_AMOUNT);
		});

		it("should not be able to withdraw more than deposited amount", async () => {
			const DEPOSITED_AMOUNT = 10;
			await expect(vault1.connect(account).deposit(DEPOSITED_AMOUNT));
			await vault1.connect(account).withdraw(DEPOSITED_AMOUNT);
			await expect(
				vault1.connect(account).withdraw(1)
			).to.be.revertedWith("Cannot withdraw more than balance");
		});
	});
});
