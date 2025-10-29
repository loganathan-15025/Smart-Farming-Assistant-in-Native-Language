import { cleanMarkdownText } from './textCleaner';

import { cleanMarkdownText } from './textCleaner';

// Use environment variable or fallback to localhost
const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

export const sendQuestionToAPI = async (question, hasImage = false) => {
  try {
    const response = await fetch(`${API_URL}/ask`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        question, 
        hasImage 
      }),
    });
    
    const data = await response.json();
    return {
      success: true,
      answer: cleanMarkdownText(data.answer)
    };
  } catch (error) {
    console.error('API Error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};


// ResponsiveVoice Text-to-Speech (100% FREE)
export const speakText = (text, languageCode) => {
  // Wait for ResponsiveVoice to load
  if (!window.responsiveVoice) {
    console.error('❌ ResponsiveVoice not loaded');
    console.log('Make sure script tag is added to index.html');
    return;
  }

  // Cancel any ongoing speech
  if (window.responsiveVoice.isPlaying()) {
    window.responsiveVoice.cancel();
  }

  // Map language codes to ResponsiveVoice voices
  const voiceMap = {
    'ta-IN': 'Tamil Female',
    'en-US': 'US English Female', 
    'en-GB': 'UK English Female',
    'hi-IN': 'Hindi Female',
    'te-IN': 'Telugu Female'
  };

  const voiceName = voiceMap[languageCode] || 'Tamil Female';

  console.log(`🔊 Speaking in ${voiceName}:`, text.substring(0, 50) + '...');

  // Speak the text
  window.responsiveVoice.speak(text, voiceName, {
    rate: 0.9,        // Speed (0.5 = slow, 1 = normal, 2 = fast)
    pitch: 1,         // Pitch (0 = low, 1 = normal, 2 = high)
    volume: 1,        // Volume (0 to 1)
    onstart: () => {
      console.log('✅ Speech started');
    },
    onend: () => {
      console.log('✅ Speech finished');
    },
    onerror: (error) => {
      console.error('❌ Speech error:', error);
    }
  });
};

// Stop speaking
export const stopSpeaking = () => {
  if (window.responsiveVoice && window.responsiveVoice.isPlaying()) {
    window.responsiveVoice.cancel();
    console.log('🔇 Speech stopped');
  }
};

// Check if ResponsiveVoice is ready
export const isSpeechReady = () => {
  return window.responsiveVoice !== undefined;
};