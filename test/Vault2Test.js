const { expect } = require("chai");
const { ethers } = require("hardhat");
const { isCallTrace } = require("hardhat/internal/hardhat-network/stack-traces/message-trace");

describe("Vault 2", () => {
	let ONE_ETH = ethers.utils.parseEther("1.0");

	beforeEach(async () => {
		Vault2 = await ethers.getContractFactory("Vault2");
		[owner, account1] = await ethers.getSigners();

		vault2 = await Vault2.deploy();

		await vault2.deployed();
	});

	describe("name", () => {
		it("should be Vault2", async () => {
			let name = await vault2.name();
			expect(name).to.equal("Vault2");
		})
	})

	describe("symbol", () => {
		it("should be VAULT", async () => {
			let name = await vault2.symbol();
			expect(name).to.equal("VAULT");
		})
	})

	describe("balanceOf", () => {
		it("should be zero initially", async () => {
			let vaultBalance = await vault2.balanceOf(owner.address);
			expect(vaultBalance).to.equal(0);
		})
	})

	describe("mint", () => {
		it("should mint 10^18 VAULT when caller pays 1 ETH", async () => {
			await expect(
				vault2.connect(owner).mint({
					value: ONE_ETH
				})
			).to.changeEtherBalance(owner, -1);

			let vaultBalance = await vault2.balanceOf(owner.address);
			expect(vaultBalance).to.equal(ONE_ETH);
		})

		it("should revert when no payment is provided", async () => {
			await expect(
				vault2.connect(owner).mint()
			).to.be.revertedWith("No payment has been provided");
		})
	})

	describe("burn", () => {
		beforeEach("mint 10**18 VAULT", async () => {
			await vault2.connect(owner).mint({
				value: ONE_ETH
			})
		})

		it("should transfer eth back to the caller", async () => {
			await expect(
				vault2.connect(owner).burn(ONE_ETH)
			).to.changeEtherBalance(owner, 1);
		})

		it("should reduce total supply by amount burned", async () => {
			let initialSupply = await vault2.totalSupply()
			expect(initialSupply).to.equal(ONE_ETH);

			await vault2.connect(owner).burn(ONE_ETH);

			let finalSupply = await vault2.totalSupply()
			expect(finalSupply).to.equal(0);
		})
	})
});
