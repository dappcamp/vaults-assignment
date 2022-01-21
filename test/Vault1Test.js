const {expect} = require("chai");
const {ethers} = require("hardhat");
const { smock } = require('@defi-wonderland/smock');

// TODO: edge cases
describe("Vault 1", () => {

    let m_vault_owner;

    // TODO: remove when ready
    const m_token_count = 2;
    let m_vault_2;
    let m_token_2;

    let m_vault_1;
    let m_vaults = []

    // init fake tokens
    let m_token_1;
    let m_underlying_tokens = []

    // init a couple of users of vault contract
    let m_client1;
    let m_client2;
    let m_clients = []

    beforeEach(async () => {
        [m_vault_owner, m_client1, m_client2] = await ethers.getSigners();
        m_clients = [m_client1, m_client2];

        // init mock tokens - use erc20
        {
            const TestToken = await ethers.getContractFactory("TestToken");
            m_token_1 = await TestToken.deploy(1);
            await m_token_1.deployed();
        }
        {
            const TestToken = await ethers.getContractFactory("TestToken");
            m_token_2 = await TestToken.deploy(2);
            await m_token_2.deployed();
        }
        m_underlying_tokens[0] = m_token_1;
        m_underlying_tokens[1] = m_token_2;

        // init wrapped Vault of token 1
        {
            const Vault1 = await ethers.getContractFactory("Vault1");
            m_vault_1 = await Vault1.deploy(m_vault_owner.address, m_token_1.address);
            await m_vault_1.deployed();
        }
        // init wrapped Vault of token 2
        {
            const Vault1 = await ethers.getContractFactory("Vault1");
            m_vault_2 = await Vault1.deploy(m_vault_owner.address, m_token_2.address);
            await m_vault_2.deployed();
        }
        m_vaults[0] = m_vault_1;
        m_vaults[1] = m_vault_2;

    });

    describe("deposit + withdraw", function () {

        it("one client(s) deposit underlying -> withdraw a portion", async function () {

            const token_index = 0;
            const underlying_token = m_underlying_tokens[token_index];

            const client_index = 0;
            const client = m_clients[client_index];

            const vault_index = 0;
            const vault = m_vaults[vault_index];

            // init a balance of token
            const client_balance_start = 100;
            let tx = await underlying_token.connect(client).getSomeTestTokens(client_balance_start);
            await tx.wait();

            // verify token balance persisted
            {
                const realized = await underlying_token.balanceOf(client.address);
                expect(client_balance_start.toString()).to.equal(realized.toString());
            }

            // allow vault to transact in client token for full balance
            tx = await underlying_token.connect(client).approve(vault.address, client_balance_start);
            await tx.wait();

            // region: deposit

            // deposit half of that
            const client_deposit = 50;

            // call: deposit (call from client)
            await expect(vault.connect(client)
                .deposit(client_deposit))
                .to.emit(vault, "Deposit")
                .withArgs(client.address, client_deposit);

            // verify output - underlying token -- less of what was deposited
            {
                const expected = client_balance_start - client_deposit;
                const realized = await underlying_token.balanceOf(client.address);
                expect(expected.toString()).to.equal(realized.toString());
            }

            // verify output - wrapped token -- for the amount deposited
            {
                const expected = client_deposit;
                const realized = await vault.balanceOf(client.address);
                expect(expected.toString()).to.equal(realized.toString());
            }

            // endregion

            // region: withdraw

            // withdraw half of what was deposited
            const client_withdraw = 25;

            // call: withdraw
            await expect(vault.connect(client)
                .withdraw(client_withdraw))
                .to.emit(vault, "Withdraw")
                .withArgs(client.address, client_withdraw);

            // verify output - underlying token balance -- add back was withdrawn
            const client_balance_finish = client_balance_start - client_deposit + client_withdraw;
            {
                const expected = client_balance_finish;
                const realized = await underlying_token.balanceOf(client.address);
                expect(expected.toString()).to.equal(realized.toString());
            }

            // verify output - wrapped token -- less what was just withdrawn
            {
                const expected = client_deposit - client_withdraw;
                const realized = await vault.balanceOf(client.address);
                expect(expected.toString()).to.equal(realized.toString());
            }

            // endregion
        });

        it("many client(s) deposit underlying -> withdraw a portion", async function () {

            const vault = m_vault_1;
            const underlying_token = m_token_1;

            // init a balance of token for each client
            const arr_client_balance_start = [101, 102];
            for (let client_index = 0; client_index < m_clients.length; client_index++) {
                let tx =
                    await underlying_token
                        .connect(m_clients[client_index])
                        .getSomeTestTokens(arr_client_balance_start[client_index]);

                await tx.wait();
            }

            // verify token balance persisted
            for (let client_index = 0; client_index < m_clients.length; client_index++) {
                const realized = await underlying_token.balanceOf(m_clients[client_index].address);
                expect(arr_client_balance_start[client_index].toString()).to.equal(realized.toString());
            }

            // allow vault to transact in client token for full balance
            for (let client_index = 0; client_index < m_clients.length; client_index++) {
                tx =
                    await underlying_token
                        .connect(m_clients[client_index])
                        .approve(vault.address, arr_client_balance_start[client_index]);

                await tx.wait();
            }

            // region: deposit

            // deposit about half of that
            const arr_client_deposit = [51, 52];

            // call: deposit (call from client)
            for (let client_index = 0; client_index < m_clients.length; client_index++) {
                await expect(vault.connect(m_clients[client_index])
                    .deposit(arr_client_deposit[client_index]))
                    .to.emit(vault, "Deposit")
                    .withArgs(m_clients[client_index].address, arr_client_deposit[client_index]);
            }

            // verify output - underlying token -- less of what was deposited
            for (let client_index = 0; client_index < m_clients.length; client_index++) {
                const expected = arr_client_balance_start[client_index] - arr_client_deposit[client_index];
                const realized = await underlying_token.balanceOf(m_clients[client_index].address);
                expect(expected.toString()).to.equal(realized.toString());
            }

            // verify output - wrapped token -- for the amount deposited
            for (let client_index = 0; client_index < m_clients.length; client_index++) {
                const expected = arr_client_deposit[client_index];
                const realized = await vault.balanceOf(m_clients[client_index].address);
                expect(expected.toString()).to.equal(realized.toString());
            }

            // endregion

            // region: withdraw

            // withdraw a subset of what was deposited
            const arr_client_withdraw = [21, 22];

            // call: withdraw
            for (let client_index = 0; client_index < m_clients.length; client_index++) {
                await expect(vault.connect(m_clients[client_index])
                    .withdraw(arr_client_withdraw[client_index]))
                    .to.emit(vault, "Withdraw")
                    .withArgs(m_clients[client_index].address, arr_client_withdraw[client_index]);
            }

            // verify output - underlying token balance -- add back was withdrawn
            for (let client_index = 0; client_index < m_clients.length; client_index++) {
                const expected =
                    arr_client_balance_start[client_index]
                    - arr_client_deposit[client_index]
                    + arr_client_withdraw[client_index];
                const realized = await underlying_token.balanceOf(m_clients[client_index].address);
                expect(expected.toString()).to.equal(realized.toString());
            }

            // verify output - wrapped token -- less what was just withdrawn
            for (let client_index = 0; client_index < m_clients.length; client_index++) {
                const expected = arr_client_deposit[client_index] - arr_client_withdraw[client_index];
                const realized = await vault.balanceOf(m_clients[client_index].address);
                expect(expected.toString()).to.equal(realized.toString());
            }

            // endregion
        });

    });
});


