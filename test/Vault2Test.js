const { expect } = require("chai");
const { ethers } = require("hardhat");
const { describe, test } = require("mocha");
const { utils } = require("ethers");

const WEI_32_ETH = utils.parseEther("32");

describe("Vault 2", () => {
	let owner;
	let vault2;

	beforeEach(async () => {
		const Vault2 = await ethers.getContractFactory("Vault2");
		[owner] = await ethers.getSigners();

		vault2 = await Vault2.deploy();
	});

	test("mint", async () => {
		expect(await vault2.vaultBalanceOf()).to.equal(0);
		await vault2.mint(WEI_32_ETH, { value: WEI_32_ETH });

		expect(await vault2.vaultBalanceOf()).to.equal(WEI_32_ETH);
	});

	test("burn", async () => {
		expect(await vault2.vaultBalanceOf()).to.equal(0);
		await vault2.mint(WEI_32_ETH, { value: WEI_32_ETH });

		expect(await vault2.vaultBalanceOf()).to.equal(WEI_32_ETH);

		await vault2.burn(WEI_32_ETH);
		expect(await vault2.vaultBalanceOf()).to.equal(0);
	});
});
