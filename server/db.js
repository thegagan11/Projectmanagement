import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }, // Required for Supabase
});

pool.connect()
  .then(() => console.log("🔥 Connected to Supabase PostgreSQL!"))
  .catch(err => console.error("❌ Database connection error: ", err));

export default pool;
