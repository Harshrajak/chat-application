import express from "express";
import { createServer } from "http";
import cookieParser from "cookie-parser";
import cors from "cors";
import { Server } from "socket.io";
import { configDotenv } from "dotenv";
import { connectDB } from "./config/database.js";
import { setupSocket } from "./socket/socket.js";
import { errorMiddleware } from "./middlewares/error.js";
import apiRoutes from "./routes/index.routes.js";
import { PORT, NODE_ENV, MONGO_URI, CORS_OPTIONS } from "./constants/index.js";

// Load Environment Variables
configDotenv({ path: "./.env" });

// Database Connection
connectDB(MONGO_URI);

// Initialize Express
const app = express();
const server = createServer(app);

// Initialize Socket.io
const io = new Server(server, { cors: CORS_OPTIONS });

// Set Express and Socket.io
app.set("io", io);

// Setup Common Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors(CORS_OPTIONS));

// Use consolidated routes
app.use("/", apiRoutes);

// Setup Socket.io
setupSocket(io);

// Error Middleware
app.use(errorMiddleware);

// Start Server
server.listen(PORT, () => {
  console.log(`🚀 Server is Running on PORT ${PORT} in ${NODE_ENV} Mode!`);
});

export { io };
