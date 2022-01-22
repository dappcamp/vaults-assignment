const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Vault 1", () => {
	beforeEach(async () => {
		Vault1 = await ethers.getContractFactory("Vault1");
		[owner] = await ethers.getSigners();

		vault1 = await Vault1.deploy();

		await vault1.deployed();
	});

	describe("deposit", function () {
		it("Deposit amount should be greater than zero", async function () {
			await expect(
				vault1.connect(owner).deposit(0)
			).to.be.revertedWith("Deposit amount should be greater than zero");
		});

		it("should increment the account balance", async function () {
			//sample amount to be deposited 
			let depositAmount = 7;

			//get balance before deposit
			const beforeBalance = await vault1.balanceOf(owner.address);
			
			// deposit amount
			await vault1.connect(owner).deposit(depositAmount);
	
			//get balance after deposit 
			const afterBalance = await vault1.balanceOf(owner.address);
			
			//check if the balance increased propotional to deposited amount 
			expect(afterBalance).to.equal(beforeBalance + depositAmount);
		});
	});

	describe("withdraw", function () {
		it("Withdraw amount should be greater than zero", async function () {
			await expect(
				vault1.connect(owner).withdraw(0)
			).to.be.revertedWith("Withdraw amount should be greater than zero");
		});

		it("withdraw amount should be lesser than or equal to deposited amount", async function () {			
			//get balance before withdraw
			const balance = await vault1.balanceOf(owner.address);
			
			// try to withdraw amount greater than balance
			await expect(
				vault1.connect(owner).withdraw(balance + 1)
			).to.be.revertedWith("withdraw amount should be lesser than or equal to deposited amount");
		});

		it("should decrement the account balance", async function () {			
			//deposit sufficent funds to test withdraw
			await vault1.connect(owner).deposit(1000);
			
			//sample amount to be withdraw 
			let withdrawAmount = 5;

			//get balance before withdraw
			const beforeBalance = await vault1.balanceOf(owner.address);
			
			// withdraw amount
			await vault1.connect(owner).withdraw(withdrawAmount);
	
			//get balance after withdraw 
			const afterBalance = await vault1.balanceOf(owner.address);
			
			//check if the balance decreased propotional to withdraw amount 
			expect(afterBalance).to.equal(beforeBalance - withdrawAmount);
		});
	});
});