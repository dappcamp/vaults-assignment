const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Vault 1", () => {
	let vault1, simpletoken;
	let owner, account1, account2, account3;
	beforeEach(async () => {
		let Vault1 = await ethers.getContractFactory("Vault1");
		let SimpleToken = await ethers.getContractFactory("SimpleToken");
		[owner, account1, account2, account3] = await ethers.getSigners();
		simpletoken = await SimpleToken.deploy();
		await simpletoken.transfer(account1.address, 1000);
		await simpletoken.transfer(account2.address, 100);
		await simpletoken.transfer(account2.address, 10);

		vault1 = await Vault1.deploy(simpletoken.address);
		await vault1.deployed();
		await simpletoken.connect(account1).approve(vault1.address, 1000);
		await simpletoken.connect(account2).approve(vault1.address, 99);
	});

	it("should be able to deposit", async function () {
		let vault1Balance = await vault1.connect(account1).balances(account1.address);
		expect(vault1Balance.toNumber()).to.equal(0);
		await vault1.connect(account1).deposit(100);
		let account1Balance = await vault1.connect(account1).balances(account1.address);
		expect(account1Balance.toNumber()).to.equal(100);
	});

	it("should not be able to deposit", async function () {
		let vault1Balance = await vault1.connect(account2).balances(account1.address);
		expect(vault1Balance.toNumber()).to.equal(0);
		await expect(vault1.connect(account2).deposit(200)).to.be.revertedWith("Insufficient balance to deposit");
		let account2Balance = await vault1.connect(account1).balances(account1.address);
		expect(account2Balance.toNumber()).to.equal(0);
	});

	it('should be able to withdraw', async function () {
		await vault1.connect(account1).deposit(500);
		await vault1.connect(account1).balances(account1.address);
		await vault1.connect(account1).withdraw(100);
		let account1Balance = await vault1.connect(account1).balances(account1.address);
		expect(account1Balance.toNumber()).to.equal(400);
	});

	it("should not be able to withdraw", async function () {
		await expect(vault1.connect(account2).withdraw(200)).to.be.revertedWith("Insufficient balance to withdraw");
		let account2Balance = await vault1.connect(account1).balances(account1.address);
		expect(account2Balance.toNumber()).to.equal(0);
	});
});
