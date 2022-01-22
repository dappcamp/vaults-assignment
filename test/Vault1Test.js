const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Vault 1", () => {
	beforeEach(async () => {
		
		MimuToken = await ethers.getContractFactory("MimuToken");
		Vault1 = await ethers.getContractFactory("Vault1");
		
		[owner, addr1, addr2] = await ethers.getSigners();

		mimuToken = await MimuToken.deploy();
		await mimuToken.deployed();

		vault1 = await Vault1.deploy();
		await vault1.deployed();

	});

	describe("deposit", function() {

		it("Owner should have initial 1000 MIMU token", async function() {

			// initial mint for the owner 1000
			expect(await mimuToken.balanceOf(owner.address)).to.equal(1000);

		});

		it("Revert: Insufficient fund (Deposit 5000 MIMU token to the vault)", async function() {

			// Address 1 has no token
			await expect(
				vault1.connect(addr1).deposit(mimuToken.address, 1)
			).to.be.revertedWith("ERC20: transfer amount exceeds balance");
		
			// Owner balance shouldn't have changed.
			expect(
				await mimuToken.balanceOf(owner.address)
			).to.equal(1000);

			// No token in the vault without deposit
			expect(
				await mimuToken.balanceOf(mimuToken.address)
			).to.equal(0);

		});

		it("Deposit 50 MIMU to Vault1", async function() {

			expect(
				await mimuToken.balanceOf(owner.address)
			).to.equal(1000);

			// approve
			await mimuToken.connect(owner).approve(vault1.address, 500000);
			
			// first deposit 1 MIMU
			await vault1.connect(owner).deposit(mimuToken.address, 1)
			expect(
				await mimuToken.balanceOf(owner.address)
			).to.equal(999);

			// second deposit 49 MIMU
			await vault1.connect(owner).deposit(mimuToken.address, 49)
			expect(
				await mimuToken.balanceOf(owner.address)
			).to.equal(950);

		});

	});

	describe("withdraw", function() {

		it("Withdraw 50 MIMU to Owner Address", async function() {

			expect(
				await mimuToken.balanceOf(owner.address)
			).to.equal(1000);

			// approve
			await mimuToken.connect(owner).approve(vault1.address, 500000);

			// first deposit 100 MIMU
			await vault1.connect(owner).deposit(mimuToken.address, 100)
			expect(
				await mimuToken.balanceOf(owner.address)
			).to.equal(900);

			// second withdraw 1 MIMU
			await vault1.connect(owner).withdraw(mimuToken.address, 3)
			expect(
				await mimuToken.balanceOf(owner.address)
			).to.equal(903);

		});

	});
	
});
