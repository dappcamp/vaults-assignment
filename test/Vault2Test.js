const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Vault 2", () => {
	beforeEach(async () => {
		Vault2 = await ethers.getContractFactory("Vault2");
		[owner] = await ethers.getSigners();
		vault2 = await Vault2.deploy();
		await vault2.deployed();
	});

	describe("mint", function () {
		it("Mint should revert when supplied amount is less than or equal to zero.", async function () {
			await expect( vault2.connect(owner).mint(1, {value : 0 })
			).to.be.revertedWith("Mint amount should be equal to ETH amount.");
		});
	});

	describe("mint", function () {
		it("Mint should create an amount of new tokens.", async function () {
    		await vault2.connect(owner).mint(5, {value : 5});
            let balance =  await vault2.balanceOf(owner.address);
			await expect(balance).to.equal(5);
		});
	});

	describe("burn", function () {
		it("Burn should revert when amount is less than or equal to zero.", async function () {
			await expect(vault2.connect(owner).burn(0)
			).to.be.revertedWith("Burn amount must be greated than zero.");
		});
	});

	describe("burn", function () {
		it("Burn should reduce total balance to zero.", async function () {
			await vault2.connect(owner).mint(5,{value : 5});
			await vault2.connect(owner).burn(5);
            let balance =  await vault2.balanceOf(owner.address);
			await expect(balance).to.equal(0);
		});
	});
});