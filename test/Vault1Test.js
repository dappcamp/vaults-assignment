const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Vault 1", () => {
	beforeEach("deploy vault contract", async () => {
		Vault1 = await ethers.getContractFactory("Vault1");
		[owner, account1] = await ethers.getSigners();
		vault1 = await Vault1.deploy();
		await vault1.deployed();
	});

	beforeEach("deploy mock erc20 contract", async () => {
		MockERC20 = await ethers.getContractFactory("MockERC20");
		[owner, account1] = await ethers.getSigners();
		mck1 = await MockERC20.deploy("Mock ERC20 token 1", "MCK1", 1000);
		mck2 = await MockERC20.deploy("Mock ERC20 token 2", "MCK2", 1000);
		await mck1.deployed();
	});

	describe("deposit", () => {
		it("should transfer erc20 from caller address to the vault address", async () => {
			let initialBalance = await mck1.balanceOf(owner.address);
			expect(initialBalance).to.equal(1000);

			await mck1.connect(owner).approve(vault1.address, 1000);
			await vault1.connect(owner).deposit(1000, mck1.address);

			// token balance
			let ownerBalance = await mck1.balanceOf(owner.address);
			let vaultBalance = await mck1.balanceOf(vault1.address);

			expect(ownerBalance).to.equal(0);
			expect(vaultBalance).to.equal(1000);

			// vault balance
			let ownerVBalance = await vault1.connect(owner).balance(mck1.address);
			expect(ownerVBalance).to.equal(1000);
		})

		it("should revert if transfer is not pre-approved", async () => {
			await expect(
				vault1.deposit(1000, mck1.address)
			).to.be.revertedWith("ERC20: transfer amount exceeds allowance");
		})
	})

	describe("withdraw", () => {
		beforeEach("deposit 500 token in vault1", async () => {
			await mck1.connect(owner).approve(vault1.address, 500);
			await vault1.connect(owner).deposit(500, mck1.address);

			let ownerBalance = await mck1.balanceOf(owner.address);
			let vaultBalance = await mck1.balanceOf(vault1.address);

			expect(ownerBalance).to.equal(500);
			expect(vaultBalance).to.equal(500);
		});
	
		it("should reject withdrawal when funds do not suffice", async () => {
			await expect(
				vault1.connect(owner).withdraw(1000, mck1.address)
			).to.be.revertedWith("Amount exceeds balance");

			let ownerBalance = await mck1.balanceOf(owner.address);
			let vaultBalance = await mck1.balanceOf(vault1.address);

			expect(ownerBalance).to.equal(500);
			expect(vaultBalance).to.equal(500);
		})

		it("should reject withdrawal for other accounts", async () => {
			await expect(
				vault1.connect(account1).withdraw(1, mck1.address)
			).to.be.revertedWith("Amount exceeds balance");
		})

		it("should keep track of balances of different ERC20 tokens separately", async () => {
			// owner has 500 mck1 in vault, but 0 mck2
			await expect(
				vault1.connect(owner).withdraw(1, mck2.address)
			).to.be.revertedWith("Amount exceeds balance");
		})

		it("should transfer erc20 from the vault address to the caller address", async () => {
			let ownerVBalance = await vault1.connect(owner).balance(mck1.address);
			expect(ownerVBalance).to.equal(500);

			await vault1.connect(owner).withdraw(1, mck1.address);

			let ownerBalance = await mck1.balanceOf(owner.address);
			let vaultBalance = await mck1.balanceOf(vault1.address);

			expect(ownerBalance).to.equal(501);
			expect(vaultBalance).to.equal(499);
		})
	})
});
