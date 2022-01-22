const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Vault 1", () => {

	let Marci_token;
	let owner;
	let account1;
	let account2;

	beforeEach(async () => {
		const Vault1 = await ethers.getContractFactory("Vault1");
		//const MyContract = await ethers.getContractFactory("ERC20");
		const accounts = await ethers.getSigners();

		owner = accounts[0];
		account1 = accounts[1];
		account2 = accounts[2];
		//[owner] = await ethers.getSigners();

		// connect to the ERC20 contract to approve / transfer in advance
		//const MyContract = await ethers.getContractFactory("ERC20");
		//Marci_token = await MyContract.deploy("Marci_token", "MARCI");
		//await Marci_token.deployed();
		//token_addr = MyContract.address;
		//console.log(token_addr);

		token_addr = '0x5fbdb2315678afecb367f032d93f642f64180aa3';
		vault = await Vault1.deploy(token_addr);
		await vault.deployed();
		vault_addr = Vault1.address;


		// Marci_token = await MyContract.attach(
		// 	"0x5fbdb2315678afecb367f032d93f642f64180aa3"
		// );
	});

	describe("Deployment", function () {
		it("should be deployed to provided token address", async function () {
			expect((await vault.token()).toString().toUpperCase()).to.equal(token_addr.toUpperCase());
		})
	});

	describe("Transfer to Vault", async function () {
		// approve user transfer in advance
		var amount = 10000;
		//await expect(Marci_token.connect(account2).approve(vault_addr, amount))
		//	.to.emit(Marci_token, "Approval")
		//	.withArgs(account2, vault_addr, amount);
		it("should transfer from user", async function () {

		})
	});

});
