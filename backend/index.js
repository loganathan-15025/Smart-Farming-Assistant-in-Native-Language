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
    "http://localhost:3001", // Alternative local port
    "https://smart-farming-assistant-in-native.onrender.com", // Backend URL
    "https://smart-farming-assistant-xm95.onrender.com", // Add your ACTUAL frontend URL here when you deploy it
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

    console.log(`Question: ${question}`);
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

// Weather endpoint
app.get("/weather", async (req, res) => {
  try {
    const { lat, lon } = req.query;

    console.log(`🌤️ Weather request for: lat=${lat}, lon=${lon}`);

    if (!lat || !lon) {
      return res.status(400).json({ error: "Latitude and longitude required" });
    }

    const apiKey = process.env.OPENWEATHER_API_KEY;
    console.log(
      `API Key present: ${apiKey ? "Yes" : "No"}, Length: ${apiKey?.length}`
    );

    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=ta`;

    console.log(`Fetching weather from OpenWeatherMap...`);
    const response = await fetch(url);
    const data = await response.json();

    console.log(`Response Status: ${response.status}`);
    console.log(`Response Data:`, JSON.stringify(data, null, 2));

    if (!response.ok) {
      console.error("❌ OpenWeather API error:", data);
      return res.status(500).json({
        error: "Weather API error",
        details: data.message || "Unknown error",
        statusCode: response.status,
      });
    }

    // Format response
    const weatherData = {
      temp: Math.round(data.main.temp),
      humidity: data.main.humidity,
      condition: translateWeatherToTamil(
        data.weather[0].description || "தெளிவான வானம்"
      ),
      icon: getWeatherEmoji(data.weather[0].id),
      windSpeed: Math.round(data.wind.speed * 10) / 10,
      feelsLike: Math.round(data.main.feels_like),
    };

    console.log(`✅ Sending weather data:`, weatherData);
    res.json(weatherData);
  } catch (error) {
    console.error("❌ Weather endpoint error:", error.message);
    console.error("Stack:", error.stack);
    res.status(500).json({
      error: "Failed to fetch weather data",
      details: error.message,
    });
  }
});

// Helper function to get weather emoji
function getWeatherEmoji(weatherId) {
  if (weatherId >= 200 && weatherId < 300) return "⛈️"; // Thunderstorm
  if (weatherId >= 300 && weatherId < 400) return "🌦️"; // Drizzle
  if (weatherId >= 500 && weatherId < 600) return "🌧️"; // Rain
  if (weatherId >= 600 && weatherId < 700) return "❄️"; // Snow
  if (weatherId >= 700 && weatherId < 800) return "🌫️"; // Atmosphere
  if (weatherId === 800) return "☀️"; // Clear
  if (weatherId > 800) return "☁️"; // Clouds
  return "🌤️";
}

// Helper function to translate weather conditions to Tamil
function translateWeatherToTamil(condition) {
  const translations = {
    // Clear
    "clear sky": "தெளிவான வானம்",
    clear: "தெளிவானது",

    // Clouds
    "few clouds": "சில மேகங்கள்",
    "scattered clouds": "சிதறிய மேகங்கள்",
    "broken clouds": "உடைந்த மேகங்கள்",
    "overcast clouds": "முழுமையான மேக மூட்டம்",
    clouds: "மேகங்கள்",

    // Rain
    "light rain": "லேசான மழை",
    "moderate rain": "மிதமான மழை",
    "heavy intensity rain": "கனமழை",
    "very heavy rain": "மிக கனமழை",
    "extreme rain": "விபரீத மழை",
    "freezing rain": "உறையமழை",
    "light intensity shower rain": "லேசான தூறல் மழை",
    "shower rain": "தூறல் மழை",
    "heavy intensity shower rain": "கனத் தூறல் மழை",
    "ragged shower rain": "இடைவிடா தூறல் மழை",
    rain: "மழை",

    // Drizzle
    "light intensity drizzle": "லேசான தூறல்",
    drizzle: "தூறல்",
    "heavy intensity drizzle": "கனத் தூறல்",
    "light intensity drizzle rain": "லேசான தூறல் மழை",
    "drizzle rain": "தூறல் மழை",
    "heavy intensity drizzle rain": "கனத் தூறல் மழை",
    "shower rain and drizzle": "தூறலுடன் மழை",
    "heavy shower rain and drizzle": "கனத் தூறலுடன் மழை",
    "shower drizzle": "தூறல்",

    // Thunderstorm
    "thunderstorm with light rain": "லேசான மழையுடன் மின்னல்",
    "thunderstorm with rain": "மழையுடன் மின்னல்",
    "thunderstorm with heavy rain": "கனமழையுடன் மின்னல்",
    "light thunderstorm": "லேசான மின்னல்",
    thunderstorm: "மின்னல்",
    "heavy thunderstorm": "கன மின்னல்",
    "ragged thunderstorm": "இடைவிடா மின்னல்",
    "thunderstorm with light drizzle": "லேசான தூறலுடன் மின்னல்",
    "thunderstorm with drizzle": "தூறலுடன் மின்னல்",
    "thunderstorm with heavy drizzle": "கனத் தூறலுடன் மின்னல்",

    // Snow
    "light snow": "லேசான பனி",
    snow: "பனி",
    "heavy snow": "கன பனி",
    sleet: "பனி மழை",
    "light shower sleet": "லேசான பனி மழை",
    "shower sleet": "பனி மழை",
    "light rain and snow": "மழை மற்றும் பனி",
    "rain and snow": "மழையும் பனியும்",
    "light shower snow": "லேசான பனி தூறல்",
    "shower snow": "பனி தூறல்",
    "heavy shower snow": "கன பனி தூறல்",

    // Atmosphere
    mist: "மூடுபனி",
    smoke: "புகை",
    haze: "புகை மூட்டம்",
    "sand/dust whirls": "மணல்/தூசி சுழல்",
    fog: "மூடுபனி",
    sand: "மணல்",
    dust: "தூசி",
    "volcanic ash": "எரிமலை சாம்பல்",
    squalls: "சூறாவளி",
    tornado: "சுழலும் காற்று",
  };

  // Convert to lowercase for matching
  const lowerCondition = condition.toLowerCase();

  // Return translation or original if not found
  return translations[lowerCondition] || condition;
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`); // Fixed
  console.log(`Environment: ${process.env.NODE_ENV || "development"}`); // Fixed
});
