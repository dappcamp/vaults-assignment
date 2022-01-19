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

  describe("deposit", () => {
    it("should revert when not called by an owner", async () => {
      await expect(vault1.connect(account1).deposit(1)).to.be.revertedWith(
        "Not an owner"
      );
    });
  });
});
