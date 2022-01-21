const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Vault 2", () => {
	beforeEach(async () => {
		Vault2 = await ethers.getContractFactory("Vault2");
		[owner, account] = await ethers.getSigners();

		vault2 = await Vault2.deploy();

		await vault2.deployed();
	});

	it('initial balance goes to owner', async () => {
		expect(await vault2.totalSupply()).to.equal(await vault2.balanceOf(owner.address));
	});

	it('allows account to wrap ether in exchange for VLT') {
		
	}
});
