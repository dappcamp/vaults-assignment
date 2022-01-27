const { expect } = require("chai");
const { describe } = require("mocha");
const { ethers } = require("hardhat");

describe("Vault2", function () {
    let vault2;
    let owner;

	beforeEach("deploy Vault2", async () => {
        [owner] = await ethers.getSigners();
		
		const Vault2 = await ethers.getContractFactory("Vault2");
		vault2 = await Vault2.deploy();
		await vault2.deployed();
	});

  describe("mint", function () {
    it("should revert when amount is zero", async function () {
        await expect(vault2.mint(0))
        .to.be.revertedWith("amount cannot be zero");
    });

	it("should increase the token supply by message value when valid amount is provided", async function () {
        let originalbalance = await vault2.totalSupply();
        originalbalance = originalbalance.toNumber();
        await vault2.mint(20000, {value: 20000});

        let laterbalance = await vault2.totalSupply();
        laterbalance = laterbalance.toNumber();

        expect(laterbalance).to.equal(originalbalance + 20000);
    });

	it("should increase minter's token balance by message value when valid amount is provided", async function () {
        let originalbalance = await vault2.balanceOf(owner.address);
        originalbalance = originalbalance.toNumber();
        await vault2.mint(20000, {value: 20000});

        let laterbalance = await vault2.balanceOf(owner.address);
        laterbalance = laterbalance.toNumber();

        expect(laterbalance).to.equal(originalbalance + 20000);
    });

	/*it("should emit minted event when valid details are provided", async function () {
        await expect(vault2.mint(20000, {value: 20000}))
			.to.emit(vault2, "Minted")
			.withArgs(owner.address, 20000);
	});*/
  });

  describe("burn", function () {
    it("should revert when amount is not positive", async function () {
        await vault2.mint(20000, {value: 20000});
        await expect(vault2.burn(0))
        .to.be.revertedWith("Amount should be positive.");
    });

	it("should decrease the token supply by message value when valid amount is provided", async function () {
        await vault2.mint(20000, {value: 20000});
		let originalbalance = await vault2.totalSupply();
        originalbalance = originalbalance.toNumber();
		
		await vault2.burn(10000);

        let laterbalance = await vault2.totalSupply();
        laterbalance = laterbalance.toNumber();

        expect(laterbalance).to.equal(originalbalance - 10000);
    });

	it("should decrease minter's token balance by message value when valid amount is provided", async function () {
        await vault2.mint(20000, {value: 20000});
		let originalbalance = await vault2.balanceOf(owner.address);
        originalbalance = originalbalance.toNumber();
        await vault2.burn(10000);

        let laterbalance = await vault2.balanceOf(owner.address);
        laterbalance = laterbalance.toNumber();

        expect(laterbalance).to.equal(originalbalance - 10000);
    });
	
	/*it("should emit burned event when valid details are provided", async function () {
        await vault2.mint(20000, {value: 20000});
        await expect(vault2.burn(10000))
			.to.emit(vault2, "Burned")
			.withArgs(owner.address, 10000);
	});*/
  });
});
