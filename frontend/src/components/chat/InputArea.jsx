import React, { useRef } from "react";
import { Mic, Send, Volume2, VolumeX, Image } from "lucide-react";

export default function InputArea({
  question,
  onQuestionChange,
  onSend,
  isListening,
  isSpeaking,
  onToggleSpeaker,
  onStartVoice,
  onImageUpload,
  disabled,
}) {
  const fileInputRef = useRef(null);

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !disabled) {
      onSend();
    }
  };

  return (
    <div className="border-t border-gray-200/50 dark:border-gray-700/50 p-3 bg-gradient-to-r from-emerald-50/50 via-green-50/50 to-emerald-50/50 dark:from-gray-900/50 dark:via-gray-800/30 dark:to-gray-900/50 backdrop-blur-sm">
      <div className="flex items-end gap-2">
        {/* Speaker Toggle */}
        <button
          onClick={onToggleSpeaker}
          className={`p-2.5 rounded-lg transition-all duration-200 hover:scale-105 active:scale-95 ${
            isSpeaking
              ? "bg-gradient-to-br from-emerald-500 to-green-600 text-white shadow-soft-lg"
              : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 shadow-soft hover:shadow-soft-lg"
          }`}
          title={isSpeaking ? "குரல் பதில் நிறுத்து" : "குரல் பதில் இயக்கு"}
          aria-label={
            isSpeaking ? "Disable voice response" : "Enable voice response"
          }
        >
          {isSpeaking ? (
            <Volume2 className="w-4 h-4" />
          ) : (
            <VolumeX className="w-4 h-4" />
          )}
        </button>

        {/* Image Upload */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={(e) => onImageUpload(e.target.files[0])}
          accept="image/*"
          className="hidden"
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          className="p-2.5 bg-white dark:bg-gray-800 rounded-lg text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/30 shadow-soft hover:shadow-soft-lg transition-all duration-200 hover:scale-105 active:scale-95"
          title="படம் பதிவேற்று"
          aria-label="Upload image"
        >
          <Image className="w-4 h-4" />
        </button>

        {/* Text Input */}
        <div className="flex-1 bg-white/95 dark:bg-gray-800/70 rounded-xl shadow-soft dark:shadow-soft-lg flex items-center gap-3 px-4 py-2.5 border border-gray-200/50 dark:border-gray-700/50 focus-within:ring-2 focus-within:ring-emerald-500/50 dark:focus-within:ring-emerald-400/50 focus-within:border-emerald-500/50 dark:focus-within:border-emerald-400/50 transition-all duration-200 backdrop-blur-sm focus-within:shadow-soft-lg">
          <input
            type="text"
            placeholder="உங்கள் கேள்வியை இங்கே தட்டச்சு செய்யவும்..."
            value={question}
            onChange={(e) => onQuestionChange(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1 outline-none text-gray-900 dark:text-gray-100 bg-transparent placeholder:text-gray-500 dark:placeholder:text-gray-400 text-sm"
            aria-label="Question input"
          />

          {/* Voice Button */}
          <button
            onClick={onStartVoice}
            disabled={isListening}
            className={`p-2 rounded-lg transition-all duration-200 hover:scale-105 active:scale-95 ${
              isListening
                ? "bg-gradient-to-br from-red-500 to-rose-600 text-white shadow-soft-lg animate-pulse ring-2 ring-red-400/50"
                : "bg-gradient-to-br from-emerald-100 to-green-100 text-emerald-600 hover:from-emerald-200 hover:to-green-200 dark:from-emerald-900/30 dark:to-emerald-800/30 dark:text-emerald-400 shadow-soft hover:shadow-soft-lg"
            }`}
            title="குரல் மூலம் பேசுங்கள்"
            aria-label={isListening ? "Listening..." : "Start voice input"}
          >
            <Mic className="w-4 h-4" />
          </button>
        </div>

        {/* Send Button */}
        <button
          onClick={onSend}
          disabled={disabled}
          className="p-2.5 bg-gradient-to-br from-emerald-500 to-green-600 text-white rounded-lg hover:from-emerald-600 hover:to-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-soft-lg hover:shadow-soft-xl hover:scale-105 active:scale-95 ring-1 ring-emerald-400/50 disabled:ring-0"
          title="அனுப்பு"
          aria-label="Send message"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>

      {/* Listening Indicator */}
      {isListening && (
        <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-2 animate-pulse flex items-center gap-2 font-medium">
          <span className="w-2 h-2 bg-red-500 rounded-full shadow-soft-lg"></span>
          குரல் கேட்கிறது... பேசுங்கள்
        </p>
      )}
    </div>
  );
}
