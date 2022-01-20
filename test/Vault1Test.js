const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Vault 1", () => {
	deployContract = async (contractName, ...args) => {
		factory = await ethers.getContractFactory(contractName);
		contract = await factory.deploy(...args);
		await contract.deployed();
		return contract;
	}

	beforeEach(async () => {
		const accounts = await ethers.getSigners();

		owner = accounts[0];
		account1 = accounts[1];

		fakeToken = await deployContract("FakeToken");
		vault1 = await deployContract("Vault1", fakeToken.address);

		await fakeToken.connect(account1).faucet(1000);
	});

	describe("deposit", function () {
		it("should allow deposit from an approved wallet", async function () {
			await fakeToken.connect(account1).approve(vault1.address, 2000);

			await expect(
				vault1.connect(account1).deposit(1000)
			).to.emit(vault1, "Deposited").withArgs(account1.address, 1000);
		});

		it("should revert when the account doesn't have sufficient balance", async function () {
			await expect(
				vault1.connect(account1).deposit(2000)
			).to.be.revertedWith("ERC20: transfer amount exceeds balance");
		});

		it("should revert when the account is not approved", async function () {
			await expect(
				vault1.connect(account1).deposit(1000)
			).to.be.revertedWith("ERC20: transfer amount exceeds allowance");
		});
	});

	describe("withdraw", function () {
		it("should allow withdrawal to someone with sufficient balance", async function () {
			await fakeToken.connect(account1).approve(vault1.address, 2000);
			await vault1.connect(account1).deposit(1000);

			await expect(
				vault1.connect(account1).withdraw(1000)
			).to.emit(vault1, "Withdrawn").withArgs(account1.address, 1000);
		});

		it("should revert when the account doesn't have sufficient balance", async function () {
			await fakeToken.connect(account1).approve(vault1.address, 2000);
			await vault1.connect(account1).deposit(1000);

			await expect(
				vault1.connect(account1).withdraw(2000)
			).to.be.revertedWith("ERC20: burn amount exceeds balance");
		});
	})
});
