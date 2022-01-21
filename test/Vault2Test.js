const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Vault 2", () => {

	let owner, recipient, other, erc20;

	beforeEach(async () => {
		Vault2 = await ethers.getContractFactory("Vault2");
		[owner, recipient, other] = await ethers.getSigners();

		vault2 = await Vault2.deploy();

		await vault2.deployed();

		
	});

	describe("mint", function () {

		
		it("Should mint 500 Vault tokens when sending 500 Eth", async function () {
			let amount = 500;
			// console.log('coin supply: ', totalSupply);
			
			// await vault2.approve(vault2.address,amount);
			await vault2.connect(owner).mint(amount, {value: amount});
			let balanceOfOwner = await vault2.balanceOf(owner.address);
			console.log('owner balance: ', balanceOfOwner);
			expect(balanceOfOwner).to.equal(amount);
			
		});

		xit("Should not allow user to withdraw more than deposited", async function () {
			let amount = 500;
			console.log('coin address: ', coin1.address);
			let totalSupply = await coin1.totalSupply();
			console.log('coin supply: ', totalSupply);
			let balanceOfOwner = await coin1.balanceOf(owner.address);
			console.log('owner balance: ', balanceOfOwner);
			await coin1.approve(vault1.address,amount);
			await vault1.connect(owner).deposit(coin1.address,amount);
			const ownerBalance = await vault1.balanceOf(coin1.address,owner.address);
			await expect(
				vault1.connect(owner).withdraw(coin1.address, amount + 1)
			).to.be.revertedWith("Cannot withdraw more than balance");
			
		});

		xit("Should allow user to withdraw less than deposited", async function () {
			let amount = 500;
			console.log('coin address: ', coin1.address);
			let totalSupply = await coin1.totalSupply();
			console.log('coin supply: ', totalSupply);
			let balanceOfOwner = await coin1.balanceOf(owner.address);
			console.log('owner balance: ', balanceOfOwner);
			await coin1.approve(vault1.address,amount);
			await vault1.connect(owner).deposit(coin1.address,amount);

			await coin1.approve(owner.address,amount - 1);
			await vault1.connect(owner).withdraw(coin1.address, amount - 1)
			const ownerBalance = await vault1.balanceOf(coin1.address,owner.address);
			expect(ownerBalance).to.equal(1);
			
		});

		
	});
});
