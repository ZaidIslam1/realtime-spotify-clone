import { Router } from "express";
import { getAllAlbums, getAlbumById } from "../controller/album.controller.js";

const router = Router();

router.get("/", getAllAlbums);              // optional (protectRoute)
router.get("/:albumId", getAlbumById);

export default router;