import React from "react";
import { Calendar, Leaf } from "lucide-react";
import { cropCalendar } from "../../data/cropCalendar";

// Season color mapping for visual distinction
const seasonColors = {
  குளிர்காலம்: {
    bg: "from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20",
    badge: "bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300",
    border: "border-blue-200/50 dark:border-blue-700/30",
    icon: "text-blue-600 dark:text-blue-400",
  },
  கோடை: {
    bg: "from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20",
    badge:
      "bg-orange-100 dark:bg-orange-900/40 text-orange-700 dark:text-orange-300",
    border: "border-orange-200/50 dark:border-orange-700/30",
    icon: "text-orange-600 dark:text-orange-400",
  },
  மழைக்காலம்: {
    bg: "from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20",
    badge:
      "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300",
    border: "border-emerald-200/50 dark:border-emerald-700/30",
    icon: "text-emerald-600 dark:text-emerald-400",
  },
  இலையுதிர்காலம்: {
    bg: "from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20",
    badge:
      "bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300",
    border: "border-amber-200/50 dark:border-amber-700/30",
    icon: "text-amber-600 dark:text-amber-400",
  },
};

export default function CropCalendar() {
  return (
    <div className="rounded-2xl shadow-soft-lg p-3 bg-gradient-to-b from-white/95 to-gray-50/95 dark:from-gray-900/95 dark:to-gray-800/95 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 flex flex-col h-full overflow-hidden">
      <h3 className="font-bold text-gray-800 dark:text-gray-100 mb-2.5 flex items-center gap-2 text-sm flex-shrink-0">
        <Calendar className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
        பயிர் நாட்காட்டி
      </h3>
      <div className="space-y-2.5 overflow-y-auto pr-1 flex-1 min-h-0 scrollbar-none">
        {cropCalendar.map((item, idx) => {
          const colors =
            seasonColors[item.season] || seasonColors["குளிர்காலம்"];
          return (
            <div
              key={idx}
              className={`group p-3 bg-gradient-to-br ${colors.bg} rounded-xl border ${colors.border} shadow-soft hover:shadow-soft-lg transition-all duration-200 hover:scale-[1.02]`}
            >
              {/* Month & Season Header */}
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-bold text-sm text-gray-800 dark:text-gray-100 flex items-center gap-1.5">
                  <Calendar className={`w-3.5 h-3.5 ${colors.icon}`} />
                  {item.month}
                </h4>
                <span
                  className={`text-xs px-2.5 py-0.5 rounded-full font-semibold ${colors.badge} shadow-sm`}
                >
                  {item.season}
                </span>
              </div>

              {/* Crops Grid */}
              <div className="grid grid-cols-1 gap-1.5">
                {item.crops.map((crop, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-1.5 text-xs bg-white/80 dark:bg-gray-800/60 px-2.5 py-1.5 rounded-lg text-gray-700 dark:text-gray-200 font-medium shadow-sm backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 hover:scale-105 transition-transform duration-200"
                  >
                    <Leaf className={`w-3 h-3 ${colors.icon}`} />
                    {crop}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
