import React, { useRef, useEffect } from "react";
import MessageBubble from "./MessageBubble";
import InputArea from "./InputArea";
import ImageUpload from "../features/ImageUpload";

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
  onImageRemove,
}) {
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <main className="h-full rounded-2xl shadow-soft-xl flex flex-col overflow-hidden bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 hover:shadow-soft-xl transition-shadow duration-300">
      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-none">
        {messages.map((msg, idx) => (
          <MessageBubble key={idx} message={msg} />
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Image Preview */}
      <ImageUpload imagePreview={imagePreview} onRemove={onImageRemove} />

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
