const { messagePrefix } = require("@ethersproject/hash");
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Vault 1", () => {
	let songToken, songTokenVault;
	let owner, ownerBalance;
	let user, userBalance;
	beforeEach(async () => {
		[owner, user] = await ethers.getSigners();

		const SongToken = await ethers.getContractFactory("SongToken");
		songToken = await SongToken.deploy();
		await songToken.deployed();
		ownerBalance = await songToken.balanceOf(owner.address);
		expect(ownerBalance).to.equal(10000);

		await songToken.connect(owner).transfer(user.address, 2048);
		ownerBalance = await songToken.balanceOf(owner.address);
		userBalance = await songToken.balanceOf(user.address);
		expect(ownerBalance).to.equal(7952);
		expect(userBalance).to.equal(2048);

		const Vault1 = await ethers.getContractFactory("Vault1");
		songTokenVault = await Vault1.deploy(songToken.address);
		await songTokenVault.deployed();
	});

	describe("Deposit", () => {
		it("Should reject a deposit of a zero amount", async () => {
			await expect(songTokenVault.connect(user).deposit(0)).to.be.revertedWith("Amount should be greater than zero");
		});

		// this test fails but I'm not sure what I'm doing wrong
		it("Should accept a deposit of any amount greater than zero", async () => {
			await expect(await songToken.balanceOf(user.address)).to.equal(2048);

			await songTokenVault.connect(user).deposit(1);
			await expect(songTokenVault.deposits[user.address]).to.equal(1);
			await expect(songToken.balanceOf(user.address)).to.equal(2047);
		});
	});

	describe("Withdraw", () => {
	});
});
