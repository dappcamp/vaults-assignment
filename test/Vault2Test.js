const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Vault 2", () => {
	beforeEach(async () => {
		Vault2 = await ethers.getContractFactory("Vault2");
		[owner, user1] = await ethers.getSigners();

		vault2 = await Vault2.deploy();

		await vault2.deployed();
	});

	describe("mint", function () {
		it("mint amount should be greater than zero", async function () {
			await expect(
				vault2.connect(user1).mint(0)
			).to.be.revertedWith("Mint amount should be greater than zero");
		});

		it("should increment the account balance", async function () {
			//sample amount to be minted 
			let mintAmount = 7;

			//get balance before mint
			const beforeBalance = await vault2.balanceOf(user1.address);
			
			// mint amount
			await vault2.connect(user1).mint(mintAmount);
	
			//get balance after mint 
			const afterBalance = await vault2.balanceOf(user1.address);
			
			//check if the balance increased propotional to minted amount 
			expect(afterBalance).to.equal(beforeBalance + mintAmount);
		});
	});

	describe("burn", function () {
		it("burn amount should be greater than zero", async function () {
			await expect(
				vault2.connect(owner).burn(0)
			).to.be.revertedWith("Burn amount should be greater than zero");
		});

		it("burn amount should be lesser than or equal to minted amount", async function () {			
			//get balance before burn
			const balance = await vault2.balanceOf(owner.address);
			
			// try to burn amount greater than balance
			await expect(
				vault2.connect(owner).burn(balance + 1)
			).to.be.revertedWith("Burn amount should be lesser than or equal to minted amount");
		});

		it("should decrement the account balance", async function () {			
			//mint sufficent funds to test burn
			await vault2.connect(owner).mint(1000);
			
			//sample amount to be burn 
			let burnAmount = 5;

			//get balance before burn
			const beforeBalance = await vault2.balanceOf(owner.address);
			
			// burn amount
			await vault2.connect(owner).burn(burnAmount);
	
			//get balance after burn 
			const afterBalance = await vault2.balanceOf(owner.address);
			
			//check if the balance decreased propotional to burn amount 
			expect(afterBalance).to.equal(beforeBalance - burnAmount);
		});
	});
});
