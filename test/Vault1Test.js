const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Vault 1", () => {
	beforeEach("deploy contract", async () => {
		Vault1 = await ethers.getContractFactory("Vault1");
		[owner, account1] = await ethers.getSigners();

		vault1 = await Vault1.deploy();

		await vault1.deployed();
	});

	describe("deposit", () => {
		it("should revert when the amount is zero", async function () {
			await expect(
				vault1.connect(account1).deposit(0)
			).to.be.revertedWith("Invalid amount to deposit");
		});
	});
});
