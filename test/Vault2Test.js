const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Vault 2", () => {
	beforeEach(async () => {
		Vault2 = await ethers.getContractFactory("Vault2");
		const accounts = await ethers.getSigners();

		owner = accounts[0];
		account1 = accounts[1];

		vault2 = await Vault2.deploy();

		await vault2.deployed();
	});

	describe("mint", function () {
		it("minting 100 should work", async function () {
			await vault2.connect(account1).mint(100, {
				value: 100
			});
			const account1Balance = await vault2.balanceOf(account1.address);
			expect(account1Balance).to.equal(100);
		});
	});
	
	describe("burn", function () {
		it("burning 100 should work", async function () {
			await vault2.connect(account1).mint(100, {
				value: 100
			});
			await vault2.connect(account1).burn(100);
			const account1Balance = await vault2.balanceOf(account1.address);
			expect(account1Balance).to.equal(0);
		});
		it("burning 200 should fail", async function () {
			await expect(vault2.connect(account1).burn(200)).to.be.revertedWith("Not enough to burn");
		});
	});
});
