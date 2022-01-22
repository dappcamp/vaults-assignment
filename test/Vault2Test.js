const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Vault 2", () => {
	beforeEach(async () => {

		Vault = await ethers.getContractFactory("Vault");

		[testVaultowner, testVaultSender, recipient1, recipient2, ...addrs] = await ethers.getSigners();

		vault = await Vault.deploy();

		await vault.deployed();

		Vault2 = await ethers.getContractFactory("Vault2");
		[owner] = await ethers.getSigners();

		vault2 = await Vault2.deploy(vault.address);

		await vault2.deployed();


	});

	describe("Mint", function () {

		it("should throw error if message doesnt have sufficient ether", async function () {

			await expect(
				vault2.connect(sender).mint(30)).to.be.revertedWith("Not enough ether to mint");

		});

		it("should mint Vault token if sufficient ether is passed", async function () {
			const options = { value: ethers.utils.parseEther("1.0") }

			minted = await vault2.connect(sender).mint(1, options);

			userBalance = await vault.balanceOf(sender.address);

			expect(userBalance.toString()).to.be.equal("1")


		});



	});

	describe("Burn", function () {

		it("should throw error if sufficient token not present in vault", async function () {

			await expect(
				vault2.connect(sender).burn(30)).to.be.revertedWith("Not enough vault to burn");

		});

		it("should burn token if present in vault", async function () {
			const options = { value: ethers.utils.parseEther("5.0") }

			minted = await vault2.connect(sender).mint(5, options);

			userBalance = await vault.balanceOf(sender.address);

			burnt = await vault2.connect(sender).burn(3);

			userBalance = await vault.balanceOf(sender.address);

			expect(userBalance.toString()).to.be.equal("2")

		});



	});
});
