import dotenv from "dotenv";
dotenv.config();

console.log("ENV loaded. JWT_SECRET:", process.env.JWT_SECRET ? "OK" : "MISSING");
