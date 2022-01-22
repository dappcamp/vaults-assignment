const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Vault 2", () => {
	beforeEach(async () => {
		[owner, preethi] = await ethers.getSigners();

		Vault2 = await ethers.getContractFactory("Vault2");
		vault2 = await Vault2.deploy();
		await vault2.deployed();
	});
	
	// Minting
	describe("Minting", () => {
		it("Should allow users to exchange ethereum for VAULT", async () => {
			await expect(vault2.connect(preethi).mint(100, { value: 100 }))
				.to.emit(vault2, "Mint").withArgs(preethi.address, 100);

			const finalUserWethBalance = await vault2.balanceOf(preethi.address);
			const finalVaultWethBalance = await vault2.balanceOf(vault2.address);
			
			expect(finalUserWethBalance).to.eq(100);
		})
		
		it("Should not allow users to pass unequal amounts of amount and value", async () => {
			await expect(vault2.connect(preethi).mint(100, { value: 1000 }))
				.to.be.revertedWith("Invalid amount");
		})
	})
	
	// Burning
	describe("Burning", () => {
		it("Should allow users to burn their VAULT for an equal amount of ETH", async () => {
			await vault2.connect(preethi).mint(100, { value: 100 });
			
			const interimUserWethBalance = await vault2.balanceOf(preethi.address);

			await vault2.connect(preethi).approve(vault2.address, 10);
			await expect(vault2.connect(preethi).burn(10))
				.to.emit(vault2, "Burn").withArgs(preethi.address, 10);

			const finalUserWethBalance = await vault2.balanceOf(preethi.address);

			expect(interimUserWethBalance - finalUserWethBalance).to.eq(10);
		})
		
		it("Should not allow users to burn more VAULT than they have", async () => {
			await vault2.connect(preethi).mint(100, { value: 100 });

			await vault2.connect(preethi).approve(vault2.address, 10000);
			await expect(vault2.connect(preethi).burn(10000))
				.to.be.revertedWith("Invalid amount")

		})
	})
});
