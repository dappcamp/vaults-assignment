import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { ContractFactory } from "ethers";
import { ethers } from "hardhat";
import { ERC20Mock as ERC20MockType } from "../typechain-types/ERC20Mock";
import { Vault1 as Vault1Type } from "../typechain-types/Vault1";

describe("Vault1", () => {
  let Vault1: ContractFactory;
  let Token: ContractFactory;
  let vault1: Vault1Type;
  let token: ERC20MockType;
  let accounts: SignerWithAddress[];
  let account1: SignerWithAddress;

  const DEFAULT_VALUE = 5000;

  const mint = async ({ address }: { address?: string } = {}) => {
    await token.mint(address || account1.address, DEFAULT_VALUE);
  };

  const approve = async () => {
    await token.approveInternal(account1.address, vault1.address, DEFAULT_VALUE);
  };

  const mintAndApprove = async () => {
    await mint();
    await approve();
  };

  const deposit = async () => {
    await vault1.connect(account1).deposit(DEFAULT_VALUE);
  };

  beforeEach(async () => {
    Vault1 = await ethers.getContractFactory("Vault1");
    Token = await ethers.getContractFactory("ERC20Mock");

    accounts = await ethers.getSigners();
    [owner] = accounts;
    [account1] = accounts;

    token = (await Token.deploy("Random", "RAND", ethers.Wallet.createRandom().address, 0)) as ERC20MockType;
    vault1 = (await Vault1.deploy(token.address)) as Vault1Type;

    await vault1.deployed();
  });

  /**
   * @description note that "not having enough balance to deposit" is already tested by ERC20
   */
  describe("deposit", () => {
    it("Should revert when an invalid deposit amount is provided", async () => {
      await expect(vault1.connect(account1).deposit(0)).to.be.revertedWith(
        "Invalid deposit amount, must be greater than 0"
      );
    });

    it("Should subtract _amount from sender's balance in the token's contract", async () => {
      const initialBalance = await token.balanceOf(account1.address);

      expect(initialBalance).to.equal(0);

      await mintAndApprove();
      const intermediateBalance = await token.balanceOf(account1.address);

      expect(intermediateBalance).to.equal(DEFAULT_VALUE);

      await deposit();
      const finalBalance = await token.balanceOf(account1.address);

      expect(finalBalance).to.equal(0);
    });

    it("Should add _amount to our address in the token's contract", async () => {
      await mintAndApprove();

      await deposit();
      const contractBalance = await token.balanceOf(vault1.address);

      expect(contractBalance).to.equal(DEFAULT_VALUE);
    });

    it("Should add _amount to the sender's balance in our contract", async () => {
      await mintAndApprove();

      await deposit();
      const account1Balance = await vault1.balances(account1.address);

      expect(account1Balance).to.equal(DEFAULT_VALUE);
    });

    it("Should not add to the sender's balance if the ERC20 transfer wasn't succesful", async () => {
      await mint();

      await vault1
        .connect(account1)
        .deposit(10000)
        .catch(() => {});
      const account1Balance = await vault1.balances(account1.address);

      expect(account1Balance).to.equal(0);
    });

    it("Should emit a `Deposited` event", async () => {
      await mintAndApprove();

      await expect(vault1.connect(account1).deposit(1000)).to.emit(vault1, "Deposited").withArgs(1000);
    });
  });

  describe("withdraw", () => {
    it("Should revert when an invalid withdraw amount is provided", async () => {
      await expect(vault1.connect(account1).withdraw(0)).to.be.revertedWith(
        "Invalid withdraw amount, must be greater than 0"
      );
    });

    it("Should revert if the sender doesn't have enough balance", async () => {
      await expect(vault1.connect(account1).withdraw(1000)).to.be.revertedWith("Insufficient balance");
    });

    it("Should add _amount to sender's balance in the token's contract", async () => {
      await mintAndApprove();
      const initialBalance = await token.balanceOf(account1.address);

      expect(initialBalance).to.equal(DEFAULT_VALUE);

      await deposit();
      const intermediateBalance = await token.balanceOf(account1.address);

      expect(intermediateBalance).to.equal(0);

      await vault1.connect(account1).withdraw(1000);
      const finalBalance = await token.balanceOf(account1.address);

      expect(finalBalance).to.equal(1000);
    });

    it("Should subtract _amount from our address in the token's contract", async () => {
      const initialBalance = await token.balanceOf(vault1.address);

      expect(initialBalance).to.equal(0);

      await mintAndApprove();
      await deposit();
      const intermediateBalance = await token.balanceOf(vault1.address);

      expect(intermediateBalance).to.equal(DEFAULT_VALUE);

      await vault1.connect(account1).withdraw(1000);
      const finalBalance = await token.balanceOf(vault1.address);

      expect(finalBalance).to.equal(DEFAULT_VALUE - 1000);
    });

    it("Should subtract _amount from the sender's balance in our contract", async () => {
      await mintAndApprove();
      const initialBalance = await vault1.balances(account1.address);

      expect(initialBalance).to.equal(0);

      await deposit();
      const intermediateBalance = await vault1.balances(account1.address);

      expect(intermediateBalance).to.equal(DEFAULT_VALUE);

      await vault1.connect(account1).withdraw(1000);
      const finalBalance = await vault1.balances(account1.address);

      expect(finalBalance).to.equal(DEFAULT_VALUE - 1000);
    });

    it("Should not subtract from the sender's balance if the ERC20 transfer wasn't succesful", async () => {
      await mintAndApprove();
      const initialBalance = await vault1.balances(account1.address);

      expect(initialBalance).to.equal(0);

      await deposit();
      const intermediateBalance = await vault1.balances(account1.address);

      expect(intermediateBalance).to.equal(DEFAULT_VALUE);

      await vault1
        .connect(account1)
        .withdraw(10000)
        .catch(() => {});
      const finalBalance = await vault1.balances(account1.address);

      expect(finalBalance).to.equal(DEFAULT_VALUE);
    });

    it("Should emit a `Withdrawn` event", async () => {
      await mintAndApprove();
      await deposit();

      await expect(vault1.connect(account1).withdraw(1000)).to.emit(vault1, "Withdrawn").withArgs(1000);
    });
  });
});
