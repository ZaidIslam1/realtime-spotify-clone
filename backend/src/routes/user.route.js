import { Router } from "express";
import { getAllUsers, getMessages } from "../controller/user.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = Router();

router.use(protectRoute); // Calls these functions on each route 

router.get("/", getAllUsers);
router.get("/messages/:userId", getMessages); 

export default router;
