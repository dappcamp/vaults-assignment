const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Vault 2", () => {

  // I can create variables here ex:
  let owner;
  let account1;

  let w5eth = BigInt(5 * 10 ** 18);
  let w3eth = BigInt(3 * 10 ** 18);
  let w6eth = BigInt(6 * 10 ** 18);
  
	beforeEach("deploy contract", async () => {  
		const accounts = await ethers.getSigners();

		owner = accounts[0];
		account1 = accounts[1];

		const Vault2 = await ethers.getContractFactory("Vault2");
		vault2 = await Vault2.deploy();

		await vault2.deployed();
	});

	describe("wrapTokens", function () {
		it("should revert when amount equals zero", async function () {
			await expect(
				vault2.connect(owner).wrapTokens(0)
			).to.be.revertedWith("Zero Ether");
		});

		it("should revert when value <> amount", async function () {
      await expect(
				vault2.connect(owner).wrapTokens(w5eth, {value: 0})
			).to.be.revertedWith("Invalid amount");
		});

		it("should increase Vault ETH Balance after wrapping", async function () {  
      await expect(() => vault2.connect(owner).wrapTokens(w5eth, {value: w5eth}))
        .to.changeEtherBalance(vault2, w5eth);
    });

    it("should decrease account ETH Balance after wrapping", async function () {  
      await expect(() => vault2.connect(owner).wrapTokens(w5eth, {value: w5eth}))
        .to.changeEtherBalance(owner, -w5eth);
    });

    it("should emit event if successful wrapping", async function () {  
      await expect(vault2.connect(owner).wrapTokens(w5eth, {value: w5eth}))
        .to.emit(vault2, "newVaults")
        .withArgs(w5eth);
    });

    it("should increase total supply after wrapping", async function () {  
      pSupply = await vault2.connect(owner).totalSupply();
      await vault2.connect(owner).wrapTokens(w5eth, {value: w5eth})
      expect(await vault2.connect(owner).totalSupply()).to.be.equal(pSupply + w5eth)
    });
    
	});

  describe("unWrapTokens", function () {
		it("should revert when amount > Supply", async function () {
      await vault2.connect(owner).wrapTokens(w5eth, {value: w5eth});

			await expect(
				vault2.connect(owner).unWrapTokens(w6eth)
			).to.be.revertedWith("Should ask for less Ether");
		});

    it("should revert when amount > user's balance", async function () {
      await vault2.connect(owner).wrapTokens(w5eth, {value: w5eth});
      await vault2.connect(account1).wrapTokens(w3eth, {value: w3eth});

      await expect(
				vault2.connect(owner).unWrapTokens(w6eth)
			).to.be.revertedWith("ERC20: burn amount exceeds balance");
		});

    it("should decrease Vault ETH balance after burn", async function () {
      /* @dev expect for changeEtherBalance gets one of the following parameters:
      transaction call : () => Promise<TransactionResponse>
      transaction response : TransactionResponse
      */
      await vault2.connect(owner).wrapTokens(w5eth, {value: w5eth});
      
      // @dev thorw this error with the tx only:
      //  TypeError: transactionCall is not a function
      await expect(() => vault2.connect(owner).unWrapTokens(w5eth))
        .to.changeEtherBalance(vault2, -w5eth);        
    });

    it("should increase account ETH balance after burn", async function () {
      /* @dev expect for changeEtherBalance gets one of the following parameters:
      transaction call : () => Promise<TransactionResponse>
      transaction response : TransactionResponse
      */
      await vault2.connect(owner).wrapTokens(w5eth, {value: w5eth});
      
      // @dev thorw this error with the tx only:
      //  TypeError: transactionCall is not a function
      await expect(() => vault2.connect(owner).unWrapTokens(w5eth))
        .to.changeEtherBalance(owner, w5eth);        
    });

    it("should emit event if successful unWrapping", async function () {
      await vault2.connect(owner).wrapTokens(w5eth, {value: w5eth});
      
      await expect(vault2.connect(owner).unWrapTokens(w5eth))
        .to.emit(vault2, "GiveBackEth").withArgs(w5eth);

    });
    
	});

});
