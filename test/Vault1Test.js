const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Vault 1", () => {
	beforeEach(async () => {
		[owner] = await ethers.getSigners();

		Token1 = await ethers.getContractFactory("Token1");
		token1 = await Token1.deploy();
		await token1.deployed()

		Token2 = await ethers.getContractFactory("Token2");
		token2 = await Token2.deploy();
		await token2.deployed()

		Vault1 = await ethers.getContractFactory("Vault1");
		vault1 = await Vault1.deploy();
		await vault1.deployed();

		await token1.approve(vault1.address, 500);
		await token2.approve(vault1.address, 20000);
	});

	describe("token1 setup", async function () {
		it("owner should own 1000 Token1 Coins initially", async function () {
			name = await token1.name();
			symbol = await token1.symbol();
			totalSupply = await token1.totalSupply();

			ownerBalance = await token1.balanceOf(owner.address);

			expect(name).to.equal('Token1');
			expect(symbol).to.equal('TO1');
			expect(totalSupply).to.equal(1000);
			expect(ownerBalance).to.equal(1000);
		})
	});

	describe("deposit", function () {

		it("deposit Token1", async function () {
			await (
				vault1
			    .connect(owner)
					.deposit(token1.address, 250)
			)
			expect( await vault1.balance(token1.address) ).to.be.equal(250);
			expect( await token1.balanceOf(owner.address) ).to.equal(750);
		});

		it("deposit a mix of Token1 and Token2", async function () {
			await vault1.deposit(token2.address, 5000);
	  	await vault1.deposit(token1.address, 250);

			expect( await vault1.balance(token2.address) ).to.be.equal(5000);
			expect( await token2.balanceOf(owner.address) ).to.equal(5000);

			expect( await vault1.balance(token1.address) ).to.be.equal(250);
			expect( await token1.balanceOf(owner.address) ).to.equal(750);

		});

		it("deposit amount larger than approved", async function () {
			await vault1.deposit(token1.address, 500);

			await expect(
				vault1.deposit(token1.address, 250)
			).to.be.revertedWith("ERC20: transfer amount exceeds allowance")
		});

		it("deposit amount larger than available", async function () {
			await expect (
				vault1.deposit(token1.address, 15000)
			).to.be.revertedWith("ERC20: transfer amount exceeds balance")
		});

	});

	describe("withdraw", function () {

		it("withdraw Token1", async function () {
			await (
				vault1
			    .connect(owner)
					.deposit(token1.address, 500)
			)

			await expect (
				vault1.withdraw(token1.address, 1000)
			).to.be.revertedWith("Balance too low")

			await vault1.withdraw(token1.address, 200);

			expect(await vault1.balance(token1.address)).to.equal(300);
			expect(await token1.balanceOf(owner.address)).to.equal(700);
		});

		it("withdraw Token2 which is not deposited", async function () {

			await expect (
				vault1.withdraw(token2.address, 1000)
			).to.be.revertedWith("Balance too low")

		});

	});

});
