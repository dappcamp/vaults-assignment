const {expect} = require("chai");
const {ethers, waffle} = require("hardhat");
const provider = waffle.provider;

describe("Vault 2", () => {
    beforeEach(async () => {
        [owner] = await ethers.getSigners();

        Vault2 = await ethers.getContractFactory("Vault2");
        vault2 = await Vault2.deploy();
        await vault2.deployed();
    });

    it("Mint & burn should work", async function () {
        await vault2.connect(owner).mint({value: ethers.utils.parseEther("10")});

        expect(await provider.getBalance(vault2.address)).to.eq(ethers.utils.parseEther("10"));
        expect(await vault2.balance(owner.address)).to.eq(ethers.utils.parseEther("10"));
        expect(await provider.getBalance(owner.address)).to.within(
            ethers.utils.parseEther("9989"),
            ethers.utils.parseEther("9990")
        );

        await vault2.connect(owner).burn(ethers.utils.parseEther("3"));

        expect(await provider.getBalance(vault2.address)).to.eq(ethers.utils.parseEther("7"));
        expect(await vault2.balance(owner.address)).to.eq(ethers.utils.parseEther("7"));
        expect(await provider.getBalance(owner.address)).to.within(
            ethers.utils.parseEther("9992"),
            ethers.utils.parseEther("9993")
        );

        await expect(vault2.connect(owner).burn(ethers.utils.parseEther("10"))).to.be.revertedWith(
            "Not enough balance"
        );
    })
});
