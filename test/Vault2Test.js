const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Vault 2", () => {
	beforeEach(async () => {
		Vault2 = await ethers.getContractFactory("Vault2");
		[owner, account1] = await ethers.getSigners();

		vault2 = await Vault2.deploy();

		await vault2.deployed();
	});

	describe("mint", () => {
		it("should revert if not owner", async function() {
			await expect(
				vault2.connect(account1).mint(50, { value: 50 }))
				.to.be.revertedWith("Ownable: caller is not the owner");
		});

		it("should emit Mint event when successful", async function() {
			await expect(vault2.connect(owner).mint(50, { value: 50 }))
				.to.emit(vault2, "Mint")
				.withArgs(50);
		});

		it("should revert if msg.value is different", async function() {
			await expect(
				vault2.connect(owner).mint(50, { value: 100 }))
				.to.be.revertedWith("amount does not equal to msg.value");
		});
	});

	describe("burn", () => {
		it("should revert if not owner", async function() {
			await expect(
				vault2.connect(account1).burn(50, { value: 50 }))
				.to.be.revertedWith("Ownable: caller is not the owner");
		});

		it("should emit Burn event when successful", async function() {
			await expect(vault2.connect(owner).mint(50, { value: 50 }));

			await expect(vault2.connect(owner).burn(50, { value: 50 }))
				.to.emit(vault2, "Burn")
				.withArgs(50);
		});

		it("allow burning up to deposited amount", async function() {
			await expect(vault2.connect(owner).mint(50, { value: 50 }));
			await expect(vault2.connect(owner).burn(100))
				.to.be.revertedWith("ERC20: burn amount exceeds balance");
		});
	});
});
