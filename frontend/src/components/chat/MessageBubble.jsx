import React from "react";

export default function MessageBubble({ message }) {
  return (
    <div
      className={`flex ${
        message.type === "user" ? "justify-end" : "justify-start"
      } animate-fade-in`}
    >
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-2.5 transition-all duration-200 ${
          message.type === "user"
            ? "bg-gradient-to-br from-emerald-500 to-green-600 text-white rounded-br-none shadow-soft-lg hover:shadow-soft-xl hover:scale-[1.02]"
            : "bg-gradient-to-br from-gray-100/95 to-gray-200/95 text-gray-800 rounded-bl-none dark:from-gray-800/95 dark:to-gray-700/95 dark:text-gray-100 shadow-soft hover:shadow-soft-lg backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 hover:scale-[1.02]"
        }`}
      >
        {message.image && (
          <img
            src={message.image}
            alt="Uploaded"
            className="w-full rounded-xl mb-2 max-w-xs shadow-soft transition-all duration-200 hover:scale-105"
          />
        )}
        <p className="text-sm leading-relaxed whitespace-pre-wrap">
          {message.text}
        </p>
        {message.offline && (
          <span className="text-xs bg-gradient-to-br from-yellow-100 to-amber-100 text-yellow-800 px-2.5 py-1 rounded-full mt-2 inline-block font-medium shadow-soft">
            ஆஃப்லைன் பதில்
          </span>
        )}
        <p
          className={`text-xs mt-2.5 font-medium ${
            message.type === "user"
              ? "text-emerald-100"
              : "text-gray-500 dark:text-gray-400"
          }`}
        >
          {message.timestamp.toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit",
          })}
        </p>
      </div>
    </div>
  );
}
