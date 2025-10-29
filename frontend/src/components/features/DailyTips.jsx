import React from 'react';
import { farmingTips } from '../../data/farmingTips';

export default function DailyTips() {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-4">
      <h3 className="font-semibold text-gray-700 mb-3">இன்றைய குறிப்புகள்</h3>
      <div className="space-y-3">
        {farmingTips.map((tip, idx) => {
          const Icon = tip.icon;
          return (
            <div key={idx} className="p-3 bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl">
              <div className="flex items-center gap-2 mb-1">
                <div className="text-orange-600">
                  <Icon className="w-4 h-4" />
                </div>
                <h4 className="font-semibold text-sm text-gray-800">{tip.title}</h4>
              </div>
              <p className="text-xs text-gray-600 ml-6">{tip.desc}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}