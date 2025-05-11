import { configDotenv } from "dotenv";
configDotenv({ path: "./.env" });

export const NODE_ENV = process.env.NODE_ENV?.trim() || "PRODUCTION";
export const PORT = process.env.PORT || 4000;

export const MONGO_URI = process.env.MONGO_URI;
export const DB_NAME = process.env.DB_NAME;

export const JWT_SECRET = process.env.JWT_SECRET;
export const ADMIN_SECRET_KEY = process.env.ADMIN_SECRET_KEY;

export const CLIENT_URL = process.env.CLIENT_URL;

export const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;
export const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY;
export const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET;

export const CHATTER_BOX_ADMIN_TOKEN = process.env.CHATTER_BOX_ADMIN_TOKEN;
export const CHATTER_BOX_TOKEN = process.env.CHATTER_BOX_TOKEN;

export const CORS_OPTIONS = {
  origin: [CLIENT_URL],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
};

export const COOKIE_OPTIONS = {
  maxAge: 15 * 24 * 60 * 60 * 1000,
  sameSite: "none",
  httpOnly: true,
  secure: true,
};