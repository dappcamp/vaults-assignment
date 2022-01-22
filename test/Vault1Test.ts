import { Contract, ContractFactory, Signer } from "ethers";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("Vault 1", () => {

	let Vault1: ContractFactory;
	let vault1Token: Contract;
	let bottleCapsFactory: ContractFactory;
	let bottleCapsToken: Contract;
	let owner: Signer;
	let addr1: Signer;
	let addr2: Signer;

	beforeEach(async () => {
		[owner, addr1, addr2] = await ethers.getSigners();

		bottleCapsFactory = await ethers.getContractFactory("BottleCaps", owner);
		bottleCapsToken = await bottleCapsFactory.deploy()
		await bottleCapsToken.deployed();

		Vault1 = await ethers.getContractFactory("Vault1", owner);
		vault1Token = await Vault1.deploy(bottleCapsToken.address);

		await vault1Token.deployed();
	});


	describe("Deployment", async function () {
		it("Should assign the total supply of tokens to the owner", async function () {
			const ownerBalance = await bottleCapsToken.balanceOf(await owner.getAddress());
			expect(await bottleCapsToken.totalSupply()).to.equal(ownerBalance);
		});
	});

	describe("#deposit", async function () {
		it("should take in a deposit amount", async function () {
			let addr1Address: string = await addr1.getAddress();
			await bottleCapsToken.connect(owner).transfer(addr1Address, 3); // Have some caps to transfer

			await bottleCapsToken.connect(addr1).approve(vault1Token.address, 1);
			await vault1Token.connect(addr1).deposit(1);

			expect(await vault1Token.balanceOf(addr1Address)).to.eq(1);
			expect(await bottleCapsToken.balanceOf(addr1Address)).to.eq(2);
		})
	});

	describe("#withdraw", async function () {
		it("should allow users to withdraw <= what's deposited", async function () {
			let addr1Address: string = await addr1.getAddress();
			await bottleCapsToken.connect(owner).transfer(addr1Address, 3);
			await bottleCapsToken.connect(addr1).approve(vault1Token.address, 1);
			await vault1Token.connect(addr1).deposit(1);
			await vault1Token.connect(addr1).withdraw(1);
			expect(await vault1Token.balanceOf(addr1Address)).to.eq(0);
			expect(await bottleCapsToken.balanceOf(addr1Address)).to.eq(3);
		});
		it("should not allow overdrafts", async function () {
			let addr1Address: string = await addr1.getAddress();
			await bottleCapsToken.connect(owner).transfer(addr1Address, 3);
			await bottleCapsToken.connect(addr1).approve(vault1Token.address, 1);
			await vault1Token.connect(addr1).deposit(1);

			await expect(
				vault1Token.connect(addr1).withdraw(2)
			).to.be.revertedWith("Attempted to withdraw more than current balance");
		});
	});
});
