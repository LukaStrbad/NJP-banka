import { ConnectionConfig } from "promise-mysql";

export const config = {
    port: process.env.PORT || 8081,
    pool: <ConnectionConfig>{
        connectionLimit: 100,
        host: "localhost",
        user: "root",
        password: "root",
        database: "njp_banka",
        debug: false
    },
    secret: "randomstringofcharactersthatishardtoremember"
}