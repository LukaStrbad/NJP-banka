import express, { query } from "express";
import mysql from "promise-mysql";
import { apiInterceptor } from "../api-interceptor";
import { queryError, UserTokenInfo } from "../api-response";

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
        .post("/:userId/openNew", async (req, res) => {
            let conn = await pool.getConnection();
            try {
                let userId = req.params["userId"];

                let existing = await getAccounts(conn);
                let iban = generateRandomIBAN();
                while (existing.find((acc: any) => acc.iban == iban) !== undefined) {
                    iban = generateRandomIBAN();
                }

                let sqlRes = await conn.query("INSERT INTO accounts VALUES (?, 0.0, ?, 'EUR')", [iban, userId]);

                if (sqlRes.affectedRows == 1) {
                    res.send({
                        success: true,
                        message: "account successfully opened"
                    });
                } else {
                    res.send({
                        success: false,
                        message: "error opening account"
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
            try {
                let iban = req.params["iban"];

                let account = await conn.query(`SELECT *
                                              FROM accounts
                                              WHERE iban = '${iban}'`);

                if (!account) {
                    res.send({
                        success: false,
                        message: "Account doesn't exist"
                    });
                }

                account = account[0];
                let userId = account["userId"];

                res.send({
                    success: true,
                    value: account
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