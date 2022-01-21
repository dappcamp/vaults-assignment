const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Vault 1", () => {
	let tok1, tok2, vault;
	let deployer;
	let user1, user2;

	beforeEach(async () => {
		[deployer, user1, user2] = await ethers.getSigners();

		// `deployer` deploys all the contracts
		const Tok1 = await ethers.getContractFactory("Tok1", deployer);
		tok1 = await Tok1.deploy();
		await tok1.deployed();

		const Tok2 = await ethers.getContractFactory("Tok2", deployer);
		tok2 = await Tok2.deploy();
		await tok2.deployed();

		const Vault = await ethers.getContractFactory("Vault", deployer);
		vault = await Vault.deploy();
		await vault.deployed();

		// Give user1 the two tokens
		await tok1.connect(deployer).approve(user1.address, 1_000);
		await tok1.connect(user1).transferFrom(deployer.address, user1.address, 1_000);

		await tok2.connect(deployer).approve(user1.address, 1_000);
		await tok2.connect(user1).transferFrom(deployer.address, user1.address, 1_000);

		// Give user2 the two tokens
		await tok1.connect(deployer).approve(user2.address, 1_000);
		await tok1.connect(user2).transferFrom(deployer.address, user2.address, 1_000);

		await tok2.connect(deployer).approve(user2.address, 1_000);
		await tok2.connect(user2).transferFrom(deployer.address, user2.address, 1_000);

		// From the prompt: "Assume that the contract is pre-approved to transfer that amount"
		// Give the vault approval to transfer user1's tokens
		await tok1.connect(user1).approve(vault.address, 1_000);
		await tok2.connect(user1).approve(vault.address, 1_000);

		// Give the vault approval to transfer user2's tokens
		await tok1.connect(user2).approve(vault.address, 1_000);
		await tok2.connect(user2).approve(vault.address, 1_000);
	});

	// describe("deposit", () => {
	// 	it("requires a non-zero token address", async () => {
	// 		await expect(
	// 			vault.connect(user1).deposit(ethers.constants.AddressZero, 0)
	// 		).to.be.revertedWith("Token address can't be zero address");
	// 	});

	// 	it("requires an amount > 0", async () => {
	// 		await expect(
	// 			vault.connect(user1).deposit(tok1.address, 0)
	// 		).to.be.revertedWith("Amount must be > 0");
	// 	});

	// 	it("reverts if the user doesn't have that many tokens", async () => {
	// 		await expect(
	// 			vault.connect(user1).deposit(tok1.address, 20)
	// 		).to.be.revertedWith("Not enough tokens");
	// 	});

	// 	it("stores the amount deposited for that token", async () => {
	// 		await vault.connect(user1).deposit(tok1.address, 10);
	// 		await vault.connect(user1).deposit(tok2.address, 5);

	// 		expect(
	// 			await vault.connect(user1).balanceOf(tok1.address)
	// 		).to.equal(10);

	// 		expect(
	// 			await vault.connect(user1).balanceOf(tok2.address)
	// 		).to.equal(5);

	// 		await vault.connect(user2).deposit(tok1.address, 2);
	// 		await vault.connect(user2).deposit(tok2.address, 3);

	// 		expect(
	// 			await vault.connect(user2).balanceOf(tok1.address)
	// 		).to.equal(2);

	// 		expect(
	// 			await vault.connect(user2).balanceOf(tok2.address)
	// 		).to.equal(3);
	// 	});
	// });

	describe("withdraw", () => {
		// it("requires a non-zero token address", async () => {
		// 	await expect(
		// 		vault.connect(user1).withdraw(ethers.constants.AddressZero, 0)
		// 	).to.be.revertedWith("Token address can't be zero address");
		// });

		// it("requires an amount > 0", async () => {
		// 	await expect(
		// 		vault.connect(user1).withdraw(tok1.address, 0)
		// 	).to.be.revertedWith("Amount must be > 0");
		// });

		// it("reverts if the user doesn't have that many tokens", async () => {
		// 	await expect(
		// 		vault.connect(user1).withdraw(tok1.address, 20)
		// 	).to.be.revertedWith("Not enough tokens deposited");
		// });

		it("withdraws the tokens if the user has deposited them", async () => {
			const txn = await vault.connect(user1).deposit(tok1.address, 10);
			await txn.wait();

			await vault.connect(user1).withdraw(tok1.address, 5);

			expect(await vault.balanceOf(tok1.address)).to.equal(5);
			expect(await tok1.balanceOf(user1.address)).to.equal(995);
		});
	});

	// describe("balanceOf", () => {
	// 	it("reverts if the token address is the zero address", async () => {
	// 		await expect(
	// 			vault.connect(user1).balanceOf(ethers.constants.AddressZero)
	// 		).to.be.revertedWith("Token address can't be zero address");
	// 	});

	// 	it("returns 0 if the user hasn't deposited any tokens", async () => {
	// 		expect(
	// 			await vault.connect(user1).balanceOf(tok1.address)
	// 		).to.equal(0);
	// 	});

	// 	it("returns the balance", async () => {
	// 		await vault.connect(user1).deposit(tok1.address, 10);

	// 		expect(
	// 			await vault.connect(user1).balanceOf(tok1.address)
	// 		).to.equal(10);

	// 		expect(
	// 			await vault.connect(user1).balanceOf(tok2.address)
	// 		).to.equal(0);
	// 	});
	// });
});