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

		// Add 1000 tokens to everyone's wallets
		await token1.connect(owner).transfer(elon.address, 1000);

		const initialBalance = await token1.balanceOf(elon.address);
		expect(initialBalance).to.eq(1000);
	});

	// Depositing
	it("should emit a Deposit event when a deposit is successful", async () => {
		await token1.connect(elon).approve(vault1.address, 100);
		await expect(vault1.connect(elon).deposit(100, token1.address))
			.to.emit(vault1, "Deposit")
			.withArgs(elon.address, 100, token1.address);

		const vaultBalance = await token1.balanceOf(vault1.address);
		expect(vaultBalance).to.eq(100);
	})

	it("should revert when a user tries to deposit more than they have", async () => {
		await token1.connect(elon).approve(vault1.address, 10000);
		await expect(vault1.connect(elon).deposit(10000, token1.address))
			.to.be.revertedWith("Insufficient balance")
	})
		
	// Withdrawing
	it("should emit a Withdraw event when a withdraw is successful", async () => {
		await token1.connect(elon).approve(vault1.address, 100);
		await vault1.connect(elon).deposit(100, token1.address);
		
		const vaultBalance = await token1.balanceOf(vault1.address);
		expect(vaultBalance).to.eq(100);
		
		await expect(vault1.connect(elon).withdraw(100, token1.address))
			.to.emit(vault1, "Withdraw")
			.withArgs(elon.address, 100, token1.address);
	})
		
	it("should revert when a user tries to withdraw more than they have stored", async () => {
		await token1.connect(elon).approve(vault1.address, 100);
		await vault1.connect(elon).deposit(100, token1.address);
		
		const vaultBalance = await token1.balanceOf(vault1.address);
		expect(vaultBalance).to.eq(100);
		
		await expect(vault1.connect(elon).withdraw(101, token1.address))
			.to.be.revertedWith("Insufficient balance")
	})
});
