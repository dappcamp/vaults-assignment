const { expect } = require("chai");
const { ethers } = require("hardhat");
const { describe, test } = require("mocha");

describe("Vault 1", () => {
	let owner;
	let vaultTokenContract;
	let vaultContract;	


	beforeEach(async () => {
		const VaultToken = await ethers.getContractFactory("VaultToken");		
		const Vault1 = await ethers.getContractFactory("Vault1");
		[owner, user1] = await ethers.getSigners();		

		vaultTokenContract = await VaultToken.deploy(1000, "Vault Token", "VLT");
		vaultContract = await Vault1.deploy(vaultTokenContract.address);
		vaultUser1TokenContract = await VaultToken.connect(user1).deploy(1000, "Vault Token", "VLT");
	});

	describe("deposit", function () {
		it("token is deployed successfully", async function () {
			expect(await vaultTokenContract.totalSupply()).to.equal(1000);
			expect(await vaultTokenContract.balanceOf(owner.address)).to.equal(1000);			
		});

		it("should revert when amount is less than zero", async function () {
			await expect(
				vaultContract.connect(user1).deposit(0)
			).to.be.revertedWith("Invalid deposit amount");
		});

		it("should be successfull to deposit", async function () {
			await vaultTokenContract.approve(vaultContract.address, 400);
			await vaultContract.deposit(400);
			expect(await vaultTokenContract.balanceOf(owner.address)).to.equal(600);
			expect(await vaultContract.balanceOf(owner.address)).to.equal(400);
		});

		it("should be successfull to withdraw", async function () {
			await vaultTokenContract.approve(vaultContract.address, 400);
			await vaultContract.deposit(400);
			expect(await vaultTokenContract.balanceOf(owner.address)).to.equal(600);
			expect(await vaultContract.balanceOf(owner.address)).to.equal(400);

			await vaultContract.withdraw(400);
			expect(await vaultTokenContract.balanceOf(owner.address)).to.equal(1000);
			expect(await vaultContract.balanceOf(owner.address)).to.equal(0);			
		});		
	});	
});
