import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { Contract, ContractFactory } from "ethers";
import { ethers } from "hardhat";

describe("Vault2", () => {
  let Vault2: ContractFactory;
  let vault2: Contract;
  let accounts: SignerWithAddress[];
  let owner: SignerWithAddress;
  let account1: SignerWithAddress;

  beforeEach(async () => {
    Vault2 = await ethers.getContractFactory("Vault2");
    [owner] = await ethers.getSigners();

    vault2 = await Vault2.deploy();

    await vault2.deployed();
  });
});
