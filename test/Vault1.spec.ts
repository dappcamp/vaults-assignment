import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { Contract, ContractFactory } from "ethers";
import { ethers } from "hardhat";

describe("Vault1", () => {
  let Vault1: ContractFactory;
  let vault1: Contract;
  let accounts: SignerWithAddress[];
  let owner: SignerWithAddress;
  let account1: SignerWithAddress;

  beforeEach(async () => {
    Vault1 = await ethers.getContractFactory("Vault1");

    accounts = await ethers.getSigners();
    [owner] = accounts;
    [account1] = accounts;

    vault1 = await Vault1.deploy();

    await vault1.deployed();
  });

  // deposit: invalid tokens, invalid amounts, token overflow
  // 1 account, many tokens, many amounts
  //

  describe("deposit", () => {
    it("Should revert when an invalid deposit amount is provided", async () => {
      await expect(vault1.connect(account1).deposit(0)).to.be.revertedWith(
        "Invalid deposit amount, must be greater than 0"
      );

      // @todo (lucas): check how to test that _amount is an unsigned integer
      // await expect(vault1.connect(account1).deposit(-1)).to.throw();
    });

    it("Should revert when an invalid deposit amount is provided", async () => {
      //
    });
  });
});
