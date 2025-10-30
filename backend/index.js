import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import fetch from "node-fetch";

dotenv.config();
const app = express();

// CORS Configuration - IMPORTANT!
const corsOptions = {
  origin: [
    "http://localhost:3000", // Local development
    "https://smart-farming-assistant-in-native.onrender.com", // Backend URL
    // Add your ACTUAL frontend URL here when you deploy it
  ],
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.json());

const APP_URL = process.env.APP_URL || "http://localhost:3000";
const APP_TITLE = "Tamil Chatbot";

// Health check endpoint
app.get("/", (req, res) => {
  res.json({
    message: "✅ Backend is running! Use POST /ask to send questions.",
    timestamp: new Date().toISOString(),
  });
});

// Chat endpoint
app.post("/ask", async (req, res) => {
  try {
    const { question } = req.body;

    console.log("Received question:", question);

    if (!question) {
      return res.status(400).json({ answer: "No question provided" });
    }

    const apiUrl = "https://openrouter.ai/api/v1/chat/completions";
    const apiKey = process.env.OPENROUTER_API_KEY;
    const modelName = "deepseek/deepseek-chat";

    console.log(`Question: ${question}`); // Fixed: Changed from console.log` to console.log(
    console.log(`API Key present: ${apiKey ? "Yes" : "No"}`); // Fixed

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
        messages: [
          {
            role: "system",
            content:
              "நீங்கள் ஒரு விவசாய உதவியாளர். எப்போதும் தமிழில் மட்டுமே பதில் அளிக்கவும். You are a farming assistant. Always respond ONLY in Tamil language.",
          },
          {
            role: "user",
            content: question,
          },
        ],
      }),
    });

    const data = await response.json();
    console.log(`Response status: ${response.status}`); // Fixed

    if (!response.ok) {
      console.error(`DeepSeek API error:`, JSON.stringify(data, null, 2)); // Fixed
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
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`); // Fixed
  console.log(`Environment: ${process.env.NODE_ENV || "development"}`); // Fixed
});
