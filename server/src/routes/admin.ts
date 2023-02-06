import express, { query } from "express";
import mysql from "promise-mysql";
import { apiInterceptor } from "../api-interceptor";
import { ApiResponse, queryError, UserTokenInfo } from "../api-response";

export function getAdminRouter(pool: mysql.Pool) {
    return express.Router()
        .use(apiInterceptor)
        .use((req, res, next) => {
            const token = req["decoded"] as UserTokenInfo;

            // Block non admins
            if (!token.isAdmin) {
                return res.status(403).send(<ApiResponse>{
                    success: false,
                    description: "Korisnik nije administrator"
                });
            }
            next();
        })
        .get("/users", async (req, res) => {
            let conn = await pool.getConnection();

            try {
                let users = await conn.query<any[]>("SELECT id, email, firstName, lastName, dateOfBirth, isAdmin FROM users;");

                return res.json(<ApiResponse>{
                    success: true,
                    description: "Korisnici dohvaćeni",
                    value: users
                });
            }
            catch (e) {
                res.json(queryError());
            }
            finally {
                conn.release()
            }
        })
        .patch("/users/make-admin", async (req, res) => {
            let conn = await pool.getConnection();
            let userId = req.body["userId"];

            try {
                let update = await conn.query("UPDATE users SET isAdmin = TRUE WHERE id = ?;", userId);

                if (update.affectedRows === 0) {
                    return res.json(<ApiResponse>{
                        success: false,
                        description: "Korisnik ne postoji"
                    });
                } else {
                    return res.json(<ApiResponse>{
                        success: true,
                        description: "Korisnik uspješno promaknut u admina"
                    });
                }
            }
            catch (e) {
                res.json(queryError());
            }
            finally {
                conn.release()
            }
        })
        .get("/accounts", async (req, res) => {
            let conn = await pool.getConnection();

            try {
                let accounts = await conn.query<any[]>("SELECT * FROM accounts;");

                return res.json(<ApiResponse>{
                    success: true,
                    description: "Računi dohvaćeni",
                    value: accounts
                });
            }
            catch (e) {
                res.json(queryError());
            }
            finally {
                conn.release()
            }
        })
        .get("/transactions", async (req, res) => {
            let conn = await pool.getConnection();

            try {
                let transactions = await conn.query(
                    `SELECT s.amount AS sent, sAcc.currency AS sentCurrency,
                        r.amount AS received, rAcc.currency AS receivedCurrency,
                        CONCAT(sUser.firstName, ' ', sUser.lastName, ' (', s.iban, ')') AS sender,
                        CONCAT(rUser.firstName, ' ', rUser.lastName, ' (', r.iban, ')') AS receiver,
                        s.time_stamp
                    FROM sendTransactions s 
                    INNER JOIN accounts sAcc ON s.iban = sAcc.iban
                    INNER JOIN users sUser ON sAcc.userId = sUser.id
                    INNER JOIN receiveTransactions r ON s.id = r.id
                    INNER JOIN accounts rAcc ON r.iban = rAcc.iban
                    INNER JOIN users rUser ON rAcc.userId = rUser.id
                    UNION ALL
                    SELECT NULL AS sent, NULL AS sentCurrency, 
                        amount AS received, a.currency AS receivedCurrency,
                        NULL AS sender, CONCAT(users.firstName, ' ', users.lastName, ' (', a.iban, ')') AS receiver,
                        time_stamp
                    FROM receiveTransactions r 
                    INNER JOIN accounts a ON r.iban = a.iban
                    INNER JOIN users ON a.userId = users.id
                    WHERE senderIban IS NULL
                    UNION ALL
                    SELECT amount AS sent, a.currency AS sentCurrency, 
                        NULL AS received, NULL AS receivedCurrency,
                        CONCAT(users.firstName, ' ', users.lastName, ' (', a.iban, ')') AS sender, NULL AS receiver,
                        time_stamp
                    FROM sendTransactions r 
                    INNER JOIN accounts a ON r.iban = a.iban
                    INNER JOIN users ON a.userId = users.id
                    WHERE receiverIban IS NULL
                    ORDER BY time_stamp DESC;`
                );

                return res.json(<ApiResponse>{
                    success: true,
                    description: "Transakcije dohvaćene",
                    value: transactions
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