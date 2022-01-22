const { expect } = require("chai");
const { ethers } = require("hardhat");
const { describe, test } = require("mocha");

describe("Vault 1", () => {
	let owner;

	let bananas;
	let vault1;

	beforeEach(async () => {
		const Bananas = await ethers.getContractFactory("Bananas");
		const Vault1 = await ethers.getContractFactory("Vault1");
		[owner] = await ethers.getSigners();

		bananas = await Bananas.deploy(1000);
		vault1 = await Vault1.deploy(bananas.address);
	});

	test("bananas deployment worked", async () => {
		expect(await bananas.totalSupply()).to.equal(1000);
		expect(await bananas.balanceOf(owner.address)).to.equal(1000);
	});

	test("deposit", async () => {
		await bananas.approve(vault1.address, 1000);
		await vault1.deposit(1000);
		expect(await bananas.balanceOf(owner.address)).to.equal(0);
	});

	test("withdraw", async () => {
		await bananas.approve(vault1.address, 1000);
		await vault1.deposit(1000);
		expect(await bananas.balanceOf(owner.address)).to.equal(0);

		await vault1.withdraw(1000);
		expect(await bananas.balanceOf(owner.address)).to.equal(1000);
	});
});
