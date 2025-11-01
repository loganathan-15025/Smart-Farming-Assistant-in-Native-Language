import React from "react";
import { MessageSquare } from "lucide-react";
import { quickQuestions } from "../../data/quickQuestions";

export default function QuickQuestions({ onQuickQuestion }) {
  return (
    <div className="rounded-2xl shadow-lg p-3 bg-white/80 dark:bg-gray-900/60 backdrop-blur border border-black/5 dark:border-white/10 flex flex-col overflow-hidden h-full">
      <h3 className="font-semibold text-gray-700 dark:text-gray-200 mb-2 flex items-center gap-2 flex-shrink-0">
        <MessageSquare className="w-4 h-4 text-green-600" />
        விரைவு கேள்விகள்
      </h3>
      <div className="space-y-2 flex-1 min-h-0 overflow-y-auto pr-1 scrollbar-none">
        {quickQuestions.map((q, idx) => {
          const Icon = q.icon;
          return (
            <button
              key={idx}
              onClick={() => onQuickQuestion(q.text)}
              className="w-full flex items-center gap-2.5 p-2.5 bg-gradient-to-r from-green-50 to-emerald-50 hover:from-green-100 hover:to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-800/10 dark:hover:from-emerald-900/30 dark:hover:to-emerald-800/20 rounded-xl transition-all text-left text-sm"
            >
              <div className="text-green-600">
                <Icon className="w-4 h-4" />
              </div>
              <span className="text-gray-700 dark:text-gray-200">{q.text}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
