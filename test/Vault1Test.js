const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Vault 1", () => {
	beforeEach(async () => {
		Vault1 = await ethers.getContractFactory("Vault1");
		Token = await ethers.getContractFactory("Token");

		const accounts = await ethers.getSigners();
		owner = accounts[0];
		account1 = accounts[1];
		account2 = accounts[2];

		token = await Token.deploy(); 		
		await token.deployed();

		vault1 = await Vault1.deploy(token.address);
		await vault1.deployed();

	});

	describe("deposit", function () {
		beforeEach(async () => {
			await token.transfer(account1.address, 500);

			// spec "says Assume that the contract is pre-approved to transfer that amount"
			await token.connect(account1).approve(vault1.address, 250);
		});

		it("deposit should not work with 0 amount", async function () {
			await expect(vault1.connect(account1).deposit(0)).to.be.revertedWith("Invalid deposit amount");
		});

		// Ethers won't let me provide an invalid negative amount
		// it("deposit should not work with negative amount", async function () {
		// 	expect(vault1.connect(account1).deposit(-10)).to.be.revertedWith("Invalid deposit amount: negative");
		// });

		it("deposit should not work with amount exceeding how much they own", async function () {
			await expect(vault1.connect(account1).deposit(501)).to.be.revertedWith("Insufficient balance");
		});

		it("deposit should remove coins from account and put in vault", async function () {
			await vault1.connect(account1).deposit(250);

			const account1Balance = await token.balanceOf(account1.address);
			expect(account1Balance).to.equal(250);

			const tokenAmount = await vault1.vaultBalances(account1.address);
			expect(tokenAmount).to.equal(250);
		});

	});

	describe("withdraw", function () {
		beforeEach(async () => {
			await token.transfer(account1.address, 500);

			// TODO: from a testing standpoint, is it better if I directly change the state of the vault
			// and then run the withdraw functions, rather than calling deposit on it here? 
			await token.connect(account1).approve(vault1.address, 250);
			await vault1.connect(account1).deposit(250);

		});

		it("withdraw should not work with 0 amount", async function () {
			await expect(vault1.connect(account1).withdraw(0)).to.be.revertedWith("Invalid withdraw amount");
		});

		it("should not be able to withdraw more than deposited", async function () {
			await expect(vault1.connect(account1).withdraw(251)).to.be.revertedWith("Insufficient balance in vault");
		});

		// Is this test unnecessary? 
		it("someone else should not be able to withdraw the coins", async function () {
			await expect(vault1.connect(account2).withdraw(1)).to.be.revertedWith("Insufficient balance in vault");
		});

		it("withdraw should remove coins from vault and go back to sender", async function () {
			await vault1.connect(account1).withdraw(125);

			const account1Balance = await token.balanceOf(account1.address);
			expect(account1Balance).to.equal(375);

			const tokenAmount = await vault1.vaultBalances(account1.address);
			expect(tokenAmount).to.equal(125);
		});
	});
});
