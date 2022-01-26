const { expect } = require("chai");
const { ethers } = require("hardhat");


/// @title Test class for Vault1
/// @author Ashwin Rachakonda 💯💯😎💯💯
/// @notice Used for testing Vault1

describe("Vault 1", () => {
	let Token1;
	let tigerToken;
	let Vault1;
	let vault;
	let owner;

	beforeEach(async () => {
		[owner] = await ethers.getSigners();
		Token1 = await ethers.getContractFactory("Token1");
		tigerToken = await Token1.deploy();

		Vault1 = await ethers.getContractFactory("Vault1");
		vault = await Vault1.deploy();
	});

	describe("deployment", function () {
		it("assign tokens to owner", async function () {
			expect(await tigerToken.owner()).to.equal(owner.address);
		});

		it("assign all tiger tokens to owner", async function () {
			const ownerBalance = await tigerToken.balanceOf(owner.address);
			expect(await tigerToken.totalSupply()).to.equal(ownerBalance);
		});
	});

	describe("deposit", function () {
		it("should revert when amount is less than or equal to 0", async function () {
			await expect(
				vault.deposit(tigerToken.address, 0)
			).to.be.revertedWith("Amount should be more than zero");
		});

		it("deposit tokens into vault", async function () {
			await tigerToken.approve(vault.address, 100);
			await vault.deposit(tigerToken.address, 100);
			const vaultContractTigerTokenBalance = await vault.getContractTokenBalance(tigerToken.address);
			expect(await vaultContractTigerTokenBalance).to.equal(100);
			const vaultAccountBalance = await vault.getAccountBalance(tigerToken.address, owner.address);
			expect(await vaultAccountBalance).to.equal(100);
		});
	});

	describe("withdraw", function () {
		it("should revert when amount is less than or equal to 0", async function () {
			await expect(
				vault.withdraw(tigerToken.address, 0)
			).to.be.revertedWith("Amount should be more than zero");
		});

		it("withdraw tokens into account", async function () {
			await tigerToken.approve(vault.address, 100);
			await vault.deposit(tigerToken.address, 100);
			await expect(
				vault.withdraw(tigerToken.address, 200)
			).to.be.revertedWith("User's deposit balance is lesser than the amount he is trying to withdraw");

			await vault.withdraw(tigerToken.address, 50);
			const vaultContractTigerTokenBalance = await vault.getContractTokenBalance(tigerToken.address);
			expect(await vaultContractTigerTokenBalance).to.equal(50);
			const vaultAccountBalance = await vault.getAccountBalance(tigerToken.address, owner.address);
			expect(await vaultAccountBalance).to.equal(50);
		});
	});
});
