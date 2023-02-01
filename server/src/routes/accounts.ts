import express, { query } from "express";
import mysql from "promise-mysql";
import { apiInterceptor } from "../api-interceptor";
import { ApiResponse, queryError, UserTokenInfo } from "../api-response";

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

                if (sqlRes.affectedRows == 1) {
                    res.send(<ApiResponse>{
                        success: true,
                        status: 200,
                        description: "Account opened successfully"
                    });
                } else {
                    res.send(<ApiResponse>{
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
                if (accounts.length == 0) {
                    return res.json(<ApiResponse>{
                        success: false,
                        status: 100,
                        description: `Account with IBAN ${iban} doesn't exist for current owner`
                    });
                }

                let account = accounts[0];
                let sendingPayments = await conn.query(`SELECT IF(receiverIBAN = '${BANK_IBAN}', 'ATM', receiverIBAN) AS iban, 
                                                        exchangeRate, amount, time_stamp, receivingCurrency
                                                        FROM transactions WHERE senderIBAN = ?;`, iban);

                let receivingPayments = await conn.query(`SELECT IF(senderIBAN = '${BANK_IBAN}', 'ATM', senderIBAN) AS iban, 
                                                        exchangeRate, amount, time_stamp, receivingCurrency AS sendingCurrency
                                                        FROM transactions WHERE receiverIBAN = ?;`, iban);

                account.outgoingTransactions = sendingPayments;
                account.ingoingTransactions = receivingPayments;

                res.send(<ApiResponse>{
                    success: true,
                    status: 200,
                    value: JSON.stringify(account),
                    description: "Successfully found accounts"
                });
            }
            catch (e) {
                res.json(queryError());
            }
            finally {
                conn.release();
            }
        });
}