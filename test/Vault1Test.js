const { expect } = require("chai");
const { Wallet } = require("ethers");
const { ethers } = require("hardhat");

describe("Vault 1", () => {
	beforeEach(async () => {
		Vault1 = await ethers.getContractFactory("Vault1");
		[owner] = await ethers.getSigners();
		vault1 = await Vault1.deploy();
		await vault1.deployed();
	});

	describe("deposit", function () {
		it("Deposit should revert when the amount is less than or equal to zero.", async function () {
			await expect( vault1.connect(owner).deposit(0)
			).to.be.revertedWith("Deposit amount must be greater than zero.");
		});
	});

	describe("deposit", function () {
		it("Deposit should correctly add to current balance.", async function () {	
			let currentBalance = await vault1.balance(owner.address);
			await vault1.connect(owner).deposit(1);
            let balanceAfterDeposit =  await vault1.balance(owner.address);
			await expect(balanceAfterDeposit).to.equal(currentBalance + 1);
		});
	});	

	describe("withdraw", function () {
		it("Withdraw should revert when amount if less than or equal to zero.", async function () {
			await expect(vault1.connect(owner).withdraw(0)
			).to.be.revertedWith("Withdraw amount must be greater than zero.");
		});
	});

	describe("withdraw", function () {
		it("Withdraw should revert when the amount is greater than deposited amount.", async function () {
			await expect(vault1.connect(owner).withdraw(1)

			).to.be.revertedWith("Withdraw amount greater than balance.");
		});
	}); 
});