import express from "express";
import dotenv from "dotenv";
import { clerkMiddleware } from '@clerk/express';
import fileUpload from "express-fileUpload";
import path from "path";
import cors from "cors";
import { createServer } from "http";
import { connectDB } from "./lib/db.js";
import {initializeSocket} from "./lib/socket.js";
import cron from "node-cron";


import userRoutes from "./routes/user.route.js"; 
import adminRoutes from "./routes/admin.route.js";
import authRoutes from "./routes/auth.route.js";
import songRoutes from "./routes/song.route.js";
import albumRoutes from "./routes/album.route.js";
import statRoutes from "./routes/stat.route.js";

dotenv.config();
const __dirname = path.resolve();
const app = express();
const PORT = process.env.PORT;

const httpServer = createServer(app);
initializeSocket(httpServer);

app.use(cors({
    origin: "http://localhost:3000",
    credentials: true
}));

app.use(express.json());        // Tool to parse req.body
app.use(clerkMiddleware());     // Tool to add auth to req obj => req.auth
app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: path.join(__dirname, "tmp"),
    createParentPath: true,
    limits: { fileSize: 10 * 1024 * 1024} // 10MB max file size
}));

app.use("/api/users", userRoutes); 
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/songs", songRoutes);
app.use("/api/albums", albumRoutes);
app.use("/api/stats", statRoutes);

if (process.env.NODE_ENV === "production"){
    app.use(express.static(path.join(__dirname, "../frontend/dist")));
    app.get("*", (req, res) => {
        res.sendFile(path.resolve(__dirname, "../frontend/dist/index.html"));
    })
}

app.use((err,req,res,next) => {
    res.status(500).json({message: process.env.NODE_ENV === "development" ? err.message : "Internal server error"});
});

httpServer.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    connectDB();
});


// todo: socket.io