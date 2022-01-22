const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Vault 2", () => {
	let signers;
	let deployer;
	let alice;
	let vault2Contract;

	beforeEach(async () => {
		Vault2 = await ethers.getContractFactory("Vault2");
		vault2Contract = await Vault2.deploy();
		await vault2Contract.deployed();

		signers = await ethers.getSigners();
		deployer = signers[0];
		alice = signers[1];
	});

	it("mint(): should mint equal number of VAULT tokens", async function () {
		const aliceOriginalEtherBalance = await vault2Contract.provider.getBalance(alice.address);

        await vault2Contract.connect(alice).mint({
            value: ethers.utils.parseEther("2.0")
        });

        const aliceLatestEtherBalance = await vault2Contract.provider.getBalance(alice.address);

        expect(aliceLatestEtherBalance.lt(aliceOriginalEtherBalance)).equal(true);

        const wrappedEthBalanceInVault = await vault2Contract.connect(alice).users(alice.address);
        expect(wrappedEthBalanceInVault).equal(2);
	});

    it("burn(): should burn the vault tokens user has and return equal amount of ether", async function () {
		let beforeMintEthBalance = await vault2Contract.provider.getBalance(alice.address);

        await vault2Contract.connect(alice).mint({
            value: ethers.utils.parseEther("2.0")
        });

        let afterMintEthBalance = await vault2Contract.provider.getBalance(alice.address);

        await vault2Contract.connect(alice).burn();

        let afterBurnEthBalance = await vault2Contract.provider.getBalance(alice.address);

        expect(afterBurnEthBalance.gt(afterMintEthBalance)).equal(true);

        const wrappedEthBalanceInVault = await vault2Contract.connect(alice).users(alice.address);
        expect(wrappedEthBalanceInVault).equal(0);
	});

    it("burn(): should revert if no tokens exist", async function () {
        await expect(
			vault2Contract.connect(alice).burn()
		).to.be.revertedWith("User does not have any tokens to burn");
	});

});
