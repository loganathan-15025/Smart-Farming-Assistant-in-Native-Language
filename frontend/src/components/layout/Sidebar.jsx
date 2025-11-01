import React from "react";
import { MessageSquare, Calendar } from "lucide-react";
import QuickQuestions from "../features/QuickQuestions";
import DailyTips from "../features/DailyTips";
import CropCalendar from "../features/CropCalendar";

export default function Sidebar({
  showMenu,
  activeTab,
  onTabChange,
  onQuickQuestion,
}) {
  return (
    <aside
      className={`${
        showMenu ? "block" : "hidden"
      } lg:block w-full lg:w-64 flex flex-col overflow-hidden`}
    >
      {/* Tab Navigation */}
      <div className="rounded-2xl shadow-soft-lg p-2 bg-gradient-to-b from-white/95 to-gray-50/95 dark:from-gray-900/95 dark:to-gray-800/95 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 animate-slide-up flex-shrink-0 mb-3">
        <div className="flex gap-2 bg-gray-100/80 dark:bg-gray-800/80 p-1.5 rounded-xl shadow-inner backdrop-blur-sm">
          <button
            onClick={() => onTabChange("chat")}
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg transition-all duration-200 font-semibold ${
              activeTab === "chat"
                ? "bg-white dark:bg-gray-700 text-emerald-600 dark:text-emerald-400 shadow-soft hover:shadow-soft-lg ring-1 ring-emerald-500/20 dark:ring-emerald-400/20"
                : "text-gray-600 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-white/50 dark:hover:bg-gray-700/50"
            }`}
            aria-label="Chat tab"
            aria-pressed={activeTab === "chat"}
          >
            <MessageSquare className="w-4 h-4" />
            <span className="text-sm">அரட்டை</span>
          </button>
          <button
            onClick={() => onTabChange("calendar")}
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg transition-all duration-200 font-semibold ${
              activeTab === "calendar"
                ? "bg-white dark:bg-gray-700 text-emerald-600 dark:text-emerald-400 shadow-soft hover:shadow-soft-lg ring-1 ring-emerald-500/20 dark:ring-emerald-400/20"
                : "text-gray-600 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-white/50 dark:hover:bg-gray-700/50"
            }`}
            aria-label="Calendar tab"
            aria-pressed={activeTab === "calendar"}
          >
            <Calendar className="w-4 h-4" />
            <span className="text-sm">நாட்காட்டி</span>
          </button>
        </div>
      </div>

      {activeTab === "chat" ? (
        <div className="space-y-3 overflow-y-auto flex-1 min-h-0 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700 scrollbar-track-transparent">
          <QuickQuestions onQuickQuestion={onQuickQuestion} />
          <DailyTips />
        </div>
      ) : (
        <div className="flex-1 min-h-0 flex">
          <CropCalendar />
        </div>
      )}
    </aside>
  );
}
