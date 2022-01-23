const {expect} = require("chai");
const {ethers, waffle} = require("hardhat");
const provider = waffle.provider;

describe("Vault 1", () => {
    beforeEach(async () => {
        [owner] = await ethers.getSigners();

        DappCampToken = await ethers.getContractFactory("DappCampToken", owner);
        dcToken = await DappCampToken.deploy(1e9);
        await dcToken.deployed();

        Vault1 = await ethers.getContractFactory("Vault1");
        vault1 = await Vault1.deploy();
        await vault1.deployed();
    });

    it("Deposit & withdrawal should work", async function () {
        await dcToken.connect(owner).approve(vault1.address, 2e6);
        await vault1.connect(owner).deposit(2e6, dcToken.address);

        // check the new distribution of tokens
        expect(await vault1.balance(owner.address, dcToken.address)).to.eq(2e6);
        expect(await dcToken.balanceOf(vault1.address)).to.eq(2e6);
        expect(await dcToken.balanceOf(owner.address)).to.eq(998e6);

        await (await vault1.connect(owner).withdraw(1e6, dcToken.address)).wait();

        // check the new distribution of tokens
        expect(await vault1.balance(owner.address, dcToken.address)).to.eq(1e6);
        expect(await dcToken.balanceOf(vault1.address)).to.eq(1e6);
        expect(await dcToken.balanceOf(owner.address)).to.eq(999e6);

        await expect(vault1.connect(owner).withdraw(2e6, dcToken.address)).to.be.revertedWith(
            "Not enough balance"
        );
    });
});
