const {expect} = require("chai");
const {ethers} = require("hardhat");
const { smock } = require('@defi-wonderland/smock');

describe("Vault 1", () => {

    let m_vault1_owner;
    let m_vault1_contract;

    // init a couple fake tokens
    let m_mock_token_1;
    let m_mock_token_2;
    const m_mock_token_count = 2;

    // init a couple of clients
    let m_client1;
    let m_client2;

    beforeEach(async () => {
        [m_vault1_owner, m_client1, m_client2] = await ethers.getSigners();

        // init contract
        const Vault1 = await ethers.getContractFactory("Vault1");
        m_vault1_contract = await Vault1.deploy();
        await m_vault1_contract.deployed();

        // init mock tokens
        m_mock_token_1 = await smock.fake("IERC20");
        m_mock_token_2 = await smock.fake("IERC20");

    });

    describe("deposit", function () {

        it("1 client(s) - 1 token(s)", async function () {

            // when passed to a smart contract function
            const mock_token_1_arg = m_mock_token_1.address;

            // init a balance of token
            const client_balance_start = 100;

            // deposit half of that
            const client_deposit = 50;

            // prime mock
            m_mock_token_1.balanceOf.whenCalledWith(m_client1.address).returns(client_balance_start)
            // expect(my_fake_token.transferFrom).to.have.been.called;
            // expect(my_fake_token.transferFrom).to.have.been.calledWith(client, g_vault1_contract.address, client_deposit);
            // my_fake_token.transferFrom.whenCalledWith(client, g_vault1_contract.address, client_deposit)

            // call: deposit
            {
                // call from client
                let tx =
                    await m_vault1_contract.connect(m_client1)
                        .deposit(client_deposit, mock_token_1_arg);

                // give time for change to persist to block chain
                await tx.wait();

                // verify output
                // deposit success -> contract has correct amount in escrow
                const realized_client_deposit =
                    await m_vault1_contract.connect(m_client1)
                        .getDepositedAmount(mock_token_1_arg);

                expect(client_deposit).to.equal(realized_client_deposit);
            }

        });

        it("1 client(s) - 2 token(s)", async function () {

            // single client
            const client = m_client1;

            // package token elements into an arry
            const tokens = [m_mock_token_1, m_mock_token_2]
            const token_args = [m_mock_token_1.address, m_mock_token_2.address];
            const token_beginning_balances = [101, 102]

            // deposit amounts
            const token_deposit_amounts = [50, 51]


            // prime mock(s)
            for(let token_index = 0; token_index < m_mock_token_count; token_index++) {
                tokens[token_index].balanceOf.whenCalledWith(client.address)
                    .returns(token_beginning_balances[token_index]);
            }

            // call: deposit
            for (let token_index = 0; token_index < m_mock_token_count; token_index++) {

                // call from client
                let tx =
                    await m_vault1_contract.connect(client)
                        .deposit(token_deposit_amounts[token_index], token_args[token_index]);

                // give time for change to persist to block chain
                await tx.wait();
            }
            // verify output
            for (let token_index = 0; token_index < m_mock_token_count; token_index++) {
                // deposit success -> contract has correct amount in escrow
                const realized_client_deposit =
                    await m_vault1_contract.connect(client).getDepositedAmount(token_args[token_index]);

                expect(token_deposit_amounts[token_index]).to.equal(realized_client_deposit);
            }

        });

        it("2 client(s) - 2 token(s)", async function () {

            // package clients
            const clients = [m_client1, m_client2];

            // package token elements into an arry
            const tokens = [m_mock_token_1, m_mock_token_2];
            const token_args = [m_mock_token_1.address, m_mock_token_2.address];
            const token_beginning_balances = [[101, 102], [103, 104]]
            // deposit amounts - all unique but resultant balance will be 100
            const token_deposit_amounts = [[1, 2], [3, 4]]

            // prime mock(s)
            for(let client_index = 0; client_index < clients.length; client_index++) {
                for(let token_index = 0; token_index < m_mock_token_count; token_index++) {
                    tokens[token_index].balanceOf
                        .whenCalledWith(clients[client_index].address)
                        .returns(token_beginning_balances[token_index][client_index]);
                }
            }
            // call: deposit
            for(let client_index = 0; client_index < clients.length; client_index++) {
                for (let token_index = 0; token_index < m_mock_token_count; token_index++) {

                    // call from client
                    let tx =
                        await m_vault1_contract
                            .connect(clients[client_index])
                            .deposit(token_deposit_amounts[token_index][client_index], token_args[token_index]);

                    // give time for change to persist to block chain
                    await tx.wait();
                }
            }

            // verify output
            for(let client_index = 0; client_index < clients.length; client_index++) {
                for (let token_index = 0; token_index < m_mock_token_count; token_index++) {
                    // deposit success -> contract has correct amount in escrow
                    const realized_client_deposit =
                        await m_vault1_contract.connect(clients[client_index])
                            .getDepositedAmount(token_args[token_index]);

                    expect(token_deposit_amounts[token_index][client_index]).to.equal(realized_client_deposit);
                }
            }


        });

        // TODO: when you return -
        //  0) commit what you have
        //  1a) edge cases
        //  1b) implement Vault2
    });
});

