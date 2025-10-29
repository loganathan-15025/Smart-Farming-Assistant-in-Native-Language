import React, { useRef, useEffect } from 'react';
import MessageBubble from './MessageBubble';
import InputArea from './InputArea';
import ImageUpload from '../features/ImageUpload';

export default function ChatBox({
  messages,
  question,
  onQuestionChange,
  onSend,
  isListening,
  isSpeaking,
  onToggleSpeaker,
  onStartVoice,
  imagePreview,
  onImageUpload,
  onImageRemove
}) {
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <main className="flex-1 bg-white rounded-2xl shadow-lg flex flex-col overflow-hidden">
      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((msg, idx) => (
          <MessageBubble key={idx} message={msg} />
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Image Preview */}
      <ImageUpload 
        imagePreview={imagePreview} 
        onRemove={onImageRemove} 
      />

      {/* Input Area */}
      <InputArea
        question={question}
        onQuestionChange={onQuestionChange}
        onSend={onSend}
        isListening={isListening}
        isSpeaking={isSpeaking}
        onToggleSpeaker={onToggleSpeaker}
        onStartVoice={onStartVoice}
        onImageUpload={onImageUpload}
        disabled={!question.trim() && !imagePreview}
      />
    </main>
  );
}