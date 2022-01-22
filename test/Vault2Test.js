const { expect } = require("chai");
const { ethers, waffle } = require("hardhat");

describe("Vault 2", () => {
	beforeEach(async () => {
		Vault2 = await ethers.getContractFactory("Vault2");
		[owner] = await ethers.getSigners();

		vault2 = await Vault2.deploy();
		provider = waffle.provider;

		await vault2.deployed();
	});


	describe("mint", function () {

		it("mint VAULT", async function () {
			const oldBalance = await provider.getBalance(owner.address);
			expect( await provider.getBalance(vault2.address) ).to.be.equal(0);

			await (
				vault2
			    .connect(owner)
					.mint({
						value: ethers.utils.parseEther("1.0")
				})
			)

			expect( await provider.getBalance(vault2.address)).to.be.equal(ethers.utils.parseEther("1.0"));
			expect( await provider.getBalance(owner.address) < oldBalance ).to.be.true;

		});

	});

	describe("burn", function () {

		it("burn VAULT", async function () {
			await (
				vault2
					.connect(owner)
					.mint({
						value: ethers.utils.parseEther("1.0")
				})
			)

			const intermediateBalance = await provider.getBalance(owner.address);
			await (
				vault2
					.burn(ethers.utils.parseEther("1.0"))
			)
			expect( await provider.getBalance(owner.address) > intermediateBalance ).to.be.true;
			expect( await provider.getBalance(vault2.address) ).to.be.equal(0);

			await expect(
				vault2
					.burn(ethers.utils.parseEther("1.0"))
			).to.be.revertedWith("ERC20: burn amount exceeds balance");

		});

	});


});
