import express from "express";
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

                return res.json(<ApiResponse> {
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
                    return res.json(<ApiResponse> {
                        success: false,
                        description: "Korisnik ne postoji"
                    });
                } else {
                    return res.json(<ApiResponse> {
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

                return res.json(<ApiResponse> {
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
        });
}