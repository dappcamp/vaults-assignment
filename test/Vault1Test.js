const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Vault 1", () => {
	let owner;
	let depositor;

	beforeEach(async () => {
		[owner, depositor] = await ethers.getSigners();
		
		// test token deployed with 100 coins
		const EggToken = await ethers.getContractFactory("EggToken");
		eggToken = await EggToken.deploy();
		await eggToken.deployed();
		
		// vault deployed
		Vault1 = await ethers.getContractFactory("Vault1");
		vault1 = await Vault1.deploy(eggToken.address);
		await vault1.deployed();

		// allocate initial coins to start
		await eggToken.transfer(depositor.address, 100);
		await eggToken.transfer(vault1.address, 100);
	});

	describe("Deployment", function (){
		it("Should set the right owner", async function (){
			expect(await vault1.owner()).to.equal(owner.address);
		});

		// test that the initial vault balance is 0
		it ('Set the initial balance', async () => {
			expect(await eggToken.balanceOf(depositor.address)).to.equal(100);
			expect(await eggToken.balanceOf(vault1.address)).to.equal(100);
		});
	});

	describe("Create deposit", function (){
		let deposit = 0;

		this.beforeEach(function(){
			deposit = 1e9;
		});
		
		// incorrect deposit amount
		describe ("Revert scenarios", function () {

			it("Should fail when deposit is not sufficient", async function () {
				await expect(
					vault1
						.connect(depositor)
						.deposit(
							deposit,
							{value: deposit - 10}
						)
				).to.be.revertedWith("Incorrect amount");
			});

			// negative deposit amount
			it('Should fail when deposit is 0', async function () {
				expect(vault1.connect(owner).deposit(0)).to.be.revertedWith("Deposit must be greater than zero.");
			});

			// withdrawal amount too large
			it('Should fail when trying to withdraw more than available', async function (){
				expect(vault1.connect(depositor).withdraw(100)).to.be.revertedWith("Not enough funds available");
			});
		});

		describe ("Pass scenarios", function () {
			it("Should increase balance after deposit", async function() {
				// set allowance for transfers
				deposit = 5;
				await eggToken.connect(depositor).approve(vault1.address, deposit);
				
				// capture initial balances
				let accountBal1 = await eggToken.balanceOf(depositor.address);
				let vaultBal1 = await eggToken.balanceOf(vault1.address);

				await vault1.connect(depositor).deposit(deposit, {value: deposit});
				let accountBal2 = await eggToken.balanceOf(depositor.address);
				let vaultBal2 = await eggToken.balanceOf(vault1.address);

				expect(accountBal2).to.equal(accountBal1 - deposit);
				expect(vaultBal2).to.equal(vaultBal1 - 0 + deposit);
			});
			
			it("Should emit deposited event", async function() {
				// set allowance for transfers
				await eggToken.connect(depositor).approve(vault1.address, 5);
				await expect(vault1.connect(depositor).deposit(5, {value: 5})).to.emit(vault1, "Deposited");
			});

			// decrease balance after withdrawal
			it("Should decrease balance after withdrawal", async function() {
				// deposit some tokens to set up
				deposit = 5;
				await eggToken.connect(depositor).approve(vault1.address, deposit);
				await vault1.connect(depositor).deposit(deposit, {value: deposit});
				
				// set allowance for transfers
				let withdrawal = 5;
				await eggToken.connect(depositor).approve(vault1.address, withdrawal);
				
				// capture initial balances
				let accountBal1 = await eggToken.balanceOf(depositor.address);
				let vaultBal1 = await eggToken.balanceOf(vault1.address);

				await vault1.connect(depositor).withdraw(withdrawal);
				let accountBal2 = await eggToken.balanceOf(depositor.address);
				let vaultBal2 = await eggToken.balanceOf(vault1.address);

				expect(accountBal2).to.equal(accountBal1 - 0 + withdrawal);
				expect(vaultBal2).to.equal(vaultBal1 - withdrawal);
			});

			// emit withdrawal event
			it("Should emit withdrawn event", async function() {
				// deposit some tokens to set up
				deposit = 5;
				await eggToken.connect(depositor).approve(vault1.address, deposit);
				await vault1.connect(depositor).deposit(deposit, {value: deposit});
				
				await expect(vault1.connect(depositor).withdraw(5)).to.emit(vault1, "Withdrawn");
			});
		});
	})
});
