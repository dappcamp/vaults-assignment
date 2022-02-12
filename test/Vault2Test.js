const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Vault 2", () => {
	let provider;
	let vault2;
	let owner, account1, account2, account3;
	beforeEach(async () => {
		let Vault2 = await ethers.getContractFactory("Vault2");
		provider = ethers.getDefaultProvider();
		[owner, account1, account2, account3] = await ethers.getSigners();

		vault2 = await Vault2.deploy(10000);

		await vault2.deployed();

	});

	it('should be able to mint', async function () {
		await vault2.connect(account1).mint(100, { value: 100 });
		expect(await vault2.balanceOf(account1.address)).to.equal(100);

	});

	it('should be able to burn', async function () {
		await vault2.connect(account1).mint(100, { value: 100 });
		await vault2.connect(account1).burn(100);
		expect(await vault2.balanceOf(account1.address)).to.equal(0);
	});

	it('should be able to partial burn', async function () {
		await vault2.connect(account1).mint(100, { value: 100 });
		await vault2.connect(account1).burn(50);
		expect(await vault2.balanceOf(account1.address)).to.equal(50);
	});

	it('should not be able to burn', async function () {
		await vault2.connect(account1).mint(50, { value: 50 });
		await expect(vault2.connect(account2).burn(200)).to.be.revertedWith('ERC20: burn amount exceeds balance');

	});


});
