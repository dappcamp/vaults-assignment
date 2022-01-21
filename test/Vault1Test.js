const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Vault 1", () => {
	beforeEach(async () => {
		testERC20 = await (await ethers.getContractFactory("Vault1"));
		await testERC20.deployed();


		Vault1 = await ethers.getContractFactory("Vault1");
		[owner, addr1] = await ethers.getSigners();
		vault1 = await Vault1.deploy(testERC20.address);
		await vault1.deployed();
	});

	describe("deposit", function () {
		it("Requested VAULT should be equal to passed in Ether", async function () {
			const options = {value: ethers.utils.parseEther("0.000000001")};
			await expect(
				vault2.connect(acct1).mint(1, options)
			).to.be.revertedWith("Amount of VAULT requested != Ether passed");
			let acct1Balance = await vault2.balanceOf(acct1.address);
			acct1Balance = acct1Balance.toNumber();
			expect(acct1Balance).to.equal(0);
		});

		it("Get VAULT equal to passed in Ether", async function () {
			const options = {value: ethers.utils.parseEther("0.000000001")};
			await vault2.connect(acct1).mint(10**9, options);
			let acct1Balance = await vault2.balanceOf(acct1.address);
			acct1Balance = acct1Balance.toNumber();
			expect(acct1Balance).to.equal(10**9);
		});
	});
});
