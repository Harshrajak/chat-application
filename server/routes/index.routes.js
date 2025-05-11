import express from "express";
import { isAuthenticated, isAdmin } from "../middlewares/auth.js";

import authRoute from "./auth.routes.js";
import userRoute from "./user.routes.js";
import chatRoute from "./chat.routes.js";
import adminRoute from "./admin.routes.js";

const router = express.Router();

router.get("/", (req, res) => {
  return res.status(200).json({ success: true, message: "Server is running!" });
});

// Define route prefixes
router.use("/api/v1/auth", authRoute);
router.use("/api/v1/user", isAuthenticated, userRoute);
router.use("/api/v1/chat", isAuthenticated, chatRoute);
router.use("/api/v1/admin", isAdmin, adminRoute);

export default router;
