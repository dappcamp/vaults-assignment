const { expect } = require("chai");
const { ethers } = require("hardhat");
//const { smoddit, smockit } = require("@eth-optimism/smock");

describe("Vault 1", () => {
	beforeEach(async () => {
		//[owner, addr1] = await ethers.getSigners();

		/*const MockERC20Factory = await smoddit("ERC20");
		const mockERC20Contract = await MockERC20Factory.deploy();
		console.log("Balance");
		console.log(await vault2.balanceOf(acct1.address));
		console.log("Balanceasdasdasad");
		debugger;
		mockERC20Contract.smodify.put({
			_balances: {
				[addr1]: 1000,
			}
		});*/

		testERC20 = await (await ethers.getContractFactory("Vault1"));
		await testERC20.deployed();

		Vault1 = await ethers.getContractFactory("Vault1");
		vault1 = await Vault1.deploy(mockERC20Contract.address);
		await vault1.deployed();
	});

	/*describe("deposit", function () {
		it("Requested VAULT should be equal to passed in Ether", async function () {
		});
	});*/
});
