import { getAccountsRouter } from "./routes/accounts";
import express from "express";
import mysql from "promise-mysql";
import { config } from "./config";
import { getAuthRouter } from "./routes/auth";
import { getAtmRouter } from "./routes/atm";
import { getAdminRouter } from "./routes/admin";


(async () => {
    const app = express();

    const pool = await mysql.createPool(config.pool);
    app.use(express.json());
    // app.use(cors({credentials: true, origin: true}))
    app.use((req, res, next) => {
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS, DELETE, PATCH");
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
    app.use("/atm", getAtmRouter(pool));
    app.use("/admin", getAdminRouter(pool));

    const server = app.listen(8081, () => {
        console.log("Listening on http://localhost:8081/");
    });
})();