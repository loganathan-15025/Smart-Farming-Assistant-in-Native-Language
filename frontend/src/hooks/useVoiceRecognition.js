import { useState, useRef } from 'react';

export const useVoiceRecognition = (languageCode) => {
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);

  const startListening = (onResult) => {
    if (!('webkitSpeechRecognition' in window)) {
      alert('உங்கள் உலாவி குரல் அங்கீகாரத்தை ஆதரிக்கவில்லை');
      return;
    }

    const recognition = new webkitSpeechRecognition();
    recognition.lang = languageCode;
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      onResult(transcript);
      setIsListening(false);
    };

    recognition.onerror = () => {
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
    recognitionRef.current = recognition;
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  return { isListening, startListening, stopListening };
};