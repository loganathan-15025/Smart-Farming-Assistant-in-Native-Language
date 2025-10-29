import React from 'react';
import { Leaf, Wifi, WifiOff, Menu, X } from 'lucide-react';
import { languages } from '../../data/languages';

export default function Header({ 
  isOnline, 
  language, 
  onLanguageChange, 
  showMenu, 
  onMenuToggle 
}) {
  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-2 rounded-xl">
              <Leaf className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">விவசாய உதவியாளர்</h1>
              <p className="text-xs text-gray-500">Smart Farming AI Assistant</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Online Status */}
            <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${
              isOnline ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            }`}>
              {isOnline ? <Wifi className="w-4 h-4" /> : <WifiOff className="w-4 h-4" />}
              <span className="text-xs font-medium">
                {isOnline ? 'ஆன்லைன்' : 'ஆஃப்லைன்'}
              </span>
            </div>

            {/* Language Selector */}
            <select 
              value={language}
              onChange={(e) => onLanguageChange(e.target.value)}
              className="px-3 py-1 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              {Object.entries(languages).map(([key, lang]) => (
                <option key={key} value={key}>{lang.name}</option>
              ))}
            </select>

            <button 
              onClick={onMenuToggle}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
            >
              {showMenu ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
