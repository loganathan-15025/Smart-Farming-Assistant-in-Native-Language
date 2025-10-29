import React, { useRef } from 'react';
import { Mic, Send, Volume2, VolumeX, Image } from 'lucide-react';

export default function InputArea({
  question,
  onQuestionChange,
  onSend,
  isListening,
  isSpeaking,
  onToggleSpeaker,
  onStartVoice,
  onImageUpload,
  disabled
}) {
  const fileInputRef = useRef(null);

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !disabled) {
      onSend();
    }
  };

  return (
    <div className="border-t border-gray-200 p-4 bg-gradient-to-r from-green-50 to-emerald-50">
      <div className="flex items-end gap-3">
        {/* Speaker Toggle */}
        <button
          onClick={onToggleSpeaker}
          className={`p-3 rounded-xl transition-all ${
            isSpeaking
              ? 'bg-green-500 text-white shadow-lg'
              : 'bg-white text-gray-600 hover:bg-gray-100'
          }`}
          title={isSpeaking ? 'குரல் பதில் நிறுத்து' : 'குரல் பதில் இயக்கு'}
        >
          {isSpeaking ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
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
          className="p-3 bg-white rounded-xl text-purple-600 hover:bg-purple-50 transition-all"
          title="படம் பதிவேற்று"
        >
          <Image className="w-5 h-5" />
        </button>

        {/* Text Input */}
        <div className="flex-1 bg-white rounded-2xl shadow-md flex items-center gap-3 px-4 py-3">
          <input
            type="text"
            placeholder="உங்கள் கேள்வியை இங்கே தட்டச்சு செய்யவும்..."
            value={question}
            onChange={(e) => onQuestionChange(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1 outline-none text-gray-700"
          />
          
          {/* Voice Button */}
          <button
            onClick={onStartVoice}
            disabled={isListening}
            className={`p-2 rounded-lg transition-all ${
              isListening
                ? 'bg-red-500 text-white animate-pulse'
                : 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-600 hover:from-green-200 hover:to-emerald-200'
            }`}
            title="குரல் மூலம் பேசுங்கள்"
          >
            <Mic className="w-5 h-5" />
          </button>
        </div>

        {/* Send Button */}
        <button
          onClick={onSend}
          disabled={disabled}
          className="p-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:from-green-600 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl"
          title="அனுப்பு"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>

      {/* Listening Indicator */}
      {isListening && (
        <p className="text-sm text-green-600 mt-2 animate-pulse flex items-center gap-2">
          <span className="w-2 h-2 bg-red-500 rounded-full"></span>
          குரல் கேட்கிறது... பேசுங்கள்
        </p>
      )}
    </div>
  );
}