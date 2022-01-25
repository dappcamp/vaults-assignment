const { expect } = require("chai");
const { describe } = require("mocha");
const { ethers } = require("hardhat");

describe("Vault1", function () {
    let KNMtoken;
    let vault1;
    let owner;

	beforeEach("deploy KNMToken and Vault1", async () => {
        [owner] = await ethers.getSigners();

        const KNMToken = await ethers.getContractFactory("KNMToken");
		KNMtoken = await KNMToken.deploy(100000);
		await KNMtoken.deployed();
		
		const Vault1 = await ethers.getContractFactory("Vault1");
		vault1 = await Vault1.deploy(KNMtoken.address);
		await vault1.deployed();
	});

    it("should supply 100000 KNM tokens", async function () {
        expect(await KNMtoken.totalSupply()).to.equal(100000);
    });

    it("should create owner's token balance of 100000", async function () {
        expect(await KNMtoken.balanceOf(owner.address)).to.equal(100000);
    });

  describe("deposit", function () {
    it("should revert when deposit amount is not positive", async function () {
        await expect(vault1.deposit(0))
        .to.be.revertedWith("Amount should be positive.");
    });

    it("should decrease depositer's wallet token balance by message value when valid amount is provided", async function () {
        await KNMtoken.approve(vault1.address, 100000);
        await vault1.deposit(1000);
        expect(await KNMtoken.balanceOf(owner.address)).to.equal(99000);
    });

    it("should increase depositer's balance on this contract by message value when valid amount is provided", async function () {
        await KNMtoken.approve(vault1.address, 100000);
        await vault1.deposit(1000);
        expect(await vault1.balances(owner.address)).to.equal(1000);
    });
	
	it("should emit deposited event when valid details are provided", async function () {
        await KNMtoken.approve(vault1.address, 100000);
        await expect(vault1.deposit(1000))
			.to.emit(vault1, "Deposited")
			.withArgs(owner.address, 1000);
	});
  });

  describe("withdraw", function () {
    it("should revert when withdrawal amount is not positive", async function () {
        await KNMtoken.approve(vault1.address, 100000);
        await expect(vault1.deposit(1000));
        await expect(vault1.withdraw(0))
        .to.be.revertedWith("Amount should be positive.");
    });

    it("should revert when withdrawal amount is greater than withdrawer's balance on this contract", async function () {
        await KNMtoken.approve(vault1.address, 100000);
        await expect(vault1.deposit(1000));
        await expect(vault1.withdraw(3000)
        ).to.be.revertedWith("ERC20: transfer amount exceeds balance");
    });

    it("should increase depositer's wallet token balance by message value when valid amount is provided", async function () {
        await KNMtoken.approve(vault1.address, 100000);
        await KNMtoken.approve(owner.address, 100000);
        await vault1.deposit(2000);
        await vault1.withdraw(1000);
        expect(await KNMtoken.balanceOf(owner.address)).to.equal(99000);
    });

    it("should decrease depositer's balance on this contract by message value when valid amount is provided", async function () {
        await KNMtoken.approve(vault1.address, 100000);
        await vault1.deposit(2000);
        await vault1.withdraw(1000);
        expect(await vault1.balances(owner.address)).to.equal(1000);
    });
	
	it("should emit deposited event when valid details are provided", async function () {
        await KNMtoken.approve(vault1.address, 100000);
        await vault1.deposit(2000);
        await expect(vault1.withdraw(1000))
			.to.emit(vault1, "Withdrawn")
			.withArgs(owner.address, 1000);
	});
  });    
});
