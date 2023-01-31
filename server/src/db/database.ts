import mysql from "promise-mysql";
import { config } from "../config";

export function initConnection() {
    return mysql.createConnection(config.pool);
}
