const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Vault 1", () => {
	beforeEach(async () => {
		[owner] = await ethers.getSigners();

		Carbonium = await ethers.getContractFactory("Carbonium");
		carbonium = await Carbonium.deploy();
		await carbonium.deployed()

		Vault1 = await ethers.getContractFactory("Vault1");
		vault1 = await Vault1.deploy();
		await vault1.deployed();


		await carbonium.approve(vault1.address, 500);

	});

	describe("carbonium setup", async function () {
		it("owner should own 1000 Carbonium Coins initially", async function () {
			name = await carbonium.name();
			symbol = await carbonium.symbol();
			totalSupply = await carbonium.totalSupply();

			ownerBalance = await carbonium.balanceOf(owner.address);

			expect(name).to.equal('Carbonium');
			expect(symbol).to.equal('CO2');
			expect(totalSupply).to.equal(1000);
			expect(ownerBalance).to.equal(1000);
		})
	});

	describe("deposit", function () {

		it("deposit Carbonium", async function () {
			await (
				vault1
			    .connect(owner)
					.deposit(carbonium.address, 500)
			)
			ownerBalance = await carbonium.balanceOf(owner.address);
			expect(ownerBalance).to.equal(500);

			await expect (
				vault1.deposit(carbonium.address, 700)
			).to.be.revertedWith("ERC20: transfer amount exceeds balance")

		});

	});

	describe("withdraw", function () {

		it("withdraw Carbonium", async function () {
			await (
				vault1
			    .connect(owner)
					.deposit(carbonium.address, 500)
			)

			await expect (
				vault1.withdraw(carbonium.address, 1000)
			).to.be.revertedWith("Balance too low")

			await vault1.withdraw(carbonium.address, 200);

			expect(await vault1.balance(carbonium.address)).to.equal(300);
			expect(await carbonium.balanceOf(owner.address)).to.equal(700);
		});

	});

});
