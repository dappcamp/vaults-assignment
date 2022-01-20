const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Vault 1", () => {
	beforeEach(async () => {
		Vault1 = await ethers.getContractFactory("Vault1");
		const accounts = await ethers.getSigners();

		owner = accounts[0];
		account1 = accounts[1];

		vault1 = await Vault1.deploy();

		await vault1.deployed();
	});

	describe("deposit", function () {
		it("should let anyone deposit token", async function () {
			await expect(
				vault1.connect(account1).add(AnimalType.Fish, 5)
			).to.be.revertedWith("Not an owner");
		});

		it("should revert when invalid animal is provided", async function () {
			await expect(
				vault1.connect(owner).add(AnimalType.None, 5)
			).to.be.revertedWith("Invalid animal");
		});

		it("should emit added event when pet is added", async function () {
			await expect(vault1.connect(owner).add(AnimalType.Fish, 5))
				.to.emit(vault1, "Added")
				.withArgs(AnimalType.Fish, 5);
		});
	});
});
