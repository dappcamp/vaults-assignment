const {expect} = require("chai");
const {ethers} = require("hardhat");
const {smock} = require('@defi-wonderland/smock');

describe("Vault 2", () => {

    let m_vault2_owner;
    let m_vault2_contract;

    // init a couple of clients
    let m_client1;
    let m_client2;

    beforeEach(async () => {
        [m_vault2_owner, m_client1, m_client2] = await ethers.getSigners();

        // init contract
        const Vault2 = await ethers.getContractFactory("Vault2");
        m_vault2_contract = await Vault2.deploy();
        await m_vault2_contract.connect(m_vault2_owner.address).deployed();
    });

    describe("mint and burn", function () {

        it("one client(s) mint one token(s) -> burn all", async function () {

            const caller = m_client1;
            const caller_address = m_client1.address;

            // user deposits and burns this amount
            const deposited_eth = 1;
            const deposited_wei = ethers.utils.parseEther(deposited_eth.toString());
            const user_burns_eth = 1;
            const post_burn_vault_user = 0;
            const post_burn_vault_treasury = 0;

            // call: mint
            let tx = await m_vault2_contract.connect(caller).mint({value: deposited_eth});
            await tx.wait();

            // verify output - user gets VAULT token(s)
            {
                const realized = await m_vault2_contract.getBalanceVaultForUser(caller_address);
                expect(ethers.BigNumber.isBigNumber(realized)).to.equal(true);
                const expected = deposited_eth;
                expect(expected.toString()).to.equal(realized.toString());
            }

            // verify output - vault holds user's ETH
            {
                const realized = await m_vault2_contract.getBalanceEth();
                expect(ethers.BigNumber.isBigNumber(realized)).to.equal(true);
                const expected = deposited_eth;
                expect(expected.toString()).to.equal(realized.toString());
            }

            // call: burn
            tx = await m_vault2_contract.connect(caller).burn(user_burns_eth);
            await tx.wait();

            // verify-output - user burns only VAULT
            {
                const realized = await m_vault2_contract.getBalanceVaultForUser(caller_address);
                expect(ethers.BigNumber.isBigNumber(realized)).to.equal(true);
                const expected = post_burn_vault_user;
                expect(expected.toString()).to.equal(realized.toString());
            }

            // verify-output - reduction in eth treasury
            {
                const realized = await m_vault2_contract.getBalanceEth();
                expect(ethers.BigNumber.isBigNumber(realized)).to.equal(true);
                const expected = post_burn_vault_treasury;
                expect(expected.toString()).to.equal(realized.toString());
            }
        });

        // // TODO: resume whne ready
        // it("one client(s) mint many token(s) -> burn a portion", async function () {
        //     const caller = m_client1.address;
        //
        //     // deposit many ETH
        //     const deposited_eth = 10;
        //     const deposited_wei = ethers.utils.parseEther(deposited_eth.toString());
        //
        //     // caller will subsequently burn a portion of received VAULT TOKENS
        //     const user_burns_eth = 5;
        //     const user_burns_wei = ethers.utils.parseEther(user_burns_eth.toString());
        //
        //     const post_burn_vault_user = deposited_eth - user_burns_eth;
        //     const post_burn_vault_treasury = deposited_eth - user_burns_eth;
        //
        //     // call: mint
        //     let tx = await m_vault2_contract.connect(caller).mint({value: deposited_eth});
        //     await tx.wait();
        //
        //     // verify output - user gets VAULT token(s)
        //     {
        //         const realized = await m_vault2_contract.balanceOf(caller);
        //         const expected = deposited_eth;
        //         expect(expected.toString()).to.equal(realized.toString());
        //     }
        //
        //     // verify output - vault holds user's ETH
        //     {
        //         const realized = await m_vault2_contract.getBalanceEth();
        //         const expected = deposited_eth;
        //         expect(expected.toString()).to.equal(realized.toString());
        //
        //         // vault owner holds ETH in her wallet
        //         {
        //             const realized  = await m_vault2_owner.getBalance();
        //             const expected = deposited_eth;
        //             expect(expected.toString()).to.equal(realized.toString());
        //         }
        //     }
        //
        //     // call: burn
        //     tx = await m_vault2_contract.connect(caller).burn(user_burns_wei);
        //     await tx.wait();
        //
        //     // verify-output - user burns VAULT TOKEN
        //     {
        //         const realized = await m_vault2_contract.balanceOf(caller);
        //         const expected = post_burn_vault;
        //         expect(expected.toString()).to.equal(realized.toString());
        //     }
        //
        //     // verify-output - reduction in eth treasury
        //     {
        //         const realized = await m_vault2_contract.getBalanceEth();
        //         const expected = post_burn_vault_treasury;
        //         expect(expected.toString()).to.equal(realized.toString());
        //     }
        //
        // });
        //
        // it("many client(s) mint many token(s)", async function () {
        //
        //     const arry_callers = [m_client1.address, m_client2.address];
        //     const arry_deposited_eth = [11, 12];
        //
        //     // call: mint
        //     let tx = await m_vault2_contract.connect(caller).mint(deposited_eth);
        //     await tx.wait();
        //
        //     // verify output - user gets VAULT token(s)
        //     {
        //         const realized = await m_vault2_contract.balanceOf(caller);
        //         const expected = deposited_eth;
        //         expect(expected.toString()).to.equal(realized.toString());
        //     }
        //
        //     // verify output - vault holds user's ETH
        //     {
        //         const realized = await m_vault2_contract.getBalanceEth();
        //         const expected = deposited_eth;
        //         expect(expected.toString()).to.equal(realized.toString());
        //     }
        //
        // });
    });
});
