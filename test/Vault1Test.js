const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Vault 1", async () => {

	let vault1;
	let owner;

	beforeEach(async () => {
		const Vault1 = await ethers.getContractFactory("Vault1");
		[owner] = await ethers.getSigners();

		vault1 = await Vault1.deploy();

		await vault1.deployed();
	});

	describe("deposit", async () => {
		it("Should emit the event deposit", async function () {
			await expect(
				vault1.connect(owner).deposit(10))
				.to.emit(vault1, "deposited")
				.withArgs(10);
		});
	});

	describe("withdraw", async () => {
		it("Should  revert if withdraw amount is more than vault balance", async () => {
			await vault1.connect(owner).deposit(10);

			await expect (
				vault1.connect(owner).withdraw(11)
			).to.be.revertedWith("Insufficient vault balance");
		});

		it("Should emit event withdraw on withdrawing", async () => {
			await vault1.connect(owner).deposit(10);

			await expect (
				vault1.connect(owner).withdraw(10)
			).to.emit(vault1, "withdrawed")
			.withArgs(10);
		});

	
	});

});
