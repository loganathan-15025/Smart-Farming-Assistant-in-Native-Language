import { cleanMarkdownText } from "./textCleaner";

const API_URL =
  process.env.REACT_APP_API_URL ||
  "https://smart-farming-assistant-in-native.onrender.com";

console.log("🔵 API_URL configured as:", API_URL);
console.log("🔵 Environment variable:", process.env.REACT_APP_API_URL);

export const sendQuestionToAPI = async (question, hasImage = false) => {
  try {
    const fullUrl = `${API_URL}/ask`;
    console.log("🔵 Attempting to fetch from:", fullUrl);
    console.log("🔵 Question:", question);

    const response = await fetch(fullUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        question,
        hasImage,
      }),
    });

    console.log("🔵 Response status:", response.status);
    console.log("🔵 Response ok:", response.ok);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ Response error:", errorText);
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    console.log("🔵 Response data:", data);

    return {
      success: true,
      answer: cleanMarkdownText(data.answer),
    };
  } catch (error) {
    console.error("❌ Full error details:", error);
    console.error("❌ Error name:", error.name);
    console.error("❌ Error message:", error.message);
    console.error("❌ Error stack:", error.stack);

    return {
      success: false,
      error: error.message,
    };
  }
};

// Rest of your speakText code...
// Remove emoji and special joiners from spoken text while keeping UI intact
const stripEmojis = (input = "") => {
  return (
    input
      // Remove emoji ranges
      .replace(/[\u{1F600}-\u{1F64F}]/gu, "") // Emoticons
      .replace(/[\u{1F300}-\u{1F5FF}]/gu, "") // Misc Symbols and Pictographs
      .replace(/[\u{1F680}-\u{1F6FF}]/gu, "") // Transport and Map
      .replace(/[\u{2600}-\u{26FF}]/gu, "") // Misc symbols
      .replace(/[\u{2700}-\u{27BF}]/gu, "") // Dingbats
      .replace(/[\u{1F900}-\u{1F9FF}]/gu, "") // Supplemental Symbols and Pictographs
      .replace(/[\u{1FA70}-\u{1FAFF}]/gu, "") // Symbols and Pictographs Extended-A
      .replace(/[\u{1F1E6}-\u{1F1FF}]/gu, "") // Regional Indicator Symbols
      // Remove variation selectors and zero-width joiners
      .replace(/[\u200D\uFE0E\uFE0F]/g, "")
      // Remove common symbols and punctuation
      .replace(/[#*_~`[\]{}()<>|\\]/g, " ") // Markdown and special chars
      .replace(/[:;,.\-—!?'"]/g, " ") // Punctuation that causes pauses
      // Collapse extra spaces left by removals
      .replace(/\s{2,}/g, " ")
      .trim()
  );
};

let voiceReadyByLang = {};

export const prewarmVoice = (languageCode) => {
  if (!window.responsiveVoice) return;
  const voiceMap = {
    "ta-IN": "Tamil Female",
    "en-US": "US English Female",
    "hi-IN": "Hindi Female",
    "te-IN": "Telugu Female",
  };
  const voiceName = voiceMap[languageCode] || "Tamil Female";
  if (voiceReadyByLang[voiceName]) return;
  try {
    // Speak a very short, silent utterance to initialize the engine
    window.responsiveVoice.speak(".", voiceName, {
      volume: 0,
      rate: 1,
      pitch: 1,
      onstart: () => {
        // Cancel immediately after start to avoid audible blips
        try {
          window.responsiveVoice.cancel();
        } catch {}
      },
      onend: () => {
        voiceReadyByLang[voiceName] = true;
        console.log("✅ Voice prewarmed for", voiceName);
      },
    });
  } catch (e) {
    // ignore
  }
};

export const speakText = (text, languageCode) => {
  if (!window.responsiveVoice) {
    console.error("❌ ResponsiveVoice not loaded");
    return;
  }

  if (window.responsiveVoice.isPlaying()) {
    window.responsiveVoice.cancel();
  }

  const voiceMap = {
    "ta-IN": "Tamil Female",
    "en-US": "US English Female",
    "hi-IN": "Hindi Female",
    "te-IN": "Telugu Female",
  };

  const voiceName = voiceMap[languageCode] || "Tamil Female";

  // Clean markdown artifacts and strip emojis from the spoken content only
  const spokenText = stripEmojis(cleanMarkdownText(text));

  window.responsiveVoice.speak(spokenText, voiceName, {
    rate: 1.2,
    pitch: 1,
    volume: 1,
    onend: () => console.log("✅ Speech finished"),
  });
};
