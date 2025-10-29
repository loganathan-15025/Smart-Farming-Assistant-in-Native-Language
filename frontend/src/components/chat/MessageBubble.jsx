import React from 'react';

export default function MessageBubble({ message }) {
  return (
    <div className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[80%] rounded-2xl px-5 py-3 ${
          message.type === 'user'
            ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-br-none'
            : 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 rounded-bl-none'
        }`}
      >
        {message.image && (
          <img 
            src={message.image} 
            alt="Uploaded" 
            className="w-full rounded-lg mb-2 max-w-xs" 
          />
        )}
        <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.text}</p>
        {message.offline && (
          <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full mt-2 inline-block">
            ஆஃப்லைன் பதில்
          </span>
        )}
        <p className={`text-xs mt-2 ${
          message.type === 'user' ? 'text-green-100' : 'text-gray-500'
        }`}>
          {message.timestamp.toLocaleTimeString('ta-IN', { 
            hour: '2-digit', 
            minute: '2-digit' 
          })}
        </p>
      </div>
    </div>
  );
}