const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Vault 1", () => {

  // I can create variables here ex:
  let owner;
  let account1;
  // let nVault2;

  let w5eth = BigInt(5 * 10 ** 18);
  // let w3eth = BigInt(3 * 10 ** 18);
  let w10eth = BigInt(6 * 10 ** 18);

  // const token = new ethers.Contract(address, abi, signer);

	beforeEach("deploy contracts", async () => {  
		const accounts = await ethers.getSigners();

		owner = accounts[0];
		account1 = accounts[1];

    const Vault2 = await ethers.getContractFactory("Vault2");
    vault2 = await Vault2.deploy();

    await vault2.deployed();
  
		const Vault1 = await ethers.getContractFactory("Vault1");
		vault1 = await Vault1.deploy(account1.address, vault2.address);

		await vault1.deployed();
	});

	describe("Deposit", function () {
		it("should revert when amount equals zero", async function () {
			await expect(
				vault1.connect(owner).Deposit(0)
			).to.be.revertedWith("Zero tokens");
		});

		it("should revert when user do not have VAULT token", async function () {
			await expect(
				vault1.connect(owner).Deposit(w5eth)
			).to.be.reverted;
		});

		it("should revert if contract is now allowed to transfer amount ", async function () {
      // @notice account wrapped ETH and earned VAULT he can deposit 
      await vault2.connect(owner).wrapTokens(w5eth, {value: w5eth});

      // await vault2.approve
			await expect(
        vault1.connect(owner).Deposit(w5eth)
        ).to.be.revertedWith("ERC20: transfer amount exceeds allowance");
		});

    it("should emit deposit event when valid information is passed", async function () {
      // @notice account wrapped ETH and earned VAULT he can deposit 
      await vault2.connect(owner).wrapTokens(w5eth, {value: w5eth});

      await vault2.connect(owner).approve(vault1.address, w5eth);

			await expect(
        vault1.connect(owner).Deposit(w5eth))
				.to.emit(vault1, "newDeposit")
				.withArgs(w5eth);
		});

    it("should decrease account balance on the token", async function () {
      // @notice account wrapped ETH and earned VAULT he can deposit 
      await vault2.connect(owner).wrapTokens(w5eth, {value: w5eth});

      await vault2.connect(owner).approve(vault1.address, w5eth);

      await expect(() => vault1.connect(owner).Deposit(w5eth))
        .to.changeTokenBalance(vault2, owner, -w5eth);
		});

    it("should increase Vault1 balance on the token", async function () {
      // @notice account wrapped ETH and earned VAULT he can deposit 
      await vault2.connect(owner).wrapTokens(w5eth, {value: w5eth});

      await vault2.connect(owner).approve(vault1.address, w5eth);

      await expect(() => vault1.connect(owner).Deposit(w5eth))
        .to.changeTokenBalance(vault2, vault1, w5eth);
		});
	});

  describe("Withdraw", function () {
		it("should revert when amount equals zero", async function () {
			await expect(
				vault1.connect(account1).Withdraw(0)
			).to.be.revertedWith("Zero tokens");
		});

    it("should revert when not permissioned address try to withdraw", async function () {
			await expect(
				vault1.connect(owner).Withdraw(w5eth)
			).to.be.revertedWith("Sender not allowed to withdraw");
		});

		it("should revert when amount > Vault's balance", async function () {
			await expect(
				vault1.connect(account1).Withdraw(w10eth)
			).to.be.revertedWith("ERC20: transfer amount exceeds balance");
		});    
    
    it("should emit transfer event when valid information is passed", async function () {
      // @notice account wrapped ETH and earned VAULT he can deposit 
      await vault2.connect(owner).wrapTokens(w5eth, {value: w5eth});

      await vault2.connect(owner).approve(vault1.address, w5eth);

			await vault1.connect(owner).Deposit(w5eth);
				
      await expect(
        vault1.connect(account1).Withdraw(w5eth))
        .to.emit(vault1, "newTransfer")
        .withArgs(w5eth);
		});

    it("should increase account balance on token", async function () {
      // @notice account wrapped ETH and earned VAULT he can deposit 
      await vault2.connect(owner).wrapTokens(w5eth, {value: w5eth});

      await vault2.connect(owner).approve(vault1.address, w5eth);

			await vault1.connect(owner).Deposit(w5eth);
				
      await expect(() => 
        vault1.connect(account1).Withdraw(w5eth))
        .to.changeTokenBalance(vault2, account1, w5eth);
		});

    it("should decrease Vault1 balance on token", async function () {
      // @notice account wrapped ETH and earned VAULT he can deposit 
      await vault2.connect(owner).wrapTokens(w5eth, {value: w5eth});

      await vault2.connect(owner).approve(vault1.address, w5eth);

			await vault1.connect(owner).Deposit(w5eth);
				
      await expect(() => 
        vault1.connect(account1).Withdraw(w5eth))
        .to.changeTokenBalance(vault2, vault1, -w5eth);
		});

	});

});
