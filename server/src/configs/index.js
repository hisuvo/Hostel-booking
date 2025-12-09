import dotenv from "dotenv";
import path from "node:path";

dotenv.config({ path: path.join(process.cwd(), ".env") });

const config = {
  port: process.env.PORT,
  mogoDB_url: process.env.MONGODB_URL,
  clerk_publishable_key: process.env.CLERK_PUBLISHABLE_KEY,
  clerk_secret_key: process.env.CLERK_SECRET_KEY,
  clerk_webhook_secret_key: process.env.CLERK_WEBHOOK_SECRET_KEY,
};

export default config;
