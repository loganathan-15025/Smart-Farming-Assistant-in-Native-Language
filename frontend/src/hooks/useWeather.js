import { useState, useEffect } from "react";

export const useWeather = (lat, lon) => {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (lat && lon) {
      fetchWeather(lat, lon);
    }
  }, [lat, lon]);

  const fetchWeather = async (latitude, longitude) => {
    try {
      setLoading(true);
      setError(null);

      const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
      const url = `${API_URL}/weather?lat=${latitude}&lon=${longitude}`;

      console.log("🌤️ Fetching weather from:", url);

      const response = await fetch(url);

      console.log("📡 Response status:", response.status);

      if (!response.ok) {
        const errorData = await response.json();
        console.error("❌ API Error:", errorData);
        throw new Error(errorData.details || "Weather data fetch failed");
      }

      const data = await response.json();
      console.log("✅ Weather data received:", data);

      setWeather(data);
      setLoading(false);
    } catch (err) {
      console.error("❌ Weather fetch error:", err);
      setError(err.message);
      setLoading(false);

      // Enhanced fallback with realistic data based on location
      const mockData = getMockWeatherData(latitude, longitude);
      console.log("⚠️ Using mock data:", mockData);
      setWeather(mockData);
    }
  };

  const getMockWeatherData = (lat, lon) => {
    // Generate semi-realistic weather based on coordinates
    const temp = Math.round(25 + (lat - 10) * 0.5 + Math.random() * 5);
    const humidity = Math.round(60 + Math.random() * 20);
    const conditions = [
      { condition: "தெளிவான வானம்", icon: "☀️" },
      { condition: "சிதறிய மேகங்கள்", icon: "☁️" },
      { condition: "லேசான மழை", icon: "🌦️" },
      { condition: "சில மேகங்கள்", icon: "🌤️" },
    ];
    const weather = conditions[Math.floor(lat * lon) % conditions.length];

    return {
      temp,
      humidity,
      condition: weather.condition,
      icon: weather.icon,
      windSpeed: Math.round((Math.random() * 5 + 2) * 10) / 10,
      feelsLike: temp + Math.round(Math.random() * 3 - 1),
    };
  };

  return { weather, loading, error, refreshWeather: fetchWeather };
};
