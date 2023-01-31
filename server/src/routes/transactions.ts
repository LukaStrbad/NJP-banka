import express from "express";
import mysql from "promise-mysql";
import { apiInterceptor } from "../api-interceptor";
import { queryError } from "../api-response";

export function getTransactionsRouter(pool: mysql.Pool) {

    return express.Router()
        .use(apiInterceptor)
        .get("/", async (req, res) => {
            let conn = await pool.getConnection();
            try {
                let rows = await conn.query("SELECT * FROM transactions;");
                res.send(rows);
            }
            catch (e) {
                res.json(queryError());
            }
            finally {
                conn.release();
            }
        });
}