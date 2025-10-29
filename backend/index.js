// backend/index.js

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import fetch from "node-fetch";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const APP_URL = "http://localhost:3000"; // Frontend URL
const APP_TITLE = "Tamil Chatbot";

// Health check endpoint
app.get("/", (req, res) => {
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

    console.log(`Question: ${question}`);
    console.log(`Model: deepseek`);
    console.log(`API URL: ${apiUrl}`);
    console.log(`Model Name: ${modelName}`);
    console.log(`API Key present: ${apiKey ? "Yes" : "No"}`);

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
        "HTTP-Referer": APP_URL,
        "X-Title": APP_TITLE,
      },
      body: JSON.stringify({
        model: modelName,
        messages: [{ role: "user", content: question }],
      }),
    });

    const data = await response.json();
    console.log(`Response status: ${response.status}`);
    console.log(`Response data:`, JSON.stringify(data, null, 2));

    if (!response.ok) {
      console.error(`DeepSeek API error:`, JSON.stringify(data, null, 2));
      console.error(`Status: ${response.status} ${response.statusText}`);
      return res.status(500).json({
        answer: "பின்தளத்தில் பிரச்சனை ஏற்பட்டது",
        error: data.error?.message || data.message || "Unknown error",
      });
    }

    const answer =
      data.choices?.[0]?.message?.content ||
      "மன்னிக்கவும், பதில் கிடைக்கவில்லை";
    res.json({ answer });
  } catch (error) {
    console.error("❌ Catch block error:");
    console.error("Error message:", error.message);
    console.error("Error stack:", error.stack);
    res.status(500).json({
      answer: "பின்தளத்தில் பிரச்சனை ஏற்பட்டது",
      debug: error.message,
    });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));

import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve React frontend static files
app.use(express.static(path.join(__dirname, "../frontend/build")));

// Catch-all route for React (Express 5 compatible)
app.get("/*splat", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/build", "index.html"));
});

