import React from "react";
import { farmingTips } from "../../data/farmingTips";

export default function DailyTips() {
  return (
    <div className="rounded-2xl shadow-lg p-3 bg-white/80 dark:bg-gray-900/60 backdrop-blur border border-black/5 dark:border-white/10">
      <h3 className="font-semibold text-gray-700 dark:text-gray-200 mb-2.5">
        இன்றைய குறிப்புகள்
      </h3>
      <div className="space-y-2.5">
        {farmingTips.map((tip, idx) => {
          const Icon = tip.icon;
          return (
            <div
              key={idx}
              className="p-2.5 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-xl"
            >
              <div className="flex items-center gap-2 mb-1">
                <div className="text-orange-600">
                  <Icon className="w-4 h-4" />
                </div>
                <h4 className="font-semibold text-sm text-gray-800 dark:text-gray-100">
                  {tip.title}
                </h4>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-300 ml-6">
                {tip.desc}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
