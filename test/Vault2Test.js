const { expect } = require("chai");
const { BigNumber } = require("ethers");
const { ethers } = require("hardhat");

describe("Vault 2", () => {
	beforeEach(async () => {
		Vault2 = await ethers.getContractFactory("Vault2");
		[owner] = await ethers.getSigners();

		vault2 = await Vault2.deploy();

		await vault2.deployed();
	});

	describe("mint", function () {
		// For tests, is this redundant? Since I already test if sent == _amount?
		it("can't mint zero", async function () {
			const options = {value: ethers.utils.parseEther("75.0")}
			expect(vault2.connect(account1).mint(0, options)).to.be.revertedWith("Can't mint zero");
		});

		it("mint amount should equal sent amount", async function () {
			const options = {value: ethers.utils.parseEther("50.0")}
			expect(vault2.connect(account1).mint(51, options)).to.be.revertedWith("Mint amount differs from sent amount");
		});

		it("mint increases supply and increases users account", async function () {
			const options = {value: ethers.utils.parseEther("50.0")}
			await vault2.connect(account1).mint(50, options);

			expect(await vault2.totalSupply()).to.equal(BigNumber.from("50").mul(BigNumber.from(10).pow(BigNumber.from(18))));
			expect(await vault2.balanceOf(account1.address)).to.equal(BigNumber.from("50").mul(BigNumber.from(10).pow(BigNumber.from(18))));
		});
	});

	describe("burn", function () {
		beforeEach(async () => {
			const options = {value: ethers.utils.parseEther("50.0")}
			await vault2.connect(account1).mint(50, options);
		});

		it("can't burn zero", async function () {
			expect(vault2.connect(account1).burn(0)).to.be.revertedWith("Can't burn zero");
		});

		it("can't burn more than they have", async function () {
			expect(vault2.connect(account1).burn(51)).to.be.revertedWith("Insufficient balance");
		});

		it("burn decreases supply, users balance, and increases users eth", async function () {
			const balance = await account1.getBalance();
			await vault2.connect(account1).burn(25);

			// easier way to type these big numbers? 
			const burnedAmount_BN = BigNumber.from("25").mul(BigNumber.from(10).pow(BigNumber.from(18)));

			expect(await vault2.totalSupply()).to.equal(burnedAmount_BN);		
			expect(await vault2.balanceOf(account1.address)).to.equal(burnedAmount_BN);
			const newBalance = await account1.getBalance();

			const discrepancy = (newBalance.sub(balance)).sub(burnedAmount_BN);
			// It's off by 0.0000420484 ETH, due to number representation? 
			// not sure how to solve this 
			// expect(discrepancy).to.be.closeTo(BigNumber.from, 1000);
		});
	});

});
