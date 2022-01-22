const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Vault 1", () => {
	beforeEach(async () => {
		Vault1 = await ethers.getContractFactory("Vault1");

		[owner, sender, vaultRecipient1, recipient2, ...addrs] = await ethers.getSigners();

		vault1 = await Vault1.deploy();

		await vault1.deployed();

		TestERC = await ethers.getContractFactory("TestERC");

		[testERCowner, testERCSender, recipient1, recipient2, ...addrs] = await ethers.getSigners();

		testERC = await TestERC.deploy();

		await testERC.deployed();


	});

	describe("Deposit", function () {

		it("should throw error if sender doesn't have sufficient balance", async function () {

			await expect(
				vault1.connect(sender).deposit(30, testERC.address)).to.be.revertedWith("Balance not sufficient for transfer to vault");

		});

		it("should transfer amount to vault if user has sufficient balance", async function () {

			minted = await testERC.connect(testERCowner).mint(vaultRecipient1.address, 30);
			balance = await testERC.balanceOf(vaultRecipient1.address);
			await vault1.connect(vaultRecipient1).deposit(3, testERC.address);

			userBalance = await testERC.balanceOf(vaultRecipient1.address);

			expect(userBalance.toString()).to.be.equal("27")
			ownerBalance = await testERC.balanceOf(owner.address);
			expect(ownerBalance.toString()).to.be.equal("1000000000000000000003")
		});


	});


	describe("Withdraw", function () {

		it("should throw error if sender doesn't have sufficient balance in Vault", async function () {
			minted = await testERC.connect(testERCowner).mint(vaultRecipient1.address, 30);
			balance = await testERC.balanceOf(vaultRecipient1.address);
			await vault1.connect(vaultRecipient1).deposit(3, testERC.address);
			await expect(
				vault1.connect(sender).withdraw(5, testERC.address)).to.be.revertedWith("User doesnt have sufficient balance in the vault");

		});

		it("should transfer amount from vault to user if balance is sufficient", async function () {

			minted = await testERC.connect(testERCowner).mint(vaultRecipient1.address, 30);
			balance = await testERC.balanceOf(vaultRecipient1.address);
			await vault1.connect(vaultRecipient1).deposit(3, testERC.address);
			await vault1.connect(vaultRecipient1).withdraw(2, testERC.address);


			userBalance = await testERC.balanceOf(vaultRecipient1.address);

			expect(userBalance.toString()).to.be.equal("29")
			ownerBalance = await testERC.balanceOf(owner.address);
			expect(ownerBalance.toString()).to.be.equal("1000000000000000000001")
		});


	});


});
