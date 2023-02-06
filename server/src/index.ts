import { getAccountsRouter } from "./routes/accounts";
import express from "express";
import mysql from "promise-mysql";
import { config } from "./config";
import { getAuthRouter } from "./routes/auth";
import { getAtmRouter } from "./routes/atm";
import { getAdminRouter } from "./routes/admin";
import path from "path";

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

    app.use("/api/auth", getAuthRouter(pool));
    app.use("/api/accounts", getAccountsRouter(pool));
    app.use("/api/atm", getAtmRouter(pool));
    app.use("/api/admin", getAdminRouter(pool));

    app.use(express.static(path.join(__dirname, "/public/app")));
    app.get("*", async (req, res) => {
        res.sendFile(path.join(__dirname + "/public/app/index.html"));
    });

    const server = app.listen(8081, () => {
        console.log("Listening on http://localhost:8081/");
    });
})();