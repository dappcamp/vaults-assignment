const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Vault 1", () => {
	beforeEach(async () => {
		Vault1 = await ethers.getContractFactory("Vault1");
		[owner, account] = await ethers.getSigners();

		vault1 = await Vault1.deploy();

		await vault1.deployed();

		DynamiteToken = await ethers.getContractFactory("DynamiteToken");

		dynamiteToken = await DynamiteToken.deploy();

		await dynamiteToken.deployed();

		PiolinToken = await ethers.getContractFactory("PiolinToken");

		piolinToken = await PiolinToken.deploy();

		await piolinToken.deployed();

		await dynamiteToken.connect(owner).approve(vault1.address, 5);
		await vault1.connect(owner).deposit(5, dynamiteToken.address);
		await piolinToken.connect(owner).approve(vault1.address, 3);
		await vault1.connect(owner).deposit(3, piolinToken.address);
	});

	
	it('assigns initial balance', async () => {
		expect(await vault1.vaultTokenBalance(owner.address, dynamiteToken.address)).to.equal(5);
	});

	it('fails deposit operation as token amount needs to be bigger than 0', async() => {
		await piolinToken.connect(account).approve(account.address, 10);
		expect(vault1.connect(account).deposit(0, piolinToken.address)).to.be.revertedWith("You need to deposit tokens");
	});

	it('allows account to deposit tokens', async() => {
		await piolinToken.transfer(account.address, 5);
		await piolinToken.connect(account).approve(vault1.address, 5);
		await vault1.connect(account).deposit(3, piolinToken.address);
		expect(await vault1.vaultTokenBalance(account.address, piolinToken.address)).to.equal(3);
	});

	it('fails as amount to withdraw is 0', async () => {
		expect(vault1.connect(account).withdraw(0, dynamiteToken.address)).to.be.revertedWith("Withdrawal amount needs to be bigger than 0");
	});

	it('fails if withdrawal amount is larger than balance in vault', async () => {
		expect(vault1.connect(account).withdraw(10, piolinToken.address)).to.be.revertedWith("Account balance needs to be larger than withdrawal amount");
	});

	it('deposits external token and withdraws check balances have been updated', async () => {
		await dynamiteToken.transfer(account.address, (1*10**18).toString());
		await dynamiteToken.connect(account).approve(vault1.address, (1*10**18).toString());
		await vault1.connect(account).deposit((1*10**18).toString(), dynamiteToken.address);
		await vault1.connect(account).withdraw((5*10**17).toString(), dynamiteToken.address)
		expect(await vault1.vaultTokenBalance(account.address, dynamiteToken.address)).to.equal((5*10**17).toString());
		expect(await dynamiteToken.balanceOf(account.address)).to.equal((5*10**17).toString());
	});
});
