import express from "express";
import { ApiResponse } from "./api-response";
import jwt from "jsonwebtoken";
import { config } from "./config";

export function verifyToken(token: string) {
    let error: jwt.VerifyErrors | null = null;
    let decoded: string | jwt.JwtPayload | undefined = undefined;

    jwt.verify(token, config.secret, (err, dec) => {
        error = err;
        decoded = dec;
    });

    return [error, decoded];
}

export function apiInterceptor(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
) {
    const token = req.body.token || req.params.token || req.headers["x-access-token"] || req.query.token;

    if (token) {
        let [error, decoded] = verifyToken(token);
        if (error) {
            return res.status(401).send(<ApiResponse> {
                success: false,
                description: "Krivi token"
            });
        }
        req["decoded"] = decoded;
        next();
    } else {
        return res.status(401).send(<ApiResponse>{
            success: false,
            description: "Token nije poslan"
        });
    }
}
