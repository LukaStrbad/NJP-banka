import express, { Response } from "express";
import mysql from "promise-mysql";
import md5 from "md5";
import { ApiResponse, generateSignedToken, queryError, UserTokenInfo } from "../api-response";
import { pbkdf2Sync } from "crypto"
import { v4 as uuidv4 } from "uuid";

export function getAuthRouter(pool: mysql.Pool) {
    return express.Router()
        .post("/login", async (req, res) => {
            let conn = await pool.getConnection();
            try {
                let email = req.body.email;

                let rows = await conn.query<any[]>("SELECT * FROM users WHERE email = ?;", email);
                let password = pbkdf2Sync(req.body.password, rows[0].salt, 10_000, 64, "sha512").toString("hex");

                if (rows.length === 0) {
                    res.json(<ApiResponse>{
                        success: false,
                        status: "error",
                        description: "Korisnik ne postoji"
                    });
                    return;
                }

                let user = rows[0];
                if (user.pass === password) {
                    let userInfo = {
                        id: user.id,
                        email: user.email,
                        firstName: user.firstName,
                        lastName: user.lastName,
                        isAdmin: user.isAdmin
                    };
                    res.json(<ApiResponse>{
                        success: true,
                        token: generateSignedToken(userInfo),
                        userInfo: userInfo,
                        description: "Token uspješno generiran"
                    });
                } else {
                    res.json(<ApiResponse>{
                        success: false,
                        description: "Kriva lozinka"
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
        .post("/register", async (req, res) => {
            let conn = await pool.getConnection();
            try {
                let salt = uuidv4();
                let email = req.body.email;
                let firstName = req.body.firstName;
                let lastName = req.body.lastName;
                let dateOfBirth = req.body.dateOfBirth;
                let password = pbkdf2Sync(req.body.password, salt, 10_000, 64, "sha512").toString("hex")

                if (email == undefined
                    || firstName == undefined
                    || lastName == undefined
                    || dateOfBirth == undefined
                    || email == undefined) {
                    return res.json(<ApiResponse>{
                        success: false,
                        description: "E-mail, ime, prezime, datum rođenja i lozinka moraju postojati."
                    });
                }

                let dobFormatted = (dateOfBirth as string).split("T")[0];
                let today = new Date();
                let years18 = new Date(today.getFullYear() - 18, today.getMonth(), today.getDay())
                    .toISOString().split("T")[0];

                // If user is younger than 18
                if (dobFormatted > years18) {
                    return res.json(<ApiResponse>{
                        success: false,
                        description: "Korisnik je mlađi od 18"
                    });
                }

                let checkExistingUser = await conn.query<any[]>("SELECT * FROM users WHERE email = ?", email);

                if (checkExistingUser.length > 0) {
                    return res.json(<ApiResponse>{
                        success: false,
                        description: "Korisnik već postoji"
                    });
                }

                const user = {
                    salt: salt,
                    email: email,
                    firstName: firstName,
                    lastName: lastName,
                    dateOfBirth: dateOfBirth,
                    pass: password,
                    isAdmin: false
                }

                let insert = await conn.query("INSERT INTO users SET ?;", user);

                let userId = insert.insertId;

                let newUser = await conn.query<UserTokenInfo[]>("SELECT id, email, firstName, lastName, isAdmin FROM users WHERE id = ?;", userId);

                res.json(<ApiResponse>{
                    success: true,
                    token: generateSignedToken(newUser[0]),
                    userInfo: newUser[0],
                    description: "Prijava uspješna"
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