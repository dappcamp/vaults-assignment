const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Vault 1", () => {

	let owner, recipient, other, erc20;

	beforeEach(async () => {
		Vault1 = await ethers.getContractFactory("Vault1");
		[owner, recipient, other] = await ethers.getSigners();

		vault1 = await Vault1.deploy();

		await vault1.deployed();

		Coin1 = await ethers.getContractFactory("Coin1");
		coin1 = await Coin1.deploy("Coin1","CN1");

		await coin1.deployed();


		// const abi = [
		// 	// Read-Only Functions
		// 	"function balanceOf(address owner) view returns (uint256)",
		// 	"function decimals() view returns (uint8)",
		// 	"function symbol() view returns (string)",
		
		// 	// Authenticated Functions
		// 	"function transfer(address to, uint amount) returns (bool)",
		
		// 	// Events
		// 	"event Transfer(address indexed from, address indexed to, uint amount)"
		// ];
		
		// // This can be an address or an ENS name
		// const address = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
		

		// erc20 = new ethers.Contract(address, abi, other);

	});

	describe("deposit", function () {
		it("Should take in deposit amount", async function () {
			let amount = 500;
			console.log('coin address: ', coin1.address);
			let totalSupply = await coin1.totalSupply();
			console.log('coin supply: ', totalSupply);
			let balanceOfOwner = await coin1.balanceOf(owner.address);
			console.log('owner balance: ', balanceOfOwner);
			await coin1.approve(vault1.address,amount);
			await vault1.connect(owner).deposit(coin1.address,amount);
			const ownerBalance = await vault1.balanceOf(coin1.address,owner.address);
			expect(ownerBalance).to.equal(amount);
			
		});

		it("Should not allow user to withdraw more than deposited", async function () {
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
