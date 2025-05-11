import mongoose from "mongoose";
import { DB_NAME } from "../constants/index.js";

export const connectDB = async (MONGO_URI) => {
  mongoose.connect(MONGO_URI, { dbName: DB_NAME })
  .then((data) => console.log(`✅ Connected to ${data?.connection?.db?.databaseName || ""} Database!`))
  .catch((err) => console.error(`❌ Failed to Connect to ${DB_NAME} Database, Error: ${err}`));
};