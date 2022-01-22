const { expect } = require("chai");
const { ethers } = require("hardhat");

import { Contract, ContractFactory, Signer } from "ethers";

describe("Vault 2", () => {
	let Vault2: ContractFactory;
	let vault2: Contract;
	let owner: Signer;

	beforeEach(async () => {
		Vault2 = await ethers.getContractFactory("Vault2");
		[owner] = await ethers.getSigners();

		vault2 = await Vault2.deploy();

		await vault2.deployed();
	});
});
