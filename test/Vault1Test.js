const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Vault 1", () => {
	beforeEach(async () => {
		const accounts  = await ethers.getSigners();
		owner = accounts[0]
		randomAccount = accounts[1]

		BurgerTokens = await ethers.getContractFactory("BurgerToken");
		burgertokens = await BurgerTokens.deploy(100);
		await burgertokens.deployed();

		Vault1 = await ethers.getContractFactory("Vault1");
		vault1 = await Vault1.deploy(burgertokens.address);
		await vault1.deployed();
	});

	it("Deposit 0 Tokens", async function() {
		await expect(vault1.connect(owner).deposit(0)
		).to.be.revertedWith("Invalid amount 0 tokens")
	});
	
	it("Withdraw 0 Tokens", async function() {
		await burgertokens.connect(owner).approve(vault1.address, 1)
		await vault1.connect(owner).deposit(1)
		await expect(vault1.connect(owner).withdraw(0)
		).to.be.revertedWith("Invalid amount 0 tokens")
	});

	it("Withdraw too many tokens", async function() {
		await burgertokens.connect(owner).approve(vault1.address, 1)
		await vault1.connect(owner).deposit(1)
		await expect(vault1.connect(owner).withdraw(2)
		).to.be.revertedWith("Insufficient funds")
	});

	it("Withdraw with random account", async function() {
		await expect(vault1.connect(randomAccount).withdraw(1)
		).to.be.revertedWith("Insufficient funds")
	});

	it("Deposit 5 Tokens", async function() {
		await burgertokens.connect(owner).approve(vault1.address, 5)
		await expect(vault1.connect(owner).deposit(5))
		.to.emit(vault1, "Deposit")
		.withArgs(owner.address, 5)
	});

	it("Withdraw Tokens", async function() {
		await burgertokens.connect(owner).approve(vault1.address, 5)
		await expect(vault1.connect(owner).deposit(5))
		.to.emit(vault1, "Deposit")
		.withArgs(owner.address, 5)

		await expect(vault1.connect(owner).withdraw(2))
		.to.emit(vault1, "Withdraw")
		.withArgs(owner.address, 2)
		
		await expect(vault1.connect(owner).withdraw(2))
		.to.emit(vault1, "Withdraw")
		.withArgs(owner.address, 2)

		await expect(vault1.connect(randomAccount).withdraw(1)
		).to.be.revertedWith("Insufficient funds")
	});

	it("Transfer tokens and test storage with another user", async function(){
		await burgertokens.connect(owner).approve(randomAccount.address, 5)
		await burgertokens.connect(owner).transfer(randomAccount.address, 4)
		await burgertokens.connect(randomAccount).approve(vault1.address, 4)
		
		await expect(vault1.connect(randomAccount).deposit(4))
		.to.emit(vault1, "Deposit")
		.withArgs(randomAccount.address, 4)
		
		await expect(vault1.connect(randomAccount).withdraw(1))
		.to.emit(vault1, "Withdraw")
		.withArgs(randomAccount.address, 1)
	});
});
