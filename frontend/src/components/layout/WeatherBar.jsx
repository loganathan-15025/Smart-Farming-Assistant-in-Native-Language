import React from 'react';
import { Cloud, Droplets } from 'lucide-react';

export default function WeatherBar({ weather }) {
  if (!weather) return null;

  return (
    <div className="mt-3 flex items-center gap-4 text-sm text-gray-600 bg-gradient-to-r from-blue-50 to-cyan-50 px-4 py-2 rounded-lg">
      <div className="flex items-center gap-2">
        <span className="text-2xl">{weather.icon}</span>
        <span className="font-medium">{weather.condition}</span>
      </div>
      <div className="flex items-center gap-2">
        <Cloud className="w-4 h-4" />
        <span>{weather.temp}°C</span>
      </div>
      <div className="flex items-center gap-2">
        <Droplets className="w-4 h-4" />
        <span>{weather.humidity}% ஈரப்பதம்</span>
      </div>
    </div>
  );
}