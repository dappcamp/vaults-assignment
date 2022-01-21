const { ethers } = require("hardhat");
const { use, expect } = require('chai');
const { ContractFactory, utils } = require('ethers');
const { MockProvider } = require('@ethereum-waffle/provider');
const { waffleChai } = require('@ethereum-waffle/chai');
const { deployMockContract } = require('@ethereum-waffle/mock-contract');

const IERC20 = require('../artifacts/@openzeppelin/contracts/token/ERC20/IERC20.sol/IERC20.json');
const Vault1 = require('../artifacts/contracts/Vault1.sol/Vault1.json');

use(waffleChai);

describe("Vault 1", () => {

	async function setup() {
		const [sender] = new MockProvider().getWallets();
		const mockERC20 = await deployMockContract(sender, IERC20.abi);
		const contractFactory = new ContractFactory(Vault1.abi, Vault1.bytecode, sender);
		const contract = await contractFactory.deploy();

		return { sender, contract, mockERC20 };
	}

	describe("deposit", () => {
		it("should transfer an amount", async () => {
			const { sender, contract, mockERC20 } = await setup();

			await mockERC20.mock.transfer.returns(true);
			await contract.estimateGas.deposit(1000, mockERC20.address);
			await contract.deposit(1000, mockERC20.address);

			let balance = await contract.tokenBalances(sender.address, mockERC20.address);
			expect(balance.toNumber()).to.equal(1000);

			expect("transfer").to.be.calledOnContract(mockERC20);
		});
	});

	describe("withdrawal", () => {
		it("allow withdrawal lesser than or equal to deposit", async () => {
			const { sender, contract, mockERC20 } = await setup();

			const connectedContract = contract.connect(sender);

			await mockERC20.mock.transfer.returns(true);
			await mockERC20.mock.transferFrom.returns(true);

			await contract.estimateGas.deposit(1000, mockERC20.address);
			await connectedContract.deposit(1000, mockERC20.address);
			await contract.estimateGas.withdraw(100, mockERC20.address);
			await connectedContract.withdraw(100, mockERC20.address);

			let balance = await connectedContract.tokenBalances(sender.address, mockERC20.address);
			expect(balance.toNumber()).to.equal(900);
		});
	})
});
