import React, { useState } from "react";
import {
  Cloud,
  Droplets,
  MapPin,
  ChevronDown,
  Wind,
  Thermometer,
} from "lucide-react";
import { tamilNaduDistricts } from "../../data/tamilNaduDistricts";

export default function WeatherBar({
  weather,
  onDistrictChange,
  selectedDistrict,
}) {
  const [isOpen, setIsOpen] = useState(false);

  const handleDistrictSelect = (district) => {
    onDistrictChange(district);
    setIsOpen(false);
  };

  if (!weather) return null;

  return (
    <div className="mt-4 animate-fade-in">
      <div className="flex items-center gap-5 text-sm text-gray-700 dark:text-gray-200 bg-gradient-to-r from-sky-50 via-blue-50 to-cyan-50 dark:from-blue-950/50 dark:via-sky-900/30 dark:to-cyan-900/30 px-5 py-4 rounded-2xl border border-blue-100/50 dark:border-blue-800/30 shadow-soft hover:shadow-soft-lg transition-all duration-300">
        {/* District Selector */}
        <div className="relative">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-2.5 px-4 py-2 rounded-xl bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm hover:bg-white dark:hover:bg-gray-800 transition-all duration-200 border border-gray-200/50 dark:border-gray-700/50 shadow-soft hover:shadow-soft-lg hover:scale-[1.02] active:scale-95"
          >
            <MapPin className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span className="font-semibold text-gray-900 dark:text-gray-100">
              {selectedDistrict?.name || "மாவட்டம் தேர்வு"}
            </span>
            <ChevronDown
              className={`w-4 h-4 text-gray-500 transition-transform duration-300 ${
                isOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {/* Dropdown Menu */}
          {isOpen && (
            <div className="absolute top-full mt-3 left-0 bg-white dark:bg-gray-800 rounded-2xl shadow-soft-xl border border-gray-200/50 dark:border-gray-700/50 z-50 max-h-80 overflow-y-auto w-72 animate-scale-in backdrop-blur-xl">
              <div className="p-2 space-y-0.5">
                {tamilNaduDistricts.map((district) => (
                  <button
                    key={district.nameEn}
                    onClick={() => handleDistrictSelect(district)}
                    className={`w-full text-left px-4 py-2.5 rounded-xl transition-all duration-200 font-medium ${
                      selectedDistrict?.nameEn === district.nameEn
                        ? "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 ring-1 ring-blue-200 dark:ring-blue-800/50 shadow-soft"
                        : "hover:bg-gray-50 dark:hover:bg-gray-700/50 text-gray-700 dark:text-gray-200"
                    }`}
                  >
                    {district.name}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Weather Info */}
        <div className="flex items-center gap-6 flex-1 flex-wrap">
          <div className="flex items-center gap-2.5">
            <span className="text-3xl drop-shadow-sm">{weather.icon}</span>
            <span className="font-semibold text-gray-900 dark:text-gray-100">
              {weather.condition}
            </span>
          </div>

          <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-orange-50 dark:bg-orange-900/20 ring-1 ring-orange-200 dark:ring-orange-800/30">
            <Thermometer className="w-4 h-4 text-orange-600 dark:text-orange-400" />
            <span className="font-bold text-lg text-orange-700 dark:text-orange-300">
              {weather.temp}°C
            </span>
            {weather.feelsLike && (
              <span className="text-xs text-orange-600/70 dark:text-orange-400/70 font-medium">
                உணர்வு {weather.feelsLike}°C
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-900/20 ring-1 ring-blue-200 dark:ring-blue-800/30">
            <Droplets className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span className="font-semibold text-blue-700 dark:text-blue-300">
              {weather.humidity}%
            </span>
            <span className="text-xs text-blue-600/70 dark:text-blue-400/70">
              ஈரப்பதம்
            </span>
          </div>

          {weather.windSpeed && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gray-50 dark:bg-gray-800/50 ring-1 ring-gray-200 dark:ring-gray-700/50">
              <Wind className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              <span className="font-semibold text-gray-700 dark:text-gray-300">
                {weather.windSpeed}
              </span>
              <span className="text-xs text-gray-600/70 dark:text-gray-400/70">
                m/s
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Click outside to close */}
      {isOpen && (
        <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
      )}
    </div>
  );
}
