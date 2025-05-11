import { Router } from "express";
import { userController } from "../controllers/user.controller.js";
import { acceptRequestValidator, sendRequestValidator, validateHandler } from "../lib/validators.js";

const router = Router();

router.get("/search", userController.searchUser);
router.get("/friends", userController.getMyFriends);
router.get("/notifications", userController.getMyNotifications);
router.put("/sendrequest", sendRequestValidator(), validateHandler, userController.sendFriendRequest);
router.put("/acceptrequest", acceptRequestValidator(), validateHandler, userController.acceptFriendRequest);

export default router;
