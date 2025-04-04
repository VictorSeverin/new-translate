import express, { Express, Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import morgan from "morgan";
import apiRoutes from "./routes";
import { CustomError } from "./types";
const { Server } = require("ws");
const { RTCPeerConnection } = require("wrtc");
const openai = require("openai");
const wss = new Server({ port: 8080 });
const pc = new RTCPeerConnection();
//const { initSocketServer } = require("../websockets/socket");
// Initialize Express app
const app: Express = express();

// Security middleware
app.use(helmet());

// CORS configuration
// app.use(
//   cors({
//     origin: process.env.FRONTEND_URL || "http://localhost:3000/live",
//     credentials: true,
//     methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
//     allowedHeaders: ["Content-Type", "Authorization"],
//   })
// );

// Request parsing middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Compression middleware
app.use(compression());

// Logging middleware
if (process.env.NODE_ENV !== "test") {
  app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));
}

// API routes
app.use("/api", apiRoutes);

// Health check endpoint
app.get("/health", (_req: Request, res: Response) => {
  res.status(200).json({ status: "OK", timestamp: new Date().toISOString() });
});

// WebSocket connections for audience clients
const audienceClients = new Set();
wss.on("connection", (ws) => audienceClients.add(ws));

// Handle WebRTC Offer from Admin
app.post("/start-stream", async (req, res) => {
  const offer = req.body.sdp;
  await pc.setRemoteDescription({ type: "offer", sdp: offer });
  const answer = await pc.createAnswer();
  await pc.setLocalDescription(answer);
  res.json({ sdp: pc.localDescription.sdp });
});

// Capture audio track from Admin
pc.ontrack = async (event) => {
  const audioStream = event.streams[0];
  const transcript = await openai.Audio.transcribe("whisper-1", audioStream);
  const translation = await openai.ChatCompletion.create({
    model: "gpt-4-turbo",
    messages: [{ role: "user", content: transcript }],
  });

  // Send transcript & translation to audience via WebSockets
  const message = JSON.stringify({
    transcript,
    translation: translation.choices[0].message.content,
  });
  audienceClients.forEach((client) => client.send(message));
};

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    error: "Not Found",
    message: `Route ${req.method} ${req.originalUrl} not found`,
  });
});

// Error handling middleware
app.use(
  (err: CustomError, _req: Request, res: Response, _next: NextFunction) => {
    console.error("Error:", err);

    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(statusCode).json({
      error: err.name || "Error",
      message,
      stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
    });
  }
);

export default app;
