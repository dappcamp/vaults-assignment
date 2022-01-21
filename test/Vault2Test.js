const { expect } = require("chai");
const { ethers, waffle } = require("hardhat");

const provider = waffle.provider;


describe("Vault 2", () => {

	let owner, recipient, other, erc20;

	beforeEach(async () => {
		Vault2 = await ethers.getContractFactory("Vault2");
		[owner, recipient, other] = await ethers.getSigners();

		vault2 = await Vault2.deploy();

		await vault2.deployed();

		var ownerETH = await provider.getBalance(owner.address);
		console.log('original owner eth: ', ownerETH);

		
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

		it("Should send back ether when burning tokens", async function () {
			let amount = 500;
			// console.log('coin supply: ', totalSupply);
			
			ownerETH = await provider.getBalance(owner.address);
			console.log('before mint owner eth: ', ownerETH);
			// await vault2.approve(vault2.address,amount);
			await vault2.connect(owner).mint(amount, {value: amount});
			let balanceOfOwner = await vault2.balanceOf(owner.address);
			console.log('Vault 2 test 2 - owner balance: ', balanceOfOwner);

			ownerETH = await provider.getBalance(owner.address);
			console.log('after mint owner eth: ', ownerETH);
			

			// await coin1.approve(owner.address, 1);
			await vault2.connect(owner).burn(1);

			balanceOfOwner = await vault2.balanceOf(owner.address);
			console.log('Vault 2 test 2b - owner balance: ', balanceOfOwner);

			ownerETH = await provider.getBalance(owner.address);
			console.log('after burn owner eth: ', ownerETH);

			expect(balanceOfOwner).to.equal(amount-1);

			
			
			
		});
		
	});
});
