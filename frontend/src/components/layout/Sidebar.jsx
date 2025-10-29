import React from 'react';
import { MessageSquare, Calendar } from 'lucide-react';
import QuickQuestions from '../features/QuickQuestions';
import DailyTips from '../features/DailyTips';
import CropCalendar from '../features/CropCalendar';

export default function Sidebar({ 
  showMenu, 
  activeTab, 
  onTabChange, 
  onQuickQuestion 
}) {
  return (
    <aside className={`${showMenu ? 'block' : 'hidden'} lg:block w-full lg:w-64 space-y-4`}>
      {/* Tab Navigation */}
      <div className="bg-white rounded-2xl shadow-lg p-2">
        <div className="flex gap-2">
          <button
            onClick={() => onTabChange('chat')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg transition-all ${
              activeTab === 'chat' 
                ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white' 
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span className="text-sm">அரட்டை</span>
          </button>
          <button
            onClick={() => onTabChange('calendar')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg transition-all ${
              activeTab === 'calendar' 
                ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white' 
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span className="text-sm">நாட்காட்டி</span>
          </button>
        </div>
      </div>

      {activeTab === 'chat' ? (
        <>
          <QuickQuestions onQuickQuestion={onQuickQuestion} />
          <DailyTips />
        </>
      ) : (
        <CropCalendar />
      )}
    </aside>
  );
}