import { cleanMarkdownText } from './textCleaner';

const API_URL = process.env.REACT_APP_API_URL || "https://smart-farming-assistant-in-native.onrender.com";

console.log('🔵 API_URL configured as:', API_URL);
console.log('🔵 Environment variable:', process.env.REACT_APP_API_URL);

export const sendQuestionToAPI = async (question, hasImage = false) => {
  try {
    const fullUrl = `${API_URL}/ask`;
    console.log('🔵 Attempting to fetch from:', fullUrl);
    console.log('🔵 Question:', question);
    
    const response = await fetch(fullUrl, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ 
        question, 
        hasImage 
      }),
    });
    
    console.log('🔵 Response status:', response.status);
    console.log('🔵 Response ok:', response.ok);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Response error:', errorText);
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }
    
    const data = await response.json();
    console.log('🔵 Response data:', data);
    
    return {
      success: true,
      answer: cleanMarkdownText(data.answer)
    };
  } catch (error) {
    console.error('❌ Full error details:', error);
    console.error('❌ Error name:', error.name);
    console.error('❌ Error message:', error.message);
    console.error('❌ Error stack:', error.stack);
    
    return {
      success: false,
      error: error.message
    };
  }
};

// Rest of your speakText code...
export const speakText = (text, languageCode) => {
  if (!window.responsiveVoice) {
    console.error('❌ ResponsiveVoice not loaded');
    return;
  }

  if (window.responsiveVoice.isPlaying()) {
    window.responsiveVoice.cancel();
  }

  const voiceMap = {
    'ta-IN': 'Tamil Female',
    'en-US': 'US English Female', 
    'hi-IN': 'Hindi Female',
    'te-IN': 'Telugu Female'
  };

  const voiceName = voiceMap[languageCode] || 'Tamil Female';

  window.responsiveVoice.speak(text, voiceName, {
    rate: 0.9,
    pitch: 1,
    volume: 1,
    onend: () => console.log('✅ Speech finished')
  });
};