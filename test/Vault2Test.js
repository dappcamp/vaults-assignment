const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Vault 2", () => {
	beforeEach(async () => {

		[owner, addr1, addr2] = await ethers.getSigners();
		Vault2 = await ethers.getContractFactory("Vault2");
		vault2 = await Vault2.deploy();
		await vault2.deployed();

	});

	describe("mint", function() {

		it("Mint VAULT spending ETH", async function() {

			// Contract initial contract ETH balance 0
			expect(
				await vault2.balance()
			).to.equal(0);
			
			// Owner: initial VAULT 0
			expect(
				await vault2.balanceOf(owner.address)
			).to.equal(0);
			
			// mint 100 VAULT
			await vault2.mint({
				value: ethers.utils.parseEther("0.000001")
			});

			// check contract ETH balance
			expect(
				await vault2.balance()
			).to.equal(1000000000000);
			
			// check VAULT balance
			expect(
				await vault2.balanceOf(owner.address)
			).to.equal(1000000000000);

		});

	});

	describe("burn", function() {

		it("Burn VAULT getting back ETH", async function() {

			// Contract initial contract ETH balance 0
			expect(
				await vault2.balance()
			).to.equal(0);
			
			// Owner: initial VAULT 0
			expect(
				await vault2.balanceOf(owner.address)
			).to.equal(0);

			// mint VAULT using 1000000000000
			await vault2.mint({
				value: ethers.utils.parseEther("0.000001")
			});
			
			// burn 1000 VAULT
			await vault2.burn(1000);

			// check contract ETH balance
			expect(
				await vault2.balance()
			).to.equal(999999999000);

			// check contract VAULT balance
			expect(
				await vault2.balanceOf(owner.address)
			).to.equal(999999999000);

		});

	});

});
