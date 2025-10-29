import { useState, useEffect } from 'react';

export const useWeather = () => {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWeather();
  }, []);

  const fetchWeather = async () => {
    try {
      // Mock weather data - Replace with real API in production
      // You can use OpenWeatherMap API or similar
      setWeather({
        temp: 28,
        condition: "மேகமூட்டம்",
        humidity: 65,
        icon: "☁️"
      });
      setLoading(false);
    } catch (error) {
      console.error("Weather fetch error:", error);
      setLoading(false);
    }
  };

  return { weather, loading, refreshWeather: fetchWeather };
};
