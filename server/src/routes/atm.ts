import express from "express";
import mysql from "promise-mysql";
import { apiInterceptor } from "../api-interceptor";
import { ApiResponse, queryError, UserTokenInfo } from "../api-response";
import { getNextTransactionId } from "./accounts";

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
                        description: `Račun sa IBAN-om ${iban} ne postoji za trenutnog korisnika`
                    });
                }

                if (amount > accountBalance[0].balance) {
                    return res.json(<ApiResponse>{
                        success: false,
                        description: "Nemate dovoljno sredstava"
                    });
                }

                let queryResult = await conn.query(
                    `UPDATE accounts SET balance = balance - ?
                    WHERE iban = ? AND userId = ?;`, [amount, iban, tokenInfo.id]);

                let newId = await getNextTransactionId(conn);
                let insert1 = await conn.query(`INSERT INTO sendtransactions (id, amount, iban, receiverIban, receivingCurrency) VALUES(?, ?, ?, NULL, ?);`,
                    [newId, amount, iban, accountBalance[0].currency]);

                if (queryResult.affectedRows === 0) {
                    return res.json(<ApiResponse>{
                        success: false,
                        description: "Nepoznata greška"
                    });
                } else {
                    return res.json(<ApiResponse>{
                        success: true,
                        description: `Uspješno isplaćeno ${amount} ${accountBalance[0].currency}`
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
                        description: `Račun sa IBAN-om ${iban} ne postoji za trenutnog korisnika`
                    });
                }

                let queryResult = await conn.query(
                    `UPDATE accounts SET balance = balance + ?
                    WHERE iban = ? AND userId = ?;`, [amount, iban, tokenInfo.id]);

                let newId = await getNextTransactionId(conn);
                let insert1 = await conn.query(`INSERT INTO receivetransactions (id,amount, iban, senderIban) VALUES(?, ?, ?, NULL);`,
                    [newId, amount, iban]);

                if (queryResult.affectedRows === 0) {
                    return res.json(<ApiResponse>{
                        success: false,
                        description: "Nepoznata greška"
                    });
                } else {
                    return res.json(<ApiResponse>{
                        success: true,
                        description: `Uspješno uplaćeno ${amount} ${accountBalance[0].currency}`
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
