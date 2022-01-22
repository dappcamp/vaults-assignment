const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Vault 1", () => {
	beforeEach(async () => {
		[owner, account] = await ethers.getSigners();

		const MockToken = await ethers.getContractFactory("ERC20Mock");
		mockToken = await MockToken.deploy("Mock Token", "MOCK", owner.address, 100);

	 	Vault1 = await ethers.getContractFactory("Vault1");
		vault1 = await Vault1.deploy(mockToken.address);

		startingAmount = 50;
		await mockToken.transfer(account.address, startingAmount);
		await mockToken.transfer(vault1.address, startingAmount);

		await vault1.deployed();

	});

	describe("deposit", function () {
		let depositAmount;

		it("should revert when tried to deposit more than is available", async function () {
			depositAmount = 101;
			await mockToken.connect(account).approve(vault1.address, depositAmount);

			await expect(
				vault1.connect(account).deposit(depositAmount)
			).to.be.revertedWith("Attemped to deposit amount greater than balance");
		});

		it("should emit deposited event", async function () {
			depositAmount = 1;
			await mockToken.connect(account).approve(vault1.address, depositAmount);

			await expect(
				vault1.connect(account).deposit(depositAmount)
			)
				.to.emit(vault1, "Deposited")
				.withArgs(depositAmount);
		});

		it("should update balances correctly", async function () {
			depositAmount = 1;
			await mockToken.connect(account).approve(vault1.address, depositAmount);
			await vault1.connect(account).deposit(depositAmount)

			const accountBalance = await mockToken.balanceOf(account.address);
			const vault1Balance = await mockToken.balanceOf(vault1.address);
			expect(accountBalance).to.equal(startingAmount - depositAmount);
			expect(vault1Balance).to.equal(startingAmount + depositAmount);
		});
	});

	describe("withdraw", function () {
		let withdrawAmount;

		it("should revert when trying to withdraw amount less than deposited", async function () {
			withdrawAmount = 1;

			await expect(
				vault1.connect(account).withdraw(withdrawAmount)
			).to.be.revertedWith("Amount must be less than the amount already deposited");
	
		});

		it("should emit withdrawn event", async function () {
			withdrawAmount = 1;

			await mockToken.connect(account).approve(vault1.address, withdrawAmount);
			await vault1.connect(account).deposit(withdrawAmount);

			await expect(
				vault1.connect(account).withdraw(withdrawAmount)
			)
				.to.emit(vault1, "Withdrawn")
				.withArgs(withdrawAmount);
		});

		it("should update balances correctly", async function () {
			withdrawAmount = 1;
			await mockToken.connect(account).approve(vault1.address, withdrawAmount + 1);
			await vault1.connect(account).deposit(withdrawAmount + 1)
			await vault1.connect(account).withdraw(withdrawAmount)

			const accountBalance = await mockToken.balanceOf(account.address);
			const vault1Balance = await mockToken.balanceOf(vault1.address);
			expect(accountBalance).to.equal(startingAmount - withdrawAmount);
			expect(vault1Balance).to.equal(startingAmount + withdrawAmount);
		});
	});
});
