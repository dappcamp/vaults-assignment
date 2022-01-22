const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Vault 2", () => {
	beforeEach(async () => {
		Vault2 = await ethers.getContractFactory("Vault2");
		[owner] = await ethers.getSigners();

		vault2 = await Vault2.deploy();

		await vault2.deployed();
	});


	describe("mint", function () {
		it("should revert when invalid amount is entered for mint", async function () {
			await expect( vault2.connect(owner).mint(1,{value : 0 })
			).to.be.revertedWith("eth should equal to amount");
		});

	});


	describe("mint", function () {
		it("mint call should send tokens", async function () {
    
			let openingBal = await vault2.balanceOf(owner.address);
			await vault2.connect(owner).mint(5,{value : 5})
            let endingBal =  await vault2.balanceOf(owner.address);
			await expect(endingBal).to.equal(5);
		});

	});

	describe("burn", function () {
		it("should revert when invalid amount is entered for burn", async function () {
			await expect( vault2.connect(owner).burn(0)
			).to.be.revertedWith("Invalid amount");
		});

	});


		describe("burn", function () {
		it("burn call should burn tokens", async function () {
    
	        await vault2.connect(owner).mint(5,{value : 5})
			let openingBal = await vault2.balanceOf(owner.address);
			await vault2.connect(owner).burn(5)
            let endingBal =  await vault2.balanceOf(owner.address);
			await expect(endingBal).to.equal(0);
		});

	});



});
