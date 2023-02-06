import express, { query } from "express";
import { resolve } from "node:path";
import mysql from "promise-mysql";
import { apiInterceptor } from "../api-interceptor";
import { ApiResponse, queryError, UserTokenInfo } from "../api-response";
import { getTecaj } from "../tecaj-api";

async function getAccounts(conn: mysql.Connection): Promise<[]> {
    return conn.query("SELECT * FROM accounts;");
}

function generateRandomIBAN(): string {
    let value = "";
    for (let i = 0; i < 19; i++) {
        value += Math.floor(Math.random() * 10).toString();
    }

    return "HR" + value;
}

async function makeTransaction(
    conn: mysql.Connection,
    userId: number,
    senderIban: string,
    receiverIban: string,
    amount: number
): Promise<ApiResponse> {
    let accounts = await conn.query<any[]>("SELECT iban, balance, currency FROM accounts WHERE iban = ? && userId = ?;", [senderIban, userId]);

    // If current user is not the owner
    if (accounts.length === 0) {
        return {
            success: false,
            description: `Račun sa IBAN-om ${senderIban} ne postoji za trenutnog korisnika`
        };
    }

    let account = accounts[0];

    if (amount > account.balance) {
        return {
            success: false,
            description: "Nedovoljno sredstava"
        };
    }

    let receivingAccount = await conn.query<any[]>("SELECT currency FROM accounts WHERE iban = ?;", receiverIban);

    if (receivingAccount.length === 0) {
        return {
            success: false,
            description: "Uplatni račun ne postoji"
        };
    }

    let exchangeRate = 1;
    let receivingCurrency = receivingAccount[0].currency;

    // Only look up exchange rate if currencies are different
    if (account.currency != receivingCurrency) {
        let tecajevi = await getTecaj();
        if (account.currency != "EUR") {
            let tecaj = tecajevi.find(t => t.valuta == account.currency);
            let value = parseFloat(tecaj?.kupovni_tecaj.replace(",", ".") ?? "")
            exchangeRate = 1 / value;
        }

        if (receivingCurrency != "EUR") {
            let tecaj = tecajevi.find(t => t.valuta == receivingCurrency);
            let value = parseFloat(tecaj?.prodajni_tecaj.replace(",", ".") ?? "");
            exchangeRate *= value;
        }
    }

    let maxSendId = (await conn.query("SELECT MAX(id) AS id from sendTransactions"))[0].id as number;
    let maxReceiveId = (await conn.query("SELECT MAX(id) AS id from receiveTransactions"))[0].id as number;

    let newId = Math.max(maxSendId, maxReceiveId) + 1;

    let update1 = await conn.query(`UPDATE accounts SET balance = balance - ? WHERE iban = ?;`, [amount, senderIban]);
    let insert1 = await conn.query(`INSERT INTO sendTransactions (id, amount, iban, receiverIban, receivingCurrency, exchangeRate) VALUES(?, ?, ?, ?, ?, ?);`,
        [newId, amount, senderIban, receiverIban, receivingCurrency, exchangeRate]);

    let update2 = await conn.query(`UPDATE accounts SET balance = balance + ? WHERE iban = ?;`, [amount * exchangeRate, receiverIban]);
    let insert2 = await conn.query(`INSERT INTO receiveTransactions (id, amount, iban, senderIban) VALUES(?, ?, ?, ?);`,
        [newId, amount * exchangeRate, receiverIban, senderIban]);

    return {
        success: true,
        description: "Uspjeh"
    };
}

async function getCurrencies() {
    return ["EUR", ...(await getTecaj()).map(t => t.valuta)];
}

export function getAccountsRouter(pool: mysql.Pool) {
    return express.Router()
        .use(apiInterceptor)
        .get("/", async (req, res) => {
            let conn = await pool.getConnection();
            let tokenInfo = req["decoded"] as UserTokenInfo;

            try {
                let accounts = await conn.query("SELECT * FROM accounts WHERE userId = ?;", tokenInfo.id);
                res.json(accounts);
            }
            catch (e) {
                res.json(queryError());
            }
            finally {
                conn.release();
            }
        })
        .get("/available-currencies", async (req, res) => {
            res.json(await getCurrencies());
        })
        .post("/open-new", async (req, res) => {
            let conn = await pool.getConnection();
            let tokenInfo = req["decoded"] as UserTokenInfo;
            let currency = req.query["currency"]?.toString() ?? "";

            let currencies = await getCurrencies();

            if (!currencies.find(c => c == currency)) {
                return res.json(<ApiResponse>{
                    success: false,
                    description: `Valuta ${currency} nije podržana`
                });
            }

            try {
                let existing = await getAccounts(conn);
                let iban = generateRandomIBAN();
                while (existing.find((acc: any) => acc.iban == iban) !== undefined) {
                    iban = generateRandomIBAN();
                }

                let sqlRes = await conn.query("INSERT INTO accounts VALUES (?, 0.0, ?, ?)", [iban, tokenInfo.id, currency ?? 'EUR']);

                if (sqlRes.affectedRows === 1) {
                    res.json(<ApiResponse>{
                        success: true,
                        description: "Račun uspješno otvoren"
                    });
                } else {
                    res.json(<ApiResponse>{
                        success: false,
                        description: "Greška pri otvaranju računa"
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
        .get("/:iban", async (req, res) => {
            let conn = await pool.getConnection();
            let tokenInfo = req["decoded"] as UserTokenInfo;

            try {
                let iban = req.params["iban"];

                let accounts = await conn.query<any[]>("SELECT iban, balance, currency FROM accounts WHERE iban = ? && userId = ?;", [iban, tokenInfo.id]);

                // If current user is not the owner
                if (accounts.length === 0) {
                    return res.json(<ApiResponse>{
                        success: false,
                        description: `Račun sa IBAN-om ${iban} ne postoji za trenutnog korisnika`
                    });
                }

                let account = accounts[0];
                let sendingTransactions = await conn.query(
                    `SELECT IFNULL(receiverIban, 'ATM') as iban, amount, exchangeRate,
                        time_stamp, receivingCurrency FROM sendTransactions
                        WHERE iban = ?;`, iban);

                let receivingTransactions = await conn.query(
                    `SELECT IFNULL(senderIban, 'ATM') as iban, amount, time_stamp
                    FROM receiveTransactions
                    WHERE iban = ?;`, iban);

                account.sendingTransactions = sendingTransactions;
                account.receivingTransactions = receivingTransactions;

                res.json(<ApiResponse>{
                    success: true,
                    value: account,
                    description: "Račun pronađen"
                });
            }
            catch (e) {
                res.json(queryError());
            }
            finally {
                conn.release();
            }
        })
        .get("/:iban/basic-info", async (req, res) => {
            let conn = await pool.getConnection();

            try {
                let iban = req.params["iban"];

                let account = await conn.query(`SELECT iban, currency, CONCAT(firstName, ' ', lastName) as owner
                                                FROM accounts INNER JOIN users ON userId = users.id
                                                WHERE iban = ?;`, iban);

                if (account.length === 0) {
                    return res.json(<ApiResponse>{
                        success: false,
                        description: "Račun ne postoji"
                    });
                }

                res.json(<ApiResponse>{
                    success: true,
                    description: "Račun proneđen",
                    value: account[0]
                });
            }
            catch (e) {
                res.json(queryError());
            }
            finally {
                conn.release();
            }
        })
        .post("/:iban/transfer-money", async (req, res) => {
            let conn = await pool.getConnection();
            let tokenInfo = req["decoded"] as UserTokenInfo;

            try {
                let iban = req.params["iban"];
                let receiverIban = req.body["receiverIban"];
                let amount = req.body["amount"];

                res.json(makeTransaction(conn, tokenInfo.id, iban, receiverIban, amount));
            }
            catch (e) {
                res.json(queryError());
            }
            finally {
                conn.release();
            }
        });
}