const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Vault 1", () => {
  let owner;
  let user;
  let testToken;
  let vault1;

	beforeEach(async () => {
    [owner, user] = await ethers.getSigners();

    const DummyToken = await ethers.getContractFactory("DummyToken");
    testToken = await DummyToken.deploy(100);
    await testToken.deployed();

    await testToken.connect(owner).transfer(user.address, 10);

    expect(
      await testToken.balanceOf(owner.address)
    ).to.equal(90);
    expect(
      await testToken.balanceOf(user.address)
    ).to.equal(10);

		const Vault1 = await ethers.getContractFactory("Vault1");
		vault1 = await Vault1.deploy("Vault1", "VT1", testToken.address);
		await vault1.deployed();

    expect(
      await vault1.balanceOf(user.address)
    ).to.equal(0);
	});

  const deposit = async function (amount) {
    await testToken.connect(user).approve(vault1.address, amount);
    await vault1.connect(user).deposit(amount);

    expect(
      await vault1.balanceOf(user.address)
    ).to.equal(amount);
    expect(
      await testToken.balanceOf(user.address)
    ).to.equal(0);
  };

  describe("deposit", function () {
    it("should increase balance after deposit", async function () {
      await deposit(10);
    });

    it("should emit Deposited event", async function () {
      await testToken.connect(user).approve(vault1.address, 10);
      await expect(
        vault1.connect(user).deposit(10)
			).to.emit(vault1, "Deposited")
      .withArgs(user.address, 10);
    });

    it("should revert when depositing 0", async function () {
      await expect(
        deposit(0)
      ).to.be.revertedWith(
        "Amount should be bigger than 0"
      );
    });
  });

  describe("withraw", function () {
    it("should decrease balance after withrawal", async function () {
      await deposit(10);
  
      await vault1.connect(user).withraw(6);

      expect(
        await vault1.balanceOf(user.address)
      ).to.equal(4);
      expect(
        await testToken.balanceOf(user.address)
      ).to.equal(6);
    });

    it("should emit Withdrawn event", async function () {
      await deposit(10);

      await expect(
        vault1.connect(user).withraw(10)
			).to.emit(vault1, "Withdrawn")
      .withArgs(user.address, 10);
    });

    it("should revert when withdrawing 0", async function () {
      await deposit(10);

      await expect(
        vault1.connect(user).withraw(0)
      ).to.be.revertedWith(
        "Amount should be bigger than 0"
      );
    });

    it("should revert when withdrawing more than balance", async function () {
      await deposit(10);

      await expect(
        vault1.connect(user).withraw(100)
      ).to.be.revertedWith(
        "Balance is lower than requested amount"
      );
    });
  });
});