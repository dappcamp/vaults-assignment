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
		it("should transfer a valid amount", async () => {
			const { sender, contract, mockERC20 } = await setup();

			await mockERC20.mock.transfer.returns(true);
			await contract.estimateGas.deposit(1000, mockERC20.address);
			await contract.deposit(1000, mockERC20.address);

			let balance = await contract.tokenBalances(sender.address, mockERC20.address);
			expect(balance.toNumber()).to.equal(1000);

			expect("transfer").to.be.calledOnContract(mockERC20);
		});

		it("should revert if there is arithmetic overflow", async () => {
			const { sender, contract, mockERC20 } = await setup();
			const highNumber = Math.pow(2, 256);

			await mockERC20.mock.transfer.returns(true);
			await contract.estimateGas.deposit(highNumber, mockERC20.address);

			await contract.deposit(highNumber, mockERC20.address);

			await expect(contract.deposit(highNumber, mockERC20.address))
				.to.be.revertedWith("Could not deposit token amount error in balance");
		});

		it("should revert if the transfer failed", async () => {
			const { sender, contract, mockERC20 } = await setup();

			await mockERC20.mock.transfer.returns(false);
			await contract.estimateGas.deposit(1000, mockERC20.address);
			await expect(contract.deposit(1000, mockERC20.address))
				.to.be.revertedWith("Could not transfer the token");
		});
	});

	describe("withdrawal", async () => {
		const { sender, contract, mockERC20 } = await setup();

		const connectedContract = contract.connect(sender);

		await mockERC20.mock.transfer.returns(true);
		await mockERC20.mock.transferFrom.returns(true);

		await contract.estimateGas.deposit(1000, mockERC20.address);
		await connectedContract.deposit(1000, mockERC20.address);

		it("allows withdrawals lesser than deposit", async () => {
			await contract.estimateGas.withdraw(100, mockERC20.address);
			await connectedContract.withdraw(100, mockERC20.address);

			let balance = await connectedContract.tokenBalances(sender.address, mockERC20.address);
			expect(balance.toNumber()).to.equal(900);
		});

		it("should revert if there is insufficient balance", async () => {
			await contract.estimateGas.withdraw(30000, mockERC20.address);
			await expect(connectedContract.withdraw(30000, mockERC20.address))
				.to.be.revertedWith("Insufficient balance to withdraw tokens");
		});

		it("should revert if there is arithmetic overflow", async () => {
			const highNumber = Math.pow(2, 256);

			await contract.estimateGas.withdraw(highNumber, mockERC20.address);

			await expect(connectedContract.withdraw(highNumber, mockERC20.address))
				.to.be.revertedWith("Could not withdraw amount error in balance")
		});

		it("should revert if the transfer failed", async () => {
			await contract.estimateGas.withdraw(100, mockERC20.address);
			await connectedContract.withdraw(100, mockERC20.address);

			let balance = await connectedContract.tokenBalances(sender.address, mockERC20.address);
			expect(balance.toNumber()).to.equal(900);
		});
	})
});
