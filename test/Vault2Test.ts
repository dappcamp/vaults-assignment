import { expect } from "chai";
import { ethers } from "hardhat";

import { Contract, ContractFactory, Signer } from "ethers";

describe("Vault 2", () => {
	let Vault2: ContractFactory;
	let vault2: Contract;
	let bottleCapsFactory: ContractFactory;
	let bottleCaps: Contract;
	let owner: Signer;
	let addr1: Signer;
	let addr2: Signer;

	beforeEach(async () => {
		[owner, addr1, addr2] = await ethers.getSigners();

		Vault2 = await ethers.getContractFactory("Vault2", owner);
		vault2 = await Vault2.deploy();

		await vault2.deployed();
	});

	describe("#mint", async () => {
		it("should take eth and mint CAPS", async () => {
			await vault2.connect(addr1).mint({
				value: ethers.utils.parseEther("1.0")
			});
			let addr1Address: string = await addr1.getAddress();
			let newBalance = await vault2.balanceOf(addr1Address);
			expect(newBalance).to.eq(ethers.utils.parseEther("1.0"));
		});
	});

	describe("#burn", async () => {
		it("transfers eth in and out of contract TODO", async () => {
			await vault2.connect(addr1).mint({
				value: ethers.utils.parseEther("1.0")
			});
			await vault2.connect(addr1).burn(ethers.utils.parseEther("1.0"));
			let addr1Address: string = await addr1.getAddress();
			let newBalance = await vault2.balanceOf(addr1Address);
			expect(newBalance).to.eq(0);
		});
	});
});
