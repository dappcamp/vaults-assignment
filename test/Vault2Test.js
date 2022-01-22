const { expect } = require("chai");
const { BigNumber } = require("ethers");
const { ethers } = require("hardhat");

describe("Vault 2", () => {
	let owner;
	let account1;
	let vault2;
	let Vault2;

	beforeEach(async () => {
		Vault2 = await ethers.getContractFactory("Vault2");
		[owner, account1] = await ethers.getSigners();

		vault2 = await Vault2.deploy();

		await vault2.deployed();
	});

	describe("mint", () => {

		it("takes ether from caller account", async () => {
			const ownerBalanceBefore = await owner.getBalance();

			const response = await vault2.mint({ value: ethers.utils.parseUnits("1.0", "ether") });

			const ownerBalanceAfter = await owner.getBalance();
			const receipt = await response.wait();

			const gasCost = receipt.cumulativeGasUsed.mul(receipt.effectiveGasPrice);
			const ownerBalanceLessCosts = BigNumber
				.from(ownerBalanceBefore)
				.sub(ethers.utils.parseUnits("1.0", "ether"))
				.sub(gasCost);

			expect(ownerBalanceAfter)
				.to.be.equal(ownerBalanceLessCosts);
		});

		it("increases contract's ether", async () => {
			const provider = vault2.provider;
			const contractBalanceBefore = await provider.getBalance(vault2.address);

			await vault2.mint({ value: ethers.utils.parseUnits("1.0", "ether") });

			const contractBalanceAfter = await provider.getBalance(vault2.address);

			expect(contractBalanceBefore)
				.to.equal(BigNumber.from(0));
			expect(contractBalanceAfter)
				.to.equal(ethers.utils.parseUnits("1.0", "ether"));
		});

		it("mints new tokens for the caller", async () => {
			await vault2.mint({ value: ethers.utils.parseUnits("1.0", "ether") });

			const tokenBalance = await vault2.balanceOf(owner.getAddress());

			expect(tokenBalance)
				.to.equal(ethers.utils.parseUnits("1.0", "ether"));
		});
	})

	describe("burn", () => {
		it("reverts the transaction if the contract does not have enough ether", async () => {
			await vault2.mint({ value: ethers.utils.parseUnits("1000", "wei") });

			await expect(
				vault2.burn(2000))
				.to.be.revertedWith("This contract does not have enough ether to burn tokens");
		});

		it("reverts the transaction if there are not enough tokens for account", async () => {
			await vault2.mint({ value: ethers.utils.parseUnits("1000", "wei") });
			const account1Vault2 = vault2.connect(account1);
			await account1Vault2.mint({ value: ethers.utils.parseUnits("1.0", "ether") });

			await expect(
				vault2.burn(2000))
				.to.be.revertedWith("Account does not have enough tokens minted");
		});

		it("transfers ether to account and burns tokens", async () => {
			const ownerBalanceBefore = await owner.getBalance();

			const responseMint = await vault2.mint({ value: ethers.utils.parseUnits("1.0", "ether") });
			const receiptMint = await responseMint.wait();
			const gasCostMint = receiptMint.cumulativeGasUsed.mul(receiptMint.effectiveGasPrice);

			const responseBurn = await vault2.burn(2000);
			const receiptBurn = await responseBurn.wait();
			const gasCostBurn = receiptBurn.cumulativeGasUsed.mul(receiptBurn.effectiveGasPrice);

			const expectedTokens = BigNumber
				.from(ethers.utils.parseUnits("1.0", "ether"))
				.sub(2000);

			const expectedBalance = ownerBalanceBefore
				.sub(ethers.utils.parseUnits("1.0", "ether"))
				.sub(gasCostMint)
				.sub(gasCostBurn)
				.add(2000);

			const ownerBalanceAfter = await owner.getBalance();
			const tokenBalance = await vault2.balanceOf(owner.getAddress());

			expect(ownerBalanceAfter)
				.to.equal(expectedBalance);

			expect(tokenBalance)
				.to.equal(expectedTokens);
		});
	});
});
