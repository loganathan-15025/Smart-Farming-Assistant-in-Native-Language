import React, { useState, useEffect } from "react";
import Header from "./layout/Header";
import WeatherBar from "./layout/WeatherBar";
import ChatBox from "./chat/ChatBox";
import QuickQuestions from "./features/QuickQuestions";
import DailyTips from "./features/DailyTips";
import CropCalendar from "./features/CropCalendar";
import { useVoiceRecognition } from "../hooks/useVoiceRecognition";
import { useWeather } from "../hooks/useWeather";
import { useOnlineStatus } from "../hooks/useOnlineStatus";
import {
  sendQuestionToAPI,
  speakText,
  prewarmVoice,
} from "../utils/serviceApi";
import { getOfflineResponse } from "../utils/offlineStorage";
import { languages } from "../data/languages";
import { tamilNaduDistricts } from "../data/tamilNaduDistricts";

export default function TamilFarmingChatbot() {
  // State Management
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([
    {
      type: "bot",
      text: "வணக்கம்! நான் உங்கள் விவசாய உதவியாளர். உங்கள் செடிகள், நோய்கள், அல்லது விவசாய கேள்விகளை கேளுங்கள்.",
      timestamp: new Date(),
    },
  ]);
  const [isSpeaking, setIsSpeaking] = useState(true);
  const [showMenu, setShowMenu] = useState(false);
  const [activeTab, setActiveTab] = useState("tips");
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [language, setLanguage] = useState("tamil");
  const [selectedDistrict, setSelectedDistrict] = useState(
    tamilNaduDistricts[0]
  ); // Default to Chennai

  // Custom Hooks
  const { weather } = useWeather(selectedDistrict?.lat, selectedDistrict?.lon);
  const isOnline = useOnlineStatus();
  const { isListening, startListening } = useVoiceRecognition(
    languages[language].code
  );

  // Speak welcome message on mount if speaker is enabled
  useEffect(() => {
    if (!isSpeaking || messages.length === 0) return;

    // Wait for ResponsiveVoice to be ready and attempt to speak
    const speakWelcome = () => {
      if (window.responsiveVoice) {
        window.responsiveVoice.OnVoiceReady = () => {
          try {
            speakText(messages[0].text, languages[language].code);
          } catch (e) {
            console.log(
              "Welcome message autoplay blocked by browser. User interaction needed."
            );
          }
        };

        // If already ready, speak immediately
        if (window.responsiveVoice.voiceSupport()) {
          try {
            speakText(messages[0].text, languages[language].code);
          } catch (e) {
            console.log(
              "Welcome message autoplay blocked by browser. User interaction needed."
            );
          }
        }
      }
    };

    // Small delay to ensure script is loaded
    const timer = setTimeout(speakWelcome, 800);
    return () => clearTimeout(timer);
  }, []); // Run once on mount

  // Handle district change
  const handleDistrictChange = (district) => {
    setSelectedDistrict(district);
  };

  // Handle sending question
  // Handle sending question
  const handleSendQuestion = async (text = question) => {
    // Fix: Ensure text is a string
    const questionText = typeof text === "string" ? text : question;

    if (!questionText.trim() && !selectedImage) return;

    let finalQuestion = questionText;
    if (selectedImage) {
      finalQuestion = questionText || "இந்த செடியின் நோயை கண்டறியுங்கள்";
    }

    // Add user message
    const userMessage = {
      type: "user",
      text: finalQuestion,
      image: imagePreview,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setQuestion("");
    setSelectedImage(null);
    setImagePreview(null);

    // Handle offline mode
    if (!isOnline) {
      const offlineAnswer = getOfflineResponse(finalQuestion);
      const botMessage = {
        type: "bot",
        text: offlineAnswer,
        offline: true,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);
      return;
    }

    // Send to API
    const result = await sendQuestionToAPI(finalQuestion, !!selectedImage);

    if (result.success) {
      const botMessage = {
        type: "bot",
        text: result.answer,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);

      if (isSpeaking) {
        speakText(result.answer, languages[language].code);
      }
    } else {
      const errorMessage = {
        type: "bot",
        text: "மன்னிக்கவும், ஏதோ பிழை ஏற்பட்டது. மீண்டும் முயற்சிக்கவும்.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    }
  };
  // Handle quick question
  const handleQuickQuestion = (text) => {
    setQuestion(text);
    handleSendQuestion(text);
  };

  // Handle voice recognition
  const handleStartVoice = () => {
    startListening((transcript) => {
      setQuestion(transcript);
    });
  };

  // Handle image upload
  const handleImageUpload = (file) => {
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Toggle speaker
  const toggleSpeaker = () => {
    const next = !isSpeaking;
    setIsSpeaking(next);
    if (!next) {
      window.speechSynthesis.cancel();
    } else {
      // Warm the TTS engine on enable to avoid initial delay
      prewarmVoice(languages[language].code);
    }
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden relative">
      {/* Header */}
      <Header
        isOnline={isOnline}
        language={language}
        showMenu={showMenu}
        onMenuToggle={() => setShowMenu(!showMenu)}
      />

      {/* Weather Bar inside Header wrapper */}
      <div className="max-w-full mx-auto px-4 w-full flex-shrink-0">
        <WeatherBar
          weather={weather}
          onDistrictChange={handleDistrictChange}
          selectedDistrict={selectedDistrict}
        />
      </div>

      {/* Main Content */}
      <div className="max-w-full mx-auto px-4 py-3 flex-1 min-h-0 overflow-hidden w-full flex justify-center items-start relative">
        {/* Quick Questions - Top Left Corner (Fixed) */}
        <div className="fixed top-44 left-4 w-72 h-[calc(100vh-192px)] overflow-hidden z-40">
          <QuickQuestions onQuickQuestion={handleQuickQuestion} />
        </div>

        {/* Chat Box - Center */}
        <div className="w-full pl-80 pr-[22rem] h-full flex flex-col min-h-0">
          <ChatBox
            messages={messages}
            question={question}
            onQuestionChange={setQuestion}
            onSend={handleSendQuestion}
            isListening={isListening}
            isSpeaking={isSpeaking}
            onToggleSpeaker={toggleSpeaker}
            onStartVoice={handleStartVoice}
            imagePreview={imagePreview}
            onImageUpload={handleImageUpload}
            onImageRemove={() => {
              setImagePreview(null);
              setSelectedImage(null);
            }}
          />
        </div>

        {/* Tips & Calendar - Top Right Corner (Fixed) */}
        <div className="fixed top-44 right-4 w-80 h-[calc(100vh-192px)] overflow-hidden flex flex-col gap-3 z-40">
          {/* Tab Switcher */}
          <div className="flex gap-2 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl rounded-xl p-1.5 shadow-soft-lg border border-gray-200/50 dark:border-gray-700/50">
            <button
              onClick={() => setActiveTab("tips")}
              className={`flex-1 py-2 px-3 rounded-lg text-sm font-semibold transition-all duration-200 ${
                activeTab === "tips"
                  ? "bg-emerald-500 text-white shadow-soft"
                  : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
              }`}
            >
              💡 குறிப்புகள்
            </button>
            <button
              onClick={() => setActiveTab("calendar")}
              className={`flex-1 py-2 px-3 rounded-lg text-sm font-semibold transition-all duration-200 ${
                activeTab === "calendar"
                  ? "bg-emerald-500 text-white shadow-soft"
                  : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
              }`}
            >
              📅 நாட்காட்டி
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 min-h-0">
            {activeTab === "tips" ? <DailyTips /> : <CropCalendar />}
          </div>
        </div>
      </div>
    </div>
  );
}
