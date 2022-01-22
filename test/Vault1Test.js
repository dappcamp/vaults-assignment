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
		it("should revert when invalid amount is entered for deposit", async function () {
			await expect( vault1.connect(owner).deposit(1)
			).to.be.revertedWith("Enter valid amount");
		});

	});

	describe("deposit", function () {
		it("should add the correct deposit amount to balance", async function () {
			let openingBal = await vault1.balance(owner.address);
			await vault1.connect(owner).deposit(5);
            let endingBal =  await vault1.balance(owner.address);
			await expect(endingBal).to.equal(openingBal + 5);
		});

	});


	describe("withdraw", function () {
		it("should revert when invalid amount is entered for withdrawal", async function () {
			await expect( vault1.connect(owner).withdraw(0)
			).to.be.revertedWith("Enter valid amount");
		});

	});

		describe("withdraw", function () {
		it("should revert when withdrawal amount is too large", async function () {
			await expect( vault1.connect(owner).withdraw(50)
			).to.be.revertedWith("Withdrawal amount too high");
		});

	});

});