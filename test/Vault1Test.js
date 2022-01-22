const { expect } = require("chai");
const { ethers, artifacts } = require("hardhat");

describe("Vault 1", () => {
	let signers;
	let deployer;
	let alice;
	let ERC20Coin;
	let moonCoinContract;

	beforeEach(async () => {
		signers = await ethers.getSigners();
		deployer = signers[0];
		tokenDeployer = signers[1];
		alice = signers[2];

		Vault1 = await ethers.getContractFactory("Vault1");
		vault1Contract = await Vault1.deploy();
		await vault1Contract.deployed();

		ERC20Coin = await ethers.getContractFactory("ERC20Coin");
		moonCoinContract = await ERC20Coin.deploy("Moon Coin", "MOON", 10000);
	});

	let depositAmount = 10;

	it("deposit(): should transfer token amount from user to vault", async function () {
		//transfer some moonCoin from deployer to alice
		await moonCoinContract.transfer(alice.address, 150);
		const aliceMoonCoinBalance = await moonCoinContract.balanceOf(alice.address);

		expect(aliceMoonCoinBalance).equal(150);

		// alice deposits moonCoin to Vault
		await moonCoinContract.connect(alice).approve(vault1Contract.address, depositAmount); // implicit approval
		await vault1Contract.connect(alice).deposit(depositAmount, moonCoinContract.address);

		const remainingAliceMoonCoinBalance = await moonCoinContract.balanceOf(alice.address);
		expect(aliceMoonCoinBalance - remainingAliceMoonCoinBalance).equal(depositAmount);
	});

	it("deposit(): should reflect the balance internally in the vault", async function () {
		//transfer some moonCoin from deployer to alice
		await moonCoinContract.transfer(alice.address, 150);
		const aliceMoonCoinBalance = await moonCoinContract.balanceOf(alice.address);

		expect(aliceMoonCoinBalance).equal(150);

		// alice deposits moonCoin to Vault
		await moonCoinContract.connect(alice).approve(vault1Contract.address, depositAmount); // implicit approval
		await vault1Contract.connect(alice).deposit(depositAmount, moonCoinContract.address);

		const remainingAliceMoonCoinBalance = await moonCoinContract.balanceOf(alice.address);
		expect(aliceMoonCoinBalance - remainingAliceMoonCoinBalance).equal(depositAmount);

		// check the vault moonCoin balance for alice
		const vault1AliceMoonCoinBalance = await vault1Contract.connect(alice).getBalance(alice.address, moonCoinContract.address);
		expect(vault1AliceMoonCoinBalance).equal(depositAmount);
	});

	it("deposit(): should allow user to deposit another erc20 token", async function () {
		//transfer some marsCoin from deployer to alice
		const ERC20Coin2 = await ethers.getContractFactory("ERC20Coin", tokenDeployer.address);
		marsCoinContract = await ERC20Coin2.deploy("Mars Coin", "MARS", 50000);
		await marsCoinContract.transfer(alice.address, 750);
		const aliceMarsCoinBalance = await marsCoinContract.balanceOf(alice.address);

		expect(aliceMarsCoinBalance).equal(750);

		// alice deposits moonCoin to Vault
		await marsCoinContract.connect(alice).approve(vault1Contract.address, depositAmount); // implicit approval
		await vault1Contract.connect(alice).deposit(depositAmount, marsCoinContract.address);

		const remainingAliceMarsCoinBalance = await marsCoinContract.balanceOf(alice.address);
		expect(aliceMarsCoinBalance - remainingAliceMarsCoinBalance).equal(depositAmount);

		// check the vault moonCoin balance for alice
		const vault1AliceMarsCoinBalance = await vault1Contract.connect(alice).getBalance(alice.address, marsCoinContract.address);
		expect(vault1AliceMarsCoinBalance).equal(depositAmount);
	});

	it("deposit(): should revert if amount deposited is more than available balance", async function () {
		//transfer some moonCoin from deployer to alice
		await moonCoinContract.transfer(alice.address, 150);
		const aliceMoonCoinBalance = await moonCoinContract.balanceOf(alice.address);

		expect(aliceMoonCoinBalance).equal(150);

		// alice deposits moonCoin to Vault
		await moonCoinContract.connect(alice).approve(vault1Contract.address, depositAmount); // implicit approval
		
		await expect(
			vault1Contract.connect(alice).deposit(aliceMoonCoinBalance + 200, moonCoinContract.address)
		).to.be.revertedWith("Insufficient token balance to deposit");
	});


	it("withdraw(): should transfer token amount from vault to user", async function () {
		//transfer some moonCoin from deployer to alice
		await moonCoinContract.transfer(alice.address, 150);
		const aliceMoonCoinBalance = await moonCoinContract.balanceOf(alice.address);

		expect(aliceMoonCoinBalance).equal(150);

		// alice deposits moonCoin to Vault
		let depositAmount2 = 100;
		await moonCoinContract.connect(alice).approve(vault1Contract.address, depositAmount2); // implicit approval
		await vault1Contract.connect(alice).deposit(depositAmount2, moonCoinContract.address);

		const remainingAliceMoonCoinBalance = await moonCoinContract.balanceOf(alice.address);
		expect(aliceMoonCoinBalance - remainingAliceMoonCoinBalance).equal(depositAmount2);


		// alice withdraws some moonCoin from the Vault
		let withdrawAmount = 70; // 70
		await vault1Contract.connect(alice).withdraw(withdrawAmount, moonCoinContract.address);

		const aliceLatestMoonCoinBalance = await moonCoinContract.balanceOf(alice.address);
		expect(aliceLatestMoonCoinBalance).equal(aliceMoonCoinBalance - depositAmount2 + withdrawAmount);

		const remainingAliceMoonCoinBalanceInVault = await vault1Contract.connect(alice).getBalance(alice.address, moonCoinContract.address);
		expect(remainingAliceMoonCoinBalanceInVault).equal(depositAmount2 - withdrawAmount);
	});

	it("withdraw(): should revert if trying to withdraw more than present", async function () {
		//transfer some moonCoin from deployer to alice
		await moonCoinContract.transfer(alice.address, 150);
		const aliceMoonCoinBalance = await moonCoinContract.balanceOf(alice.address);

		expect(aliceMoonCoinBalance).equal(150);

		// alice deposits moonCoin to Vault
		let depositAmount2 = 100;
		await moonCoinContract.connect(alice).approve(vault1Contract.address, depositAmount2); // implicit approval
		await vault1Contract.connect(alice).deposit(depositAmount2, moonCoinContract.address);

		const remainingAliceMoonCoinBalance = await moonCoinContract.balanceOf(alice.address);
		expect(aliceMoonCoinBalance - remainingAliceMoonCoinBalance).equal(depositAmount2);


		// alice withdraws some moonCoin from the Vault
		let withdrawAmount = 130;

		await expect(
			vault1Contract.connect(alice).withdraw(withdrawAmount, moonCoinContract.address)
		).to.be.revertedWith("You have insufficient token balance to withdraw");
	});

});
