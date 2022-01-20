const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Vault 2", () => {
	let vault2;
	let owner;
	let account;

	beforeEach("deploy contract", async () => {
		vault2ContractFactory = await ethers.getContractFactory("Vault2");
		[owner, account] = await ethers.getSigners();
		vault2 = await vault2ContractFactory.deploy();
		await vault2.deployed();
	});

	describe("mint", () => {
		it("should emit Mint event on successful calls to mint", async () => {
			const DEPOSITED_AMOUNT = 1;
			await expect(vault2.connect(account).mint(DEPOSITED_AMOUNT,
			{ value: 1 }))
			.to.emit(vault2, "Mint")
			.withArgs(DEPOSITED_AMOUNT);
		});

		it("should fail if msg.value doesn't equal passed in amount", async () => {
			const DEPOSITED_AMOUNT = 1;
			await expect(vault2.connect(account).mint(DEPOSITED_AMOUNT,
			{ value: 2 }))
			.to.be.revertedWith("amount does not equal to msg.value");
		});
	});

	describe("burn", () => {
		it("should emit Burn event on successful calls to burn", async () => {
			const DEPOSITED_AMOUNT = 1;
			await vault2.connect(account).mint(DEPOSITED_AMOUNT, { value: 1 })
			await expect(vault2.connect(account).burn(DEPOSITED_AMOUNT))
				.to.emit(vault2, "Burn")
				.withArgs(DEPOSITED_AMOUNT);
		});

		it("should only allow withdrawals up to the deposited amount", async () => {
			const DEPOSITED_AMOUNT = 1;
			await vault2.connect(account).mint(DEPOSITED_AMOUNT, { value: 1 })
			await vault2.connect(account).burn(DEPOSITED_AMOUNT);
			await expect(vault2.connect(account).burn(DEPOSITED_AMOUNT))
				.to.be.revertedWith("ERC20: burn amount exceeds balance");
		});
	});
});
