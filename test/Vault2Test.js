const { expect, assert } = require("chai");
const { ethers } = require("hardhat");

describe("Vault 2", () => {
	beforeEach(async () => {
		Vault2 = await ethers.getContractFactory("Vault2");
		const accounts = await ethers.getSigners();
		owner = accounts[0]
		other = accounts[1]

		vault2 = await Vault2.deploy();
		await vault2.deployed();
	});
	it("Input validation", async function(){
		await expect(vault2.connect(owner).burn(0))
		.to.be.revertedWith("Invalid amount 0 tokens");
		await expect(vault2.connect(owner).mint(0))
		.to.be.revertedWith("Invalid amount 0 tokens");
		await expect(vault2.connect(owner).burn(10))
		.to.be.revertedWith( "Cant burn more than you got");
		await expect(vault2.connect(owner).mint(2, {value:ethers.utils.parseEther("2")}))
		.to.be.revertedWith( "Sent ether and _amount are not equal");
	});
	
	it("Mint and Check", async function(){
		starting_bal = await ethers.provider.getBalance(owner.address)
		amount = ethers.utils.parseEther("2")
		await expect(vault2.connect(owner).mint(amount, {value:amount}))
		.to.emit(vault2, "Mint")
		.withArgs(owner.address, amount);
		token_bal = await vault2.connect(owner).balanceOf(owner.address)
		assert(token_bal.eq(amount))
	});

	it("Send tokens", async function(){
		amount = ethers.utils.parseEther("2")
		await vault2.connect(owner).mint(amount, {value:amount})
		transfer_amount = ethers.utils.parseEther("1")
		await vault2.connect(owner).transfer(other.address, transfer_amount)
		token_bal = await vault2.connect(owner).balanceOf(owner.address)
		other_token_bal = await vault2.connect(other).balanceOf(other.address)
		assert(amount - transfer_amount == token_bal)
		assert(token_bal.eq(transfer_amount))
		await expect(vault2.connect(owner).burn(transfer_amount))
		.to.emit(vault2, "Burn")
		.withArgs(owner.address, transfer_amount);
	});
});
