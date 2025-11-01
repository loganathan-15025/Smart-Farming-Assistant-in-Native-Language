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
  const [mobilePickerOpen, setMobilePickerOpen] = useState(false);

  const handleDistrictSelect = (district) => {
    onDistrictChange(district);
    setIsOpen(false);
  };

  if (!weather) return null;

  return (
    <div className="mt-2 sm:mt-4 animate-fade-in">
      {/* Mobile: compact marquee ticker */}
      <div className="sm:hidden">
        <div className="px-0 py-1 rounded-none sm:rounded-xl border-0 sm:border border-blue-100/50 dark:border-blue-800/30 bg-gradient-to-r from-sky-50 via-blue-50 to-cyan-50 dark:from-blue-950/50 dark:via-sky-900/30 dark:to-cyan-900/30">
          <div
            className="marquee"
            onClick={() => setMobilePickerOpen(true)}
            role="button"
            aria-label="Select district"
          >
            <div
              className={`marquee-track gap-6 py-0.5 ${
                mobilePickerOpen ? "marquee-paused" : ""
              }`}
            >
              <div className="flex items-center gap-3 text-[11px] text-gray-700 dark:text-gray-200 whitespace-nowrap">
                <MapPin className="w-3 h-3 text-blue-600 dark:text-blue-400" />
                <span className="font-semibold text-gray-900 dark:text-gray-100">
                  {selectedDistrict?.name}
                </span>
                <span className="text-base drop-shadow-sm">{weather.icon}</span>
                <span className="font-medium text-gray-900 dark:text-gray-100">
                  {weather.condition}
                </span>
                <span className="font-bold text-orange-700 dark:text-orange-300">
                  {weather.temp}°C
                </span>
                {weather.feelsLike && (
                  <span className="text-[10px] text-orange-600/80 dark:text-orange-400/80">
                    உணர்வு {weather.feelsLike}°C
                  </span>
                )}
                <Droplets className="w-3 h-3 text-blue-600 dark:text-blue-400" />
                <span className="font-semibold text-blue-700 dark:text-blue-300">
                  {weather.humidity}%
                </span>
                {weather.windSpeed && (
                  <>
                    <Wind className="w-3 h-3 text-gray-600 dark:text-gray-400" />
                    <span className="font-semibold text-gray-700 dark:text-gray-300">
                      {weather.windSpeed} m/s
                    </span>
                  </>
                )}
              </div>
              {/* duplicate for seamless loop */}
              <div
                aria-hidden="true"
                className="flex items-center gap-3 text-[11px] text-gray-700 dark:text-gray-200 whitespace-nowrap ml-6"
              >
                <MapPin className="w-3 h-3 text-blue-600 dark:text-blue-400" />
                <span className="font-semibold text-gray-900 dark:text-gray-100">
                  {selectedDistrict?.name}
                </span>
                <span className="text-base drop-shadow-sm">{weather.icon}</span>
                <span className="font-medium text-gray-900 dark:text-gray-100">
                  {weather.condition}
                </span>
                <span className="font-bold text-orange-700 dark:text-orange-300">
                  {weather.temp}°C
                </span>
                {weather.feelsLike && (
                  <span className="text-[10px] text-orange-600/80 dark:text-orange-400/80">
                    உணர்வு {weather.feelsLike}°C
                  </span>
                )}
                <Droplets className="w-3 h-3 text-blue-600 dark:text-blue-400" />
                <span className="font-semibold text-blue-700 dark:text-blue-300">
                  {weather.humidity}%
                </span>
                {weather.windSpeed && (
                  <>
                    <Wind className="w-3 h-3 text-gray-600 dark:text-gray-400" />
                    <span className="font-semibold text-gray-700 dark:text-gray-300">
                      {weather.windSpeed} m/s
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tablet/Desktop: detailed layout */}
      <div className="hidden sm:flex flex-wrap items-center gap-3 sm:gap-5 text-xs sm:text-sm text-gray-700 dark:text-gray-200 bg-gradient-to-r from-sky-50 via-blue-50 to-cyan-50 dark:from-blue-950/50 dark:via-sky-900/30 dark:to-cyan-900/30 px-3 py-2 sm:px-5 sm:py-4 rounded-2xl border border-blue-100/50 dark:border-blue-800/30 shadow-soft hover:shadow-soft-lg transition-all duration-300">
        {/* District Selector */}
        <div className="relative">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-2 px-3 py-1.5 sm:gap-2.5 sm:px-4 sm:py-2 rounded-lg sm:rounded-xl bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm hover:bg-white dark:hover:bg-gray-800 transition-all duration-200 border border-gray-200/50 dark:border-gray-700/50 shadow-soft hover:shadow-soft-lg hover:scale-[1.02] active:scale-95"
          >
            <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-600 dark:text-blue-400" />
            <span className="font-semibold text-gray-900 dark:text-gray-100 truncate max-w-[10rem] sm:max-w-none">
              {selectedDistrict?.name || "மாவட்டம் தேர்வு"}
            </span>
            <ChevronDown
              className={`w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-500 transition-transform duration-300 ${
                isOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {/* Dropdown Menu */}
          {isOpen && (
            <div className="absolute top-full mt-2 sm:mt-3 left-0 bg-white dark:bg-gray-800 rounded-2xl shadow-soft-xl border border-gray-200/50 dark:border-gray-700/50 z-50 max-h-64 sm:max-h-80 overflow-y-auto w-56 sm:w-72 animate-scale-in backdrop-blur-xl">
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
        <div className="flex items-center gap-3 sm:gap-6 flex-1 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="text-2xl sm:text-3xl drop-shadow-sm">
              {weather.icon}
            </span>
            <span className="font-semibold text-gray-900 dark:text-gray-100">
              {weather.condition}
            </span>
          </div>

          <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-orange-50 dark:bg-orange-900/20 ring-1 ring-orange-200 dark:ring-orange-800/30">
            <Thermometer className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-orange-600 dark:text-orange-400" />
            <span className="font-bold text-base sm:text-lg text-orange-700 dark:text-orange-300">
              {weather.temp}°C
            </span>
            {weather.feelsLike && (
              <span className="text-[10px] sm:text-xs text-orange-600/70 dark:text-orange-400/70 font-medium">
                உணர்வு {weather.feelsLike}°C
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-900/20 ring-1 ring-blue-200 dark:ring-blue-800/30">
            <Droplets className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-600 dark:text-blue-400" />
            <span className="font-semibold text-blue-700 dark:text-blue-300">
              {weather.humidity}%
            </span>
            <span className="text-[10px] sm:text-xs text-blue-600/70 dark:text-blue-400/70">
              ஈரப்பதம்
            </span>
          </div>

          {weather.windSpeed && (
            <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-gray-50 dark:bg-gray-800/50 ring-1 ring-gray-200 dark:ring-gray-700/50">
              <Wind className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-600 dark:text-gray-400" />
              <span className="font-semibold text-gray-700 dark:text-gray-300">
                {weather.windSpeed}
              </span>
              <span className="text-[10px] sm:text-xs text-gray-600/70 dark:text-gray-400/70">
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

      {/* Mobile district picker overlay */}
      {mobilePickerOpen && (
        <div
          className="sm:hidden fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
          onClick={() => setMobilePickerOpen(false)}
        >
          <div
            className="absolute bottom-0 left-0 right-0 bg-white dark:bg-gray-900 rounded-t-2xl shadow-soft-xl border-t border-gray-200/50 dark:border-gray-700/50 p-3 max-h-[75vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-100">
                மாவட்டம் தேர்வு
              </h3>
              <button
                onClick={() => setMobilePickerOpen(false)}
                className="px-2 py-1 rounded-lg text-xs bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200"
              >
                மூடு
              </button>
            </div>
            <div className="space-y-1">
              {tamilNaduDistricts.map((district) => (
                <button
                  key={district.nameEn}
                  onClick={() => {
                    onDistrictChange(district);
                    setMobilePickerOpen(false);
                  }}
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
        </div>
      )}
    </div>
  );
}
