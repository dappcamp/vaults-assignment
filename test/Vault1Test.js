const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Vault 1", () => {
	let vault1;
	let owner;
	let account1;

	beforeEach(async () => {
		Token = await ethers.getContractFactory("TestToken");
		Vault1 = await ethers.getContractFactory("Vault1");

		const accounts = await ethers.getSigners();
		owner = accounts[0];
		account1 = accounts[1];

		token = await Token.deploy();
		await token.deployed();

		vault1 = await Vault1.deploy(token.address);
		await vault1.deployed();

		await token.transfer(account1.address, 100_000);
	});

	describe("token", function () {
		it("should have initial balance", async function () {
			let balance = await token.balanceOf(account1.address);
			expect(balance).to.equal(100_000);
		})
	});

	describe("deposit", function () {
		it("should revert when amount is 0", async function () {
			await expect(
				vault1.connect(account1).deposit(0)
			).to.be.revertedWith("invalid amount");
		});

		it("should revert when not approved", async function () {
			await expect(
				vault1.connect(account1).deposit(100)
			).to.be.revertedWith("");
		});

		it("should emit deposit event when approved", async function () {
			let amount = 100
			await token.connect(account1).approve(vault1.address, amount)
			await expect(vault1.connect(account1).deposit(amount))
				.to.emit(vault1, "Deposit")
				.withArgs(account1.address, amount);
		});

		it("should emit withdraw event when valid", async function () {
			let amount = 100
			await token.connect(account1).approve(vault1.address, amount*2)
			await expect(vault1.connect(account1).deposit(amount*2));

			await expect(vault1.connect(account1).withdraw(amount))
				.to.emit(vault1, "Withdraw")
				.withArgs(account1.address, amount);

			
		});

		// it("should revert when invalid animal is provided", async function () {
		// 	await expect(
		// 		petPark.connect(owner).add(AnimalType.None, 5)
		// 	).to.be.revertedWith("Invalid animal");
		// });

		// it("should emit added event when pet is added", async function () {
		// 	await expect(petPark.connect(owner).add(AnimalType.Fish, 5))
		// 		.to.emit(petPark, "Added")
		// 		.withArgs(AnimalType.Fish, 5);
		// });
	});
});
