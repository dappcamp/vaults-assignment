const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Vault 1", () => {
	beforeEach(async () => {
		Vault1 = await ethers.getContractFactory("Vault1");
		TestERC20 = await ethers.getContractFactory("TestERC20");
		const accounts = await ethers.getSigners();

		owner = accounts[0];
		account1 = accounts[1];

		testERC20 = await TestERC20.deploy();

		await testERC20.deployed();
		vault1 = await Vault1.deploy(testERC20.address);

		await vault1.deployed();
		
	});
	describe("deposit", function () {
		beforeEach(async () => {
			// testERC20.balanceOf(owner.address).then(console.log);
			await testERC20.transfer(account1.address, 100);
			// testERC20.balanceOf(account1.address).then(console.log);
			await testERC20.connect(account1).approve(vault1.address, 100);
			// testERC20.allowance(account1.address, vault1.address).then(console.log);
		});


		it("Depositing 100 should work", async function () {
			await vault1.connect(account1).deposit(100);
			const account1Balance = await testERC20.balanceOf(account1.address);
			expect(account1Balance).to.equal(0);
			const vaultBalance = await testERC20.balanceOf(vault1.address);
			expect(vaultBalance).to.equal(100);
			const localBalance = await vault1.addressToAmount(account1.address);
			expect(localBalance).to.equal(100);
		});
		
		it("Depositing 200 should fail", async function () {
			await expect(vault1.connect(account1).deposit(200)).to.be.revertedWith("ERC20: transfer amount exceeds balance");
		});
	});
	
	describe("withdraw", function () {
		beforeEach(async () => {
			// testERC20.balanceOf(owner.address).then(console.log);
			await testERC20.transfer(account1.address, 100);
			// testERC20.balanceOf(account1.address).then(console.log);
			await testERC20.connect(account1).approve(vault1.address, 100);
			// testERC20.allowance(account1.address, vault1.address).then(console.log);
			await vault1.connect(account1).deposit(100);
		});


		it("withdrawing 100 should work", async function () {
			await vault1.connect(account1).withdraw(100);
			const account1Balance = await testERC20.balanceOf(account1.address);
			expect(account1Balance).to.equal(100);
			const vaultBalance = await testERC20.balanceOf(vault1.address);
			expect(vaultBalance).to.equal(0);
			const localBalance = await vault1.addressToAmount(account1.address);
			expect(localBalance).to.equal(0);
		});
		
		it("withdrawing 200 should fail", async function () {
			await expect(vault1.connect(account1).withdraw(200)).to.be.revertedWith("Not enough funds");
		});
	});
});
