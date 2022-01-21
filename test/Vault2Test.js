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

            let caller_balance = await caller.getBalance();

            // user deposits and burns this amount
            const deposited_eth = 1;
            expect(caller_balance.gt(deposited_eth)).to.equal(true);
            // const deposited_wei = ethers.utils.parseEther(deposited_eth.toString());
            const user_burns_eth = 1;
            const post_burn_vault_user = 0;
            const post_burn_vault_treasury = 0;

            // call: mint
            await expect(m_vault2_contract.connect(caller).mint({value: deposited_eth}))
                .to.emit(m_vault2_contract, "Mint")
                .withArgs(caller.address, deposited_eth);


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
            await expect(m_vault2_contract.connect(caller)
                .burn(user_burns_eth))
                .to.emit(m_vault2_contract, "Burn")
                .withArgs(caller.address, user_burns_eth);


            // verify output - user burns only VAULT
            {
                const realized = await m_vault2_contract.getBalanceVaultForUser(caller_address);
                expect(ethers.BigNumber.isBigNumber(realized)).to.equal(true);
                const expected = post_burn_vault_user;
                expect(expected.toString()).to.equal(realized.toString());
            }

            // verify output - reduction in eth treasury
            {
                const realized = await m_vault2_contract.getBalanceEth();
                expect(ethers.BigNumber.isBigNumber(realized)).to.equal(true);
                const expected = post_burn_vault_treasury;
                expect(expected.toString()).to.equal(realized.toString());
            }
        });

        it("one client(s) mint many token(s) -> burn a portion", async function () {

            const caller = m_client1;
            const caller_address = m_client1.address;

            let caller_balance = await caller.getBalance();

            // deposit many ETH
            const deposited_eth = 10;
            // const deposited_wei = ethers.utils.parseEther(deposited_eth.toString());
            expect(caller_balance.gt(deposited_eth)).to.equal(true);

            // caller will subsequently burn a portion of received VAULT TOKENS
            const user_burns_eth = 5;
            const post_burn_vault_user = deposited_eth - user_burns_eth;
            const post_burn_vault_treasury = deposited_eth - user_burns_eth;

            // call: mint
            await expect(m_vault2_contract.connect(caller).mint({value: deposited_eth}))
                .to.emit(m_vault2_contract, "Mint")
                .withArgs(caller.address, deposited_eth);


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
            await expect(m_vault2_contract.connect(caller)
                .burn(user_burns_eth))
                .to.emit(m_vault2_contract, "Burn")
                .withArgs(caller.address, user_burns_eth);


            // verify output - user burns VAULT TOKEN
            {
                const realized = await m_vault2_contract.getBalanceVaultForUser(caller_address);
                expect(ethers.BigNumber.isBigNumber(realized)).to.equal(true);
                const expected = post_burn_vault_user;
                expect(expected.toString()).to.equal(realized.toString());
            }

            // verify output - reduction in eth treasury
            {
                const realized = await m_vault2_contract.getBalanceEth();
                expect(ethers.BigNumber.isBigNumber(realized)).to.equal(true);
                const expected = post_burn_vault_treasury;
                expect(expected.toString()).to.equal(realized.toString());
            }

        });

        it("many client(s) mint many token(s)- > burn a portion", async function () {

            const arry_callers = [m_client1, m_client2];
            const arry_deposited_eth = [11, 12];

            // check generated ETH balance relative to deposited ETH
            let arry_caller_balances = []
            for (let i = 0; i < arry_callers.length; i++) {
                arry_caller_balances[i] = await arry_callers[i].getBalance();
                expect(arry_caller_balances[i].gt(arry_deposited_eth[i])).to.equal(true);
            }

            // caller will subsequently burn a portion of received VAULT TOKENS
            const arry_user_burns_eth = [6, 7]


            // call: mint (for all users)
            let expected_vault_eth_balance = 0;
            for (let caller_index = 0; caller_index < arry_callers.length; caller_index++) {

                // call
                await expect(m_vault2_contract.connect(arry_callers[caller_index]).mint(
                    {value: arry_deposited_eth[caller_index]}))
                    .to.emit(m_vault2_contract, "Mint")
                    .withArgs(arry_callers[caller_index].address, arry_deposited_eth[caller_index]);


                expected_vault_eth_balance += arry_deposited_eth[caller_index];
            }

            // region: verify output (for all users)
            
            for (let caller_index = 0; caller_index < arry_callers.length; caller_index++) {

                const caller = arry_callers[caller_index];

                // verify output - user gets VAULT token(s)
                const deposited_eth = arry_deposited_eth[caller_index];
                {
                    const realized = await m_vault2_contract.getBalanceVaultForUser(caller.address);
                    const expected = deposited_eth;
                    expect(expected.toString()).to.equal(realized.toString());
                }
            }
            // verify output - vault holds user's ETH
            {
                const realized = await m_vault2_contract.getBalanceEth();
                const expected = expected_vault_eth_balance;
                expect(expected.toString()).to.equal(realized.toString());
            }

            // endregion

            // call: burn (for all users)
            let post_burn_vault_treasury = 0;
            for (let caller_index = 0; caller_index < arry_callers.length; caller_index++) {

                await expect(m_vault2_contract
                    .connect(arry_callers[caller_index])
                    .burn(arry_user_burns_eth[caller_index]))
                    .to.emit(m_vault2_contract, "Burn")
                    .withArgs(arry_callers[caller_index].address, arry_user_burns_eth[caller_index]);

                post_burn_vault_treasury += (arry_deposited_eth[caller_index] - arry_user_burns_eth[caller_index]);
            }

            // region: verify output - for all users

            for (let caller_index = 0; caller_index < arry_callers.length; caller_index++) {

                const caller = arry_callers[caller_index];
                const post_burn_vault_user = arry_deposited_eth[caller_index] - arry_user_burns_eth[caller_index];

                // verify output - user burns VAULT TOKEN
                {
                    const realized = await m_vault2_contract.getBalanceVaultForUser(caller.address);
                    expect(ethers.BigNumber.isBigNumber(realized)).to.equal(true);
                    const expected = post_burn_vault_user;
                    expect(expected.toString()).to.equal(realized.toString());
                }
            }

            // verify output - reduction in eth treasury
            {
                const realized = await m_vault2_contract.getBalanceEth();
                expect(ethers.BigNumber.isBigNumber(realized)).to.equal(true);
                const expected = post_burn_vault_treasury;
                expect(expected.toString()).to.equal(realized.toString());
            }

            // endregion

        });
    });
});
