import dotenv from "dotenv";

dotenv.config();

console.log("ENV loaded. JWT_SECRET:", process.env.JWT_SECRET ? "OK" : "MISSING");
console.log("ENV loaded. MONGO_URI:", process.env.MONGO_URI ? "OK" : "MISSING");
