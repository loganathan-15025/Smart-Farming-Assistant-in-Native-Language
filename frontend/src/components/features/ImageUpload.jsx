import React from "react";
import { X } from "lucide-react";

export default function ImageUpload({ imagePreview, onRemove }) {
  if (!imagePreview) return null;

  return (
    <div className="px-4 py-2 border-t border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-gray-900/40">
      <div className="relative inline-block">
        <img src={imagePreview} alt="Preview" className="h-20 rounded-lg" />
        <button
          onClick={onRemove}
          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
        >
          <X className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
}
