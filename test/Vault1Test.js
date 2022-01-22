const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Vault 1", () => {
	beforeEach(async () => {
		[owner, elon] = await ethers.getSigners();

		Vault1 = await ethers.getContractFactory("Vault1");
		vault1 = await Vault1.deploy();
		await vault1.deployed();

		// deploy ERC-20 contracts
		const Token1 = await ethers.getContractFactory("Token1");
		token1 = await Token1.deploy();
		await token1.deployed();

		const Token2 = await ethers.getContractFactory("Token2");
		token2 = await Token2.deploy();
		await token2.deployed();

		// Add 1000 of each token to user wallet
		await token1.connect(owner).transfer(elon.address, 1000);
		await token2.connect(owner).transfer(elon.address, 1000);

		const initialToken1Balance = await token1.balanceOf(elon.address);
		expect(initialToken1Balance).to.eq(1000);
		const initialToken2Balance = await token2.balanceOf(elon.address);
		expect(initialToken2Balance).to.eq(1000);
	});

	// Depositing
	describe("Depositing", () => {
		it("should emit a Deposit event when a deposit is successful", async () => {
			await token1.connect(elon).approve(vault1.address, 100);
			await expect(vault1.connect(elon).deposit(100, token1.address))
				.to.emit(vault1, "Deposit")
				.withArgs(elon.address, 100, token1.address);

			const vaultBalance = await token1.balanceOf(vault1.address);
			expect(vaultBalance).to.eq(100);

			const userVaultBalance = await vault1.connect(elon).getBalance(token1.address);
			expect(userVaultBalance).to.eq(100);
		})

		it("should work for other ERC20 tokens", async () => {
			await token2.connect(elon).approve(vault1.address, 100);
			await expect(vault1.connect(elon).deposit(100, token2.address))
				.to.emit(vault1, "Deposit")
				.withArgs(elon.address, 100, token2.address);

			const vaultBalance = await token2.balanceOf(vault1.address);
			expect(vaultBalance).to.eq(100);

			const userVaultBalance = await vault1.connect(elon).getBalance(token2.address);
			expect(userVaultBalance).to.eq(100);
		})

		it("should revert when a user tries to deposit more than they have", async () => {
			await token1.connect(elon).approve(vault1.address, 10000);
			await expect(vault1.connect(elon).deposit(10000, token1.address))
				.to.be.revertedWith("Insufficient balance")
		})
	})
		
	// Withdrawing
	describe("Withdrawing", () => {
		it("should emit a Withdraw event when a withdraw is successful", async () => {
			await token1.connect(elon).approve(vault1.address, 100);
			await vault1.connect(elon).deposit(100, token1.address);
			
			const vaultBalance = await token1.balanceOf(vault1.address);
			expect(vaultBalance).to.eq(100);
			
			await expect(vault1.connect(elon).withdraw(10, token1.address))
				.to.emit(vault1, "Withdraw")
				.withArgs(elon.address, 10, token1.address);
			
			const userVaultBalance = await vault1.connect(elon).getBalance(token1.address);
			expect(userVaultBalance).to.eq(90);
		})

		it("should work for other ERC20 tokens", async () => {
			await token2.connect(elon).approve(vault1.address, 100);
			await vault1.connect(elon).deposit(100, token2.address);
			
			const vaultBalance = await token2.balanceOf(vault1.address);
			expect(vaultBalance).to.eq(100);
			
			await expect(vault1.connect(elon).withdraw(10, token2.address))
				.to.emit(vault1, "Withdraw")
				.withArgs(elon.address, 10, token2.address);

			const userVaultBalance = await vault1.connect(elon).getBalance(token2.address);
			expect(userVaultBalance).to.eq(90);
		})
			
		it("should revert when a user tries to withdraw more than they have stored", async () => {
			await token1.connect(elon).approve(vault1.address, 100);
			await vault1.connect(elon).deposit(100, token1.address);
			
			const vaultBalance = await token1.balanceOf(vault1.address);
			expect(vaultBalance).to.eq(100);
			
			await expect(vault1.connect(elon).withdraw(101, token1.address))
				.to.be.revertedWith("Insufficient balance")
		})
	})
});
