import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import bodyParser from 'body-parser';
import cors from "cors";
import webhookRoutes from "./routes/webhook.route.js";
import authRoutes from "./routes/auth.route.js";
import userRoutes from "./routes/user.route.js";
import parentRoutes from "./routes/parent.route.js";
import childRoutes from "./routes/child.route.js";
import menuRoutes from "./routes/menu.route.js";
import mealRoutes from "./routes/meal.route.js";
import ddRoutes from "./routes/dd.route.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { createFirstSuperUserHandle } from "./controllers/user.controller.js";

dotenv.config();

const app = express();

// Middlewares
app.use('/public', express.static('public'));
app.use(cors({ origin: "*" }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Connect to DB    
await connectDB();

// API Health Check
app.get("/api/health", (req, res) => res.status(200).json({ success: true, message: "API is running on healthy state at server-side !" }) );

// Routes
app.use("/webhook", webhookRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/parent", parentRoutes);
app.use("/api/child", childRoutes);
app.use("/api/menu", menuRoutes);
app.use("/api/meal", mealRoutes);
app.use("/api/dd", ddRoutes);

// Create Super Admin
app.post("/api/first-super-user-creation", createFirstSuperUserHandle);

// Error Handlers
app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Server listning on port : ${PORT}`));
