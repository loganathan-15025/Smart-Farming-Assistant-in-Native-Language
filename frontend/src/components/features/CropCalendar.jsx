import React from 'react';
import { Calendar } from 'lucide-react';
import { cropCalendar } from '../../data/cropCalendar';

export default function CropCalendar() {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-4">
      <h3 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
        <Calendar className="w-5 h-5 text-green-600" />
        பயிர் நாட்காட்டி
      </h3>
      <div className="space-y-3">
        {cropCalendar.map((item, idx) => (
          <div key={idx} className="p-3 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-semibold text-sm text-gray-800">{item.month}</h4>
              <span className="text-xs bg-white px-2 py-1 rounded-full text-purple-600">
                {item.season}
              </span>
            </div>
            <div className="flex flex-wrap gap-1">
              {item.crops.map((crop, i) => (
                <span key={i} className="text-xs bg-white px-2 py-1 rounded-full text-gray-700">
                  {crop}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
