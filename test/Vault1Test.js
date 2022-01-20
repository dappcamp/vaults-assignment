const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Vault 1", () => {
	beforeEach(async () => {
		Vault1 = await ethers.getContractFactory("Vault1");
		[owner, recipient, other] = await ethers.getSigners();

		vault1 = await Vault1.deploy();

		await vault1.deployed();
	});

	describe("deposit", function () {
		it("Should take in deposit amount", async function () {
			await vault1.connect(owner).deposit(500);
			const ownerBalance = await vault1.balanceOf(owner.address);
			expect(await vault1.totalSupply()).to.equal(ownerBalance);
			
		});

		
	});
});
