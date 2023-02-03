import express, { query } from "express";
import mysql from "promise-mysql";
import { apiInterceptor } from "../api-interceptor";
import { ApiResponse, queryError, UserTokenInfo } from "../api-response";
import { getTecaj } from "../tecaj-api";

const BANK_IBAN = "HR0000000000000000000";

async function getAccounts(conn: mysql.Connection): Promise<[]> {
    return conn.query("SELECT * FROM accounts;");
}

function generateRandomIBAN(): string {
    let value = "";
    for (let i = 0; i < 19; i++) {
        value += Math.floor(Math.random() * 10).toString();
    }

    return "HR" + value;
}

async function makeTransaction(
    conn: mysql.Connection,
    userId: number,
    senderIban: string,
    receiverIban: string,
    amount: number
): Promise<ApiResponse> {
    let accounts = await conn.query<any[]>("SELECT iban, balance, currency FROM accounts WHERE iban = ? && userId = ?;", [senderIban, userId]);

    // If current user is not the owner
    if (accounts.length === 0) {
        return {
            success: false,
            status: 100,
            description: `Account with IBAN ${senderIban} doesn't exist for current user`
        };
    }

    let account = accounts[0];

    if (amount > account.balance) {
        return {
            success: false,
            status: 100,
            description: "Not enough balance"
        };
    }

    let receivingAccount = await conn.query<any[]>("SELECT currency FROM accounts WHERE iban = ?;", receiverIban);

    if (receivingAccount.length === 0) {
        return {
            success: false,
            status: 100,
            description: "Receiving account doesn't exist"
        };
    }

    let tecajevi = await getTecaj();
    let exchangeRate = 1;

    if (account.currency != "EUR") {
        let tecaj = tecajevi.find(t => t.valuta == account.currency);
        let value = parseFloat(tecaj?.srednji_tecaj.replace(",", ".") ?? "")
        exchangeRate = 1 / value;
    }

    let receivingCurrency = receivingAccount[0].currency;

    if (receivingCurrency != "EUR") {
        let tecaj = tecajevi.find(t => t.valuta == receivingCurrency);
        let value = parseFloat(tecaj?.srednji_tecaj.replace(",", ".") ?? "");
        exchangeRate *= value;
    }

    let update1 = await conn.query(`UPDATE accounts SET balance = balance - ? WHERE iban = ?;`, [amount, senderIban]);
    let insert1 = await conn.query(`INSERT INTO sendTransactions (amount, iban, receiverIban, receivingCurrency, exchangeRate) VALUES(?, ?, ?, ?, ?);`,
        [amount, senderIban, receiverIban, receivingCurrency, exchangeRate]);

    let update2 = await conn.query(`UPDATE accounts SET balance = balance + ? WHERE iban = ?;`, [amount * exchangeRate, receiverIban]);
    let insert2 = await conn.query(`INSERT INTO receiveTransactions (amount, iban, senderIban) VALUES(?, ?, ?);`,
        [amount * exchangeRate, receiverIban, senderIban]);

    return {
        success: false,
        status: 100,
        description: ""
    };
}

export function getAccountsRouter(pool: mysql.Pool) {
    return express.Router()
        .use(apiInterceptor)
        .get("/", async (req, res) => {
            let conn = await pool.getConnection();
            let tokenInfo = req["decoded"] as UserTokenInfo;

            try {
                let accounts = await conn.query("SELECT * FROM accounts WHERE userId = ?;", tokenInfo.id);
                res.json(accounts);
            }
            catch (e) {
                res.json(queryError());
            }
            finally {
                conn.release();
            }
        })
        .post("/open-new", async (req, res) => {
            let conn = await pool.getConnection();
            let tokenInfo = req["decoded"] as UserTokenInfo;

            try {
                let existing = await getAccounts(conn);
                let iban = generateRandomIBAN();
                while (existing.find((acc: any) => acc.iban == iban) !== undefined) {
                    iban = generateRandomIBAN();
                }

                let sqlRes = await conn.query("INSERT INTO accounts VALUES (?, 0.0, ?, 'EUR')", [iban, tokenInfo.id]);

                if (sqlRes.affectedRows === 1) {
                    res.json(<ApiResponse>{
                        success: true,
                        status: 200,
                        description: "Account opened successfully"
                    });
                } else {
                    res.json(<ApiResponse>{
                        success: false,
                        status: 100,
                        description: "Error opening account"
                    });
                }
            }
            catch (e) {
                res.json(queryError());
            }
            finally {
                conn.release();
            }
        })
        .get("/:iban", async (req, res) => {
            let conn = await pool.getConnection();
            let tokenInfo = req["decoded"] as UserTokenInfo;

            try {
                let iban = req.params["iban"];

                let accounts = await conn.query<any[]>("SELECT iban, balance, currency FROM accounts WHERE iban = ? && userId = ?;", [iban, tokenInfo.id]);

                // If current user is not the owner
                if (accounts.length === 0) {
                    return res.json(<ApiResponse>{
                        success: false,
                        status: 100,
                        description: `Account with IBAN ${iban} doesn't exist for current user`
                    });
                }

                let account = accounts[0];
                let sendingTransactions = await conn.query(
                `SELECT IFNULL(receiverIban, 'ATM') as iban, amount, exchangeRate,
                        time_stamp, receivingCurrency FROM sendTransactions
                        WHERE iban = ?;`, iban);

                let receivingTransactions = await conn.query(
                    `SELECT IFNULL(senderIban, 'ATM') as iban, amount, time_stamp
                    FROM receiveTransactions
                    WHERE iban = ?;`, iban);

                account.sendingTransactions = sendingTransactions;
                account.receivingTransactions = receivingTransactions;

                res.json(<ApiResponse>{
                    success: true,
                    status: 200,
                    value: account,
                    description: "Successfully found accounts"
                });
            }
            catch (e) {
                res.json(queryError());
            }
            finally {
                conn.release();
            }
        })
        .get("/:iban/basic-info", async (req, res) => {
            let conn = await pool.getConnection();

            try {
                let iban = req.params["iban"];

                let account = await conn.query(`SELECT iban, currency, CONCAT(firstName, ' ', lastName) as owner
                                                FROM accounts INNER JOIN users ON userId = users.id
                                                WHERE iban = ?;`, iban);

                if (account.length === 0) {
                    return res.json(<ApiResponse>{
                        success: false,
                        status: 100,
                        description: "Account doesn't exist"
                    });
                }

                res.json(<ApiResponse>{
                    success: true,
                    status: 200,
                    description: "Account found",
                    value: account[0]
                });
            }
            catch (e) {
                res.json(queryError());
            }
            finally {
                conn.release();
            }
        })
        .post("/:iban/transfer-money", async (req, res) => {
            let conn = await pool.getConnection();
            let tokenInfo = req["decoded"] as UserTokenInfo;

            try {
                let iban = req.params["iban"];
                let receiverIban = req.body["receiverIban"];
                let amount = req.body["amount"];

                res.json(makeTransaction(conn, tokenInfo.id, iban, receiverIban, amount));
            }
            catch (e) {
                res.json(queryError());
            }
            finally {
                conn.release();
            }
        });
}