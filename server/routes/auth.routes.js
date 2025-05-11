import { Router } from "express";
import { authController } from "../controllers/auth.controller.js";
import { isAuthenticated } from "../middlewares/auth.js";
import { singleAvatar } from "../middlewares/multer.js";
import { adminLoginValidator, loginValidator, registerValidator, validateHandler } from "../lib/validators.js";

const router = Router();

router.post("/register", singleAvatar, registerValidator(), validateHandler, authController.register);
router.post("/login", loginValidator(), validateHandler, authController.login);
router.post("/admin-login", adminLoginValidator(), validateHandler, authController.adminLogin);

router.get("/me", isAuthenticated, authController.getCurrentUser);
router.get("/logout", isAuthenticated, authController.logout);

export default router;
