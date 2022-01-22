const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Vault 2", () => {
	beforeEach(async () => {
		Vault2 = await ethers.getContractFactory("Vault2");
		[account] = await ethers.getSigners();

		vault2 = await Vault2.deploy();

		await vault2.deployed();
	});

	describe("mint", function () {
		it("should revert if amount isn't equal to eth sent", async function () {
			mintAmount = 1;

			await expect(
				vault2.connect(account).mint(mintAmount)
			).to.be.revertedWith("Amount must equal eth sent");
		});

		it("should emit minted event", async function () {
			mintAmount = 1;

			await expect(
				vault2.connect(account).mint(mintAmount, {value: mintAmount})
			)
				.to.emit(vault2, "Minted")
				.withArgs(mintAmount);
		});

		it("should update token balance", async function () {
			mintAmount = 1;

			await vault2.connect(account).mint(mintAmount, {value: mintAmount})

			const balance = await vault2.balanceOf(account.address);
			expect(balance).to.equal(mintAmount);
		});
	});

	describe("burn", function () {
		it("should revert if account has fewer tokens than trying to burn", async function () {
			burnAmount = 1;

			//await vault2.connect(account).approve(vault2.address, burnAmount);

			await expect(
				vault2.connect(account).burn(burnAmount)
			).to.be.reverted;
		});

		it("should emit burned event", async function () {
			burnAmount = 1;

			await vault2.connect(account).mint(burnAmount * 2, {value: burnAmount * 2})

			await expect(
				vault2.connect(account).burn(burnAmount)
			)
				.to.emit(vault2, "Burned")
				.withArgs(burnAmount);
		});

		it("should update token balance", async function () {
			burnAmount = 1;

			await vault2.connect(account).mint(burnAmount * 2, {value: burnAmount * 2})
			await vault2.connect(account).burn(burnAmount)


			const balance = await vault2.balanceOf(account.address);
			expect(balance).to.equal(burnAmount);
		});
	});
});
