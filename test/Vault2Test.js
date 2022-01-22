const { expect } = require("chai");
const { ethers } = require("hardhat");
const { BigNumber } = require("ethers");

describe("Vault 2", () => {
  
  const ETH = ethers.provider;
  const oneETH = BigNumber.from(10).pow(18).mul(10); // 10 ETH

	beforeEach(async () => {
		Vault2 = await ethers.getContractFactory("Vault2");
		[owner, user] = await ethers.getSigners();

		vault2 = await Vault2.deploy();

		await vault2.deployed();
	});

  const niceMint = async function (amount) {
    const beforeETH = await ETH.getBalance(user.address);

    await vault2.connect(user).approve(vault2.address, amount);
    await vault2.connect(user).mint(amount, { value: amount });

    expect(
      await vault2.balanceOf(user.address)
    ).to.equal(amount);
    expect(
      await ETH.getBalance(user.address)
    ).to.be.at.most(beforeETH.sub(amount));
  }

  describe("mint", function () {
    it("should be able to exchange balance by minting", async function () {
      await niceMint(oneETH);
    });

    it("should emit Minted event", async function() {
      await vault2.connect(user).approve(vault2.address, oneETH);
      await expect(
        await vault2.connect(user).mint(oneETH, { value: oneETH })
			).to.emit(vault2, "Minted")
      .withArgs(user.address, oneETH);
    });

    it("should revert when minting 0", async function () {
      await expect(
        niceMint(0)
      ).to.be.revertedWith(
        "Amount should be bigger than 0"
      );
    });
  });

  describe("burn", function () {
    it("should be able to exchange balance back by burning", async function () {
      const beforeETH = await ETH.getBalance(user.address);
      const depositAmount = oneETH.mul(10);
      const burnAmount = oneETH.mul(7);

      await niceMint(depositAmount);

      await vault2.connect(user).burn(burnAmount);

      expect(
        await vault2.balanceOf(user.address)
      ).to.equal(depositAmount.sub(burnAmount));
      expect(
        await ETH.getBalance(user.address)
      ).to.be.at.most(beforeETH.sub(depositAmount).add(burnAmount));
    });

    it("should emit Burn event", async function () {
      await niceMint(oneETH);

      await expect(
        vault2.connect(user).burn(oneETH)
			).to.emit(vault2, "Burn")
      .withArgs(user.address, oneETH);
    });

    it("should revert when burning 0", async function () {
      await niceMint(oneETH);

      await expect(
        vault2.connect(user).burn(0)
      ).to.be.revertedWith(
        "Amount should be bigger than 0"
      );
    });

    it("should revert when burning more than balance", async function () {
      await niceMint(oneETH);

      await expect(
        vault2.connect(user).burn(oneETH.mul(10))
      ).to.be.revertedWith(
        "Balance is lower than requested amount"
      );
    });
  });
});