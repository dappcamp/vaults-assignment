const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Vault 1", () => {
	beforeEach(async () => {
		Vault1 = await ethers.getContractFactory("Vault1");
		[owner] = await ethers.getSigners();

		vault1 = await Vault1.deploy();

		await vault1.deployed();
	});

	it("Should take a deposit of any amount", async function() {
		expect().to.equal();
	});

	it("Should allow a withdraw up to the deposited amount", async function() {
		expect().to.equal();
	});

	it("Should throw if withdraw amount exceeds the deposit amount", async function() {
		expect().to.equal();
	});
});
