import jwt from "jsonwebtoken";
import { config } from "./config";

export interface ApiResponse {
    success: boolean,
    status: number | string,
    token?: string,
    userInfo?: UserTokenInfo,
    value?: any,
    description: string
}

export function queryError() {
    return <ApiResponse>{
        success: false,
        status: 100,
        description: "Error with query"
    };
}

export interface UserTokenInfo {
    id: number,
    email: string,
    firstName: string,
    lastName: string,
    isAdmin: boolean
}

export function generateSignedToken(info: UserTokenInfo) {
    return jwt.sign({
        ...info
    }, config.secret, {
        expiresIn: "1h"
    });
}