const { getAddress } = require("@ethersproject/address");
const { expect } = require("chai");
const { ethers } = require("hardhat");
const { smock } = require("@defi-wonderland/smock");
const { any } = require("hardhat/internal/core/params/argumentTypes");

describe("Vault 1", () => {
	beforeEach(async () => {
		[owner, acct1] = await ethers.getSigners();

		const MockERC20Factory = await smock.mock("ERC20");
		mockERC20Contract = await MockERC20Factory.deploy("Mock", "MOCK");

		Vault1 = await ethers.getContractFactory("Vault1");
		vault1 = await Vault1.deploy(mockERC20Contract.address);
		await vault1.deployed();
	});

	describe("deposit", function () {
		it("Balance should not increase when transfer fails", async function () {
			mockERC20Contract.transferFrom.returns(false);

			await expect(
				vault1.deposit(100)
			).to.be.revertedWith("Transfer from sender failed");
			let acct1Balance = await vault1.getBalance(acct1.address);
			acct1Balance = acct1Balance.toNumber();
			expect(acct1Balance).to.equal(0);
		});

		it("Balance should increase when transfer succeeds", async function () {
			mockERC20Contract.transferFrom.returns(true);

			await vault1.connect(acct1).deposit(100);
			let acct1Balance = await vault1.getBalance(acct1.address);
			acct1Balance = acct1Balance.toNumber();
			expect(acct1Balance).to.equal(100);
		});
	});

	describe("withdraw", function () {
		it("Withdraw with zero balance should fail", async function () {
			await expect(
				vault1.connect(acct1).withdraw(100)
			).to.be.revertedWith("");
		});

		it("Withdraw amount > balance should fail", async function () {
			mockERC20Contract.transferFrom.returns(true);
			await vault1.connect(acct1).deposit(1);

			await expect(
				vault1.connect(acct1).withdraw(100)
			).to.be.revertedWith("");
			let acct1Balance = await vault1.getBalance(acct1.address);
			acct1Balance = acct1Balance.toNumber();
			expect(acct1Balance).to.equal(1);
		});

		it("Withdraw amount <= balance should pass", async function () {
			mockERC20Contract.transferFrom.returns(true);
			mockERC20Contract.transfer.returns(true);
			await vault1.connect(acct1).deposit(100);

			await vault1.connect(acct1).withdraw(10);
			let acct1Balance = await vault1.getBalance(acct1.address);
			acct1Balance = acct1Balance.toNumber();
			expect(acct1Balance).to.equal(90);

			await vault1.connect(acct1).withdraw(90);
			acct1Balance = await vault1.getBalance(acct1.address);
			acct1Balance = acct1Balance.toNumber();
			expect(acct1Balance).to.equal(0);
		});

		it("Over withdraw amount should fail", async function () {
			let acct1Balance = await vault1.getBalance(acct1.address);
			acct1Balance = acct1Balance.toNumber();
			expect(acct1Balance).to.equal(0);
			await expect(
				vault1.connect(acct1).withdraw(100)
			).to.be.revertedWith("");
		});

		it("Withdraw should revert if transfer fails", async function () {
			mockERC20Contract.transferFrom.returns(true);
			mockERC20Contract.transfer.returns(false);
			await vault1.connect(acct1).deposit(100);

			await expect(
				vault1.connect(acct1).withdraw(100)
			).to.be.revertedWith("Transfer to sender failed");
			let acct1Balance = await vault1.getBalance(acct1.address);
			acct1Balance = acct1Balance.toNumber();
			expect(acct1Balance).to.equal(100);

			// once transfer is allowed to pass withdraw should succeed
			mockERC20Contract.transfer.returns(true);

			await vault1.connect(acct1).withdraw(100);
			acct1Balance = await vault1.getBalance(acct1.address);
			acct1Balance = acct1Balance.toNumber();
			expect(acct1Balance).to.equal(0);
		});
	});
});
