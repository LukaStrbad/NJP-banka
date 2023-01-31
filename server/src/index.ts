import { getAccountsRouter } from "./routes/accounts";
import express from "express";
import { getTransactionsRouter } from "./routes/transactions";
import mysql from "promise-mysql";
import { config } from "./config";
import { getAuthRouter } from "./routes/auth";


(async () => {
    const app = express();

    const pool = await mysql.createPool(config.pool);
    app.use(express.json());
    // app.use(cors({credentials: true, origin: true}))
    app.use((req, res, next) => {
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS, DELETE");
        res.setHeader("Access-Control-Max-Age", "3600");
        res.setHeader("Access-Control-Allow-Headers", "Content-Type, Origin, Cache-Control, X-Requested-With");
        res.setHeader("Access-Control-Allow-Credentials", "true");
        next();
    });

    app.get("/", (req, res) => {
        res.send("Hello world");
    });

    app.use("/auth", getAuthRouter(pool));
    app.use("/accounts", getAccountsRouter(pool));
    app.use("/transactions", getTransactionsRouter(pool));

    const server = app.listen(8081, () => {
        console.log("Listening on port 8081");
    });
})();