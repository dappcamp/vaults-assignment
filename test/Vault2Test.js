const { expect } = require("chai");
const { ethers } = require("hardhat");
const { utils } = require("ethers");
const { parseEther } = require("ethers/lib/utils");

describe("Vault 2", () => {
	let owner;
	let vaultContract;	

	beforeEach(async () => {
		Vault2 = await ethers.getContractFactory("Vault2");
		[owner] = await ethers.getSigners();

		vaultContract = await Vault2.deploy();

		await vaultContract.deployed();
	});

	describe("mint", function () {
		it("mint is successfull", async function () {
			await vaultContract.mint(10);
			expect (await vaultContract.balanceInVault()).to.equals(10);
		});

		it("burn should be successfull", async function () {
			await vaultContract.mint(10);
			expect (await vaultContract.balanceInVault()).to.equals(10);

			await vaultContract.burn(10);
			expect (await vaultContract.balanceInVault()).to.equals(0);
		});
	});		
});
