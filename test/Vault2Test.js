const { getAddress } = require("@ethersproject/address");
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Vault 2", () => {
	beforeEach(async () => {
		Vault2 = await ethers.getContractFactory("Vault2");
		[owner, acct1, acct2] = await ethers.getSigners();

		vault2 = await Vault2.deploy();

		await vault2.deployed();
	});

	describe("mint", function () {
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

	describe("burn", function () {
		it("Burn VAULT user does not own should fail", async function () {
			await expect(
				vault2.connect(acct1).burn(1)
			).to.be.revertedWith("ERC20: burn amount exceeds balance");
			let acct1Balance = await vault2.balanceOf(acct1.address);
			acct1Balance = acct1Balance.toNumber();
			expect(acct1Balance).to.equal(0);
		});

		it("Burn all VAULT to get Ether back", async function () {
			const options = {value: ethers.utils.parseEther("0.000000001")};
			await vault2.connect(acct1).mint(10**9, options);

			await vault2.connect(acct1).burn(10**9);
			let acct1Balance = await vault2.balanceOf(acct1.address);
			acct1Balance = acct1Balance.toNumber();
			expect(acct1Balance).to.equal(0);
		});

		it("Verify over burning is not allowed", async function () {
			await expect(
				vault2.connect(acct1).burn(1)
			).to.be.revertedWith("ERC20: burn amount exceeds balance");
			let acct1Balance = await vault2.balanceOf(acct1.address);
			acct1Balance = acct1Balance.toNumber();
			expect(acct1Balance).to.equal(0);
		});
	});

	/*describe("exploit burn reentrancy", function () {
		it("Burn VAULT user does not own should fail", async function () {
			ReentrancyExploit = await ethers.getContractFactory("ReentrancyExploit");
			[rowner] = await ethers.getSigners();
			reentrancyExploit = await ReentrancyExploit.deploy();
			await reentrancyExploit.deployed();

			expect(reentrancyExploit.getBalance()).to.equal(0);
			// first check VAULT balance for exploit address to be 0
			let rownerBalance = await vault2.balanceOf(rowner.address);
			rownerBalance = rownerBalance.toNumber();
			expect(rownerBalance).to.equal(0);

			const options = {value: ethers.utils.parseEther("0.000000001")};
			await reentrancyExploit.connect(rowner).receive();

			// check VAULT balance for exploit address
			let acct1Balance = await vault2.balanceOf(acct1.address);
			acct1Balance = acct1Balance.toNumber();
			expect(acct1Balance).to.equal(0);
			expect(reentrancyExploit.getBalance()).to.equal(0);
		});
	});*/
});
