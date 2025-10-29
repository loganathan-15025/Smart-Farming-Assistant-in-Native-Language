import React from 'react';
import { MessageSquare } from 'lucide-react';
import { quickQuestions } from '../../data/quickQuestions';

export default function QuickQuestions({ onQuickQuestion }) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-4">
      <h3 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
        <MessageSquare className="w-5 h-5 text-green-600" />
        விரைவு கேள்விகள்
      </h3>
      <div className="space-y-2">
        {quickQuestions.map((q, idx) => {
          const Icon = q.icon;
          return (
            <button
              key={idx}
              onClick={() => onQuickQuestion(q.text)}
              className="w-full flex items-center gap-3 p-3 bg-gradient-to-r from-green-50 to-emerald-50 hover:from-green-100 hover:to-emerald-100 rounded-xl transition-all text-left text-sm"
            >
              <div className="text-green-600">
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-gray-700">{q.text}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}