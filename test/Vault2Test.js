const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Vault 2", () => {
	beforeEach(async () => {
		Vault2 = await ethers.getContractFactory("Vault2");
		[owner] = await ethers.getSigners();

		vault2 = await Vault2.deploy();

		await vault2.deployed();
	});

	it('initial balance goes to owner', async () => {
		expect(await vault2.totalSupply()).to.equal(await vault2.balanceOf(owner.address));
	});

	it('allows account to wrap ether in exchange for minted VLT', async () => {
		await vault2.connect(owner).mint({value: 200});
		expect(await vault2.balanceOf(owner.address)).to.equal(200);
	});

	it('allows account to burn VLT tokens', async () => {
		await vault2.connect(owner).mint({value: 500});
		await vault2.connect(owner).burn(200);
		expect(await vault2.balanceOf(owner.address)).to.equal(300);
	});

});
