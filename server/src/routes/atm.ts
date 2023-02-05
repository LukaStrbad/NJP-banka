import express from "express";
import mysql from "promise-mysql";
import { apiInterceptor } from "../api-interceptor";
import { ApiResponse, queryError, UserTokenInfo } from "../api-response";

export function getAtmRouter(pool: mysql.Pool) {
    return express.Router()
        .use(apiInterceptor)
        .post("/withdraw", async (req, res) => {
            let conn = await pool.getConnection();
            let tokenInfo = req["decoded"] as UserTokenInfo;
            let iban = req.body["iban"];
            let amount = parseFloat(req.body["amount"]);

            try {
                let accountBalance = await conn.query<any[]>(
                    `SELECT balance, currency FROM accounts WHERE iban = ? and userId = ?;`, [iban, tokenInfo.id]);

                if (accountBalance.length === 0) {
                    return res.json(<ApiResponse>{
                        success: false,
                        status: 100,
                        description: `Account with IBAN ${iban} doesn't exist for current user`
                    });
                }

                if (amount > accountBalance[0].balance) {
                    return res.json(<ApiResponse>{
                        success: false,
                        status: 100,
                        description: "You don't have enough funds"
                    });
                }

                let queryResult = await conn.query(
                    `UPDATE accounts SET balance = balance - ?
                    WHERE iban = ? AND userId = ?;`, [amount, iban, tokenInfo.id]);

                let insert1 = await conn.query(`INSERT INTO sendTransactions (amount, iban, receiverIban, receivingCurrency) VALUES(?, ?, NULL, ?);`,
                    [amount, iban, accountBalance[0].currency]);

                if (queryResult.affectedRows === 0) {
                    return res.json(<ApiResponse>{
                        success: false,
                        status: 100,
                        description: "Unknown error occured"
                    });
                } else {
                    return res.json(<ApiResponse>{
                        success: true,
                        status: 200,
                        description: `Successfully withdrawn ${amount} ${accountBalance[0].currency}`
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
        .post("/deposit", async (req, res) => {
            let conn = await pool.getConnection();
            let tokenInfo = req["decoded"] as UserTokenInfo;
            let iban = req.body["iban"];
            let amount = parseFloat(req.body["amount"]);

            try {
                let accountBalance = await conn.query<any[]>(
                    `SELECT currency FROM accounts WHERE iban = ? and userId = ?;`, [iban, tokenInfo.id]);

                if (accountBalance.length === 0) {
                    return res.json(<ApiResponse>{
                        success: false,
                        status: 100,
                        description: `Account with IBAN ${iban} doesn't exist for current user`
                    });
                }

                let queryResult = await conn.query(
                    `UPDATE accounts SET balance = balance + ?
                    WHERE iban = ? AND userId = ?;`, [amount, iban, tokenInfo.id]);

                let insert1 = await conn.query(`INSERT INTO receiveTransactions (amount, iban, senderIban) VALUES(?, ?, NULL);`,
                    [amount, iban]);

                if (queryResult.affectedRows === 0) {
                    return res.json(<ApiResponse>{
                        success: false,
                        status: 100,
                        description: "Unknown error occured"
                    });
                } else {
                    return res.json(<ApiResponse>{
                        success: true,
                        status: 200,
                        description: `Successfully deposited ${amount} ${accountBalance[0].currency}`
                    });
                }
            }
            catch (e) {
                res.json(queryError());
            }
            finally {
                conn.release();
            }
        });
}