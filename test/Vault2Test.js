const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Vault 2", () => {
	beforeEach(async () => {
		[owner, user] = await ethers.getSigners();
		
		// vault deployed
		Vault2 = await ethers.getContractFactory("Vault2");
		vault2 = await Vault2.deploy();
		await vault2.deployed();
	});

	describe("Deployment", function (){
		it("Should set the right owner", async function (){
			expect(await vault1.owner()).to.equal(owner.address);
		});

		// test that the initial vault balance is 0
		it ('Set the initial balance', async () => {
			expect(await vault2.balanceOf(user.address)).to.equal(0);
		});
	});

	// test mint function, take ether, mint equal amount of VAULT
	describe("Mint some VAULT tokens", function (){
		let amount = 10;
		it("Revert if amount isn't equal to Ether in transaction", async function (){
			await expect(
				vault2
					.connect(user)
					.mint(
						amount,
						{value: amount - 5}
					)
			).to.be.revertedWith("Amount must equal the number of eth sent");
		});

		it("Emit Minted event", async function (){
			await expect (
				vault2
					.connect(user)
					.mint(
						amount, {value: amount}
					)
			).to.emit(vault2,"Minted")
		});

		it("Update balance in the vault", async function () {
			const bal1 = await vault2.balanceOf(user.address);
			await vault2.connect(user).mint(amount, {value: amount});
			const bal2 = await vault2.balanceOf(user.address);
			expect(bal2).to.equal(bal1 + amount);
		});
	});

	
	// test burn function, burn tokens and get equal amount of Ether back
	describe("Burn some VAULT tokens and get Ether", function (){
		let amount = 10;
		it("Revert if amount isn't equal to tokens in transaction", async function (){
			await expect(
				vault2
					.connect(user)
					.burn(
						amount,
						{value: amount - 5}
					)
			).to.be.revertedWith("Amount must equal the number of tokens sent");
		});

		it("Emit Burned event", async function (){
			// first mint some tokens
			await vault2.connect(user).mint(amount, {value: amount});
			
			// then test burning
			await expect (
				vault2
					.connect(user)
					.burn(
						amount, {value: amount}
					)
			).to.emit(vault2,"Burned")
		});

		it("Update balance in the vault", async function () {
			// first mint some tokens
			await vault2.connect(user).mint(amount, {value : amount});

			// then test burning
			const bal1 = await vault2.balanceOf(user.address);
			await vault2.connect(user).burn(amount, {value: amount});
			const bal2 = await vault2.balanceOf(user.address);
			expect(bal2).to.equal(bal1 - amount);
		});
	});
});
