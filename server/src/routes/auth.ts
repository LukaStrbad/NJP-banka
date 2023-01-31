import express, { Response } from "express";
import mysql from "promise-mysql";
import md5 from "md5";
import { ApiResponse, generateSignedToken, queryError, UserTokenInfo } from "../api-response";

export function getAuthRouter(pool: mysql.Pool) {
    return express.Router()
        .post("/login", async (req, res) => {
            let conn = await pool.getConnection();
            try {
                let email = req.body.email;
                let password = md5(req.body.password);

                let rows = await conn.query<any[]>("SELECT * FROM users WHERE email = ?;", email);

                if (rows.length === 0) {
                    res.json(<ApiResponse>{
                        success: false,
                        status: "error",
                        description: "User doesn't exist"
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
                        status: 200,
                        token: generateSignedToken(userInfo),
                        userInfo: userInfo,
                        description: "Token generated successfully"
                    });
                } else {
                    res.json(<ApiResponse>{
                        success: false,
                        status: 150,
                        description: "Wrong password"
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
                let email = req.body.email;
                let firstName = req.body.name;
                let lastName = req.body.lastName;
                let dateOfBirth = req.body.dateOfBirth;
                let password = md5(req.body.password);

                if (email == undefined
                    || firstName == undefined
                    || lastName == undefined
                    || dateOfBirth == undefined
                    || email == undefined) {
                    return res.json(<ApiResponse>{
                        success: false,
                        status: 100,
                        description: "Email, first and last name, date of birth password must be provided."
                    });
                }

                let checkExistingUser = await conn.query<any[]>("SELECT * FROM users WHERE email = ?", email);

                if (checkExistingUser.length > 0) {
                    return res.json(<ApiResponse>{
                        success: false,
                        status: 100,
                        description: "User already exists"
                    });
                }

                const user = {
                    email: email,
                    firstName: firstName,
                    lastName: lastName,
                    dateOfBirth: dateOfBirth,
                    pass: password,
                    isAdmin: false
                }

                let insert = await conn.query("INSERT INTO users SET?;", user);

                let userId = insert.insertId;

                let newUser = await conn.query<UserTokenInfo[]>("SELECT email, firstName, lastName, isAdmin FROM users WHERE id = ?;", userId);

                res.json(<ApiResponse> {
                    success: true,
                    status: 200,
                    token: generateSignedToken(newUser[0]),
                    userInfo: newUser[0],
                    description: "Login successful"
                });
            }
            catch (e) {
                res.json(queryError());
            }
            finally {
                conn.release();
            }
        })
}