import { Router } from "express";
import { adminController } from "../controllers/admin.controller.js";

const router = Router();

router.get("/", adminController.getAdminData);
router.get("/users", adminController.allUsers);
router.get("/chats", adminController.allChats);
router.get("/messages", adminController.allMessages);
router.get("/stats", adminController.getDashboardStats);

export default router;
