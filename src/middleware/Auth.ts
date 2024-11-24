import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import cookie from "cookie";
import { WebSocket } from "ws";

dotenv.config();

export const verifyCookies = (cookies: string, ws: WebSocket) => {
    // Check for cookies to verify user

    console.log(cookies)
    const parsedCookies = cookie.parse(cookies)
    const token = parsedCookies.token;
    console.log(token);

    if (!token) {
        // res.status(401).json({ message: "No token provided" });
        console.log("No token provided");
        ws.close(4001, "Unauthorized: No token found");
        return;
    }

    try {
        if (!process.env.JWT_SECRET) {
            throw new Error("JWT_SECRET is not defined in environment variables");
        }

        const user = jwt.verify(token, process.env.JWT_SECRET);

        return user;
    } catch (error) {
        // res.status(401).json({ message: "Invalid token" });
        console.log("Invalid token");
        return;
    }
}