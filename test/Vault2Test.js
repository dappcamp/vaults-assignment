const { EtherscanProvider } = require("@ethersproject/providers");
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Vault 2", () => {
	let provider;
	let deployer, user;

	beforeEach(async () => {
		provider = ethers.provider;

		[deployer, user] = await ethers.getSigners();

		Vault2 = await ethers.getContractFactory("Vault2");
		vault2 = await Vault2.deploy();
		await vault2.deployed();
	});

	describe("mint", () => {
		it("requires an amount > 0", async () => {
			await expect(
				vault2.connect(user).mint()
			).to.be.revertedWith("Amount must be > 0");
		});

		it("mints VAULT tokens equal to the ether given", async () => {
			const contractInitialBalance = await provider.getBalance(vault2.address);

			const etherAmountString = ethers.utils.parseEther("0.5");
			await expect(
				vault2.connect(user).mint({ value: etherAmountString })
			)
				.to.emit(vault2, "Minted")
				.withArgs(user.address, etherAmountString);

			expect(await provider.getBalance(vault2.address)).to.equal(contractInitialBalance.add(etherAmountString));
			expect(await vault2.balanceOf(user.address)).to.equal(etherAmountString);
		});
	});

	describe("burn", () => {
		it("requires an amount > 0", async () => {
			await expect(
				vault2.connect(user).burn(0)
			).to.be.revertedWith("Amount must be > 0");
		});

		it("reverts if you try to burn more tokens than you have", async () => {
			const etherAmountString = ethers.utils.parseEther("0.5");
			await vault2.connect(user).mint({ value: etherAmountString });

			const doubleEtherAmountString = ethers.utils.parseEther("1.0");

			await expect(
				vault2.burn(doubleEtherAmountString)
			).to.be.revertedWith("Not enough balance");
		});

		it("burns VAULT tokens and transfers an equal amount of ether", async () => {
			const contractInitialBalance = await provider.getBalance(vault2.address);

			const etherAmountString = ethers.utils.parseEther("0.5");
			await vault2.connect(user).mint({ value: etherAmountString });

			const userPostMintBalance = await user.getBalance();

			const halfEtherAmountString = ethers.utils.parseEther("0.25");

			await expect(
				vault2.connect(user).burn(halfEtherAmountString)
			)
				.to.emit(vault2, "Burned")
				.withArgs(user.address, halfEtherAmountString);

			expect(await vault2.balanceOf(user.address)).to.equal(halfEtherAmountString);

			const newUserBalance = await user.getBalance();
			expect(newUserBalance.gt(userPostMintBalance)).to.equal(true);

			expect(await provider.getBalance(vault2.address)).to.equal(contractInitialBalance.add(halfEtherAmountString));
		});
	});
});