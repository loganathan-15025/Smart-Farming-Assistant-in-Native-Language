import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import fetch from "node-fetch"; // For Node < 20
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// --------------------
// API Routes
// --------------------

// Health-check route
app.get("/api", (req, res) => {
  res.json({
    message: "✅ Backend is running! Use POST /ask to send questions.",
  });
});

// Chat endpoint
app.post("/ask", async (req, res) => {
  try {
    const { question } = req.body;
    if (!question)
      return res.status(400).json({ answer: "No question provided" });

    const apiUrl = "https://openrouter.ai/api/v1/chat/completions";
    const apiKey = process.env.OPENROUTER_API_KEY;
    const modelName = "deepseek/deepseek-chat";

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
        "HTTP-Referer": process.env.APP_URL || "http://localhost:3000",
        "X-Title": process.env.APP_TITLE || "Tamil Chatbot",
      },
      body: JSON.stringify({
        model: modelName,
        messages: [{ role: "user", content: question }],
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(500).json({
        answer: "பின்தளத்தில் பிரச்சனை ஏற்பட்டது",
        error: data.error?.message || data.message || "Unknown error",
      });
    }

    const answer =
      data.choices?.[0]?.message?.content || "மன்னிக்கவும், பதில் கிடைக்கவில்லை";

    res.json({ answer });
  } catch (error) {
    res.status(500).json({
      answer: "பின்தளத்தில் பிரச்சனை ஏற்பட்டது",
      debug: error.message,
    });
  }
});

// --------------------
// Serve React Frontend
// --------------------

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static frontend files
app.use(express.static(path.join(__dirname, "../frontend/build")));

// Catch-all route for React (Express 5 compatible)
app.get("/*splat", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/build/index.html"));
});

// --------------------
// Start server
// --------------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
