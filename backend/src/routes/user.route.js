import { Router } from "express";
import { getAllUsers, getMessages } from "../controller/user.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = Router();

router.use(protectRoute);

router.get("/", getAllUsers);
router.get("/messages/:otherUserId", getMessages); // rename param to match controller

export default router;
