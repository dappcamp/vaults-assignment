const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Vault 1", () => {
	let signers;
	let deployer;
	let alice;
	let vaultContract;

	beforeEach(async () => {
		Vault2 = await ethers.getContractFactory("Vault2");
		vaultContract = await Vault2.deploy();
		await vaultContract.deployed();

		signers = await ethers.getSigners();
		deployer = signers[0];
		alice = signers[1];
	});

	it("mint(): should transfer token amount from user to vault", async function () {
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

});
