const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Vault 1", () => {
  let testToken, vault1;
  let owner, account1;

  beforeEach(async () => {
    [owner, account1] = await ethers.getSigners();

    const TestToken = await ethers.getContractFactory("TestToken");
    const totalSupply = (10 ** 18).toString();
    testToken = await TestToken.deploy(ethers.utils.parseEther(totalSupply));

    const Vault1 = await ethers.getContractFactory("Vault1");
    vault1 = await Vault1.deploy(testToken.address);
    await vault1.deployed();
  });

  describe("Test Token", function () {
    it("test token has been deployed", async function () {
      const ownerBalance = await testToken.balanceOf(owner.address);
      expect(await testToken.totalSupply()).to.equal(ownerBalance);
    });
  });

  describe("Vault1 basic functionality", function () {
    it("tokens can be deposited into vault", async function () {
      await testToken.connect(owner).approve(vault1.address, 1000);
      await vault1.connect(owner).deposit(1000);
      expect(await vault1.connect(owner).balance()).to.equal(1000);
    });

    it("tokens can be withdrawn from vault", async function () {
      await testToken.transfer(account1.address, 2000);
      await testToken.connect(account1).approve(vault1.address, 1500);
      await vault1.connect(account1).deposit(1500);
      expect(await vault1.connect(account1).balance()).to.equal(1500);

      await vault1.connect(account1).withdraw(1200);
      expect(await vault1.connect(account1).balance()).to.equal(300);

      await vault1.connect(account1).withdraw(250);
      expect(await vault1.connect(account1).balance()).to.equal(50);
    });

    it("sender can't withdraw more tokens than they deposited", async function () {
      await testToken.connect(owner).approve(vault1.address, 1000);
      await vault1.connect(owner).deposit(1000);
      expect(await vault1.connect(owner).balance()).to.equal(1000);

      await expect(vault1.connect(owner).withdraw(1001)).to.be.revertedWith(
        "Insufficient funds"
      );
      expect(await vault1.connect(owner).balance()).to.equal(1000);
    });

    it("sender balance doesn't increase when deposit fails", async function () {
      await expect(vault1.connect(owner).deposit(1)).to.be.revertedWith(
        "ERC20: transfer amount exceeds allowance"
      );
      expect(await vault1.connect(owner).balance()).to.equal(0);
    });
  });
});
