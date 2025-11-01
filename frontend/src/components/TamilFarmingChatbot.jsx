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
        onLanguageChange={(val) => {
          setLanguage(val);
          if (isSpeaking) {
            prewarmVoice(languages[val].code);
          }
        }}
        showMenu={showMenu}
        onMenuToggle={() => setShowMenu(!showMenu)}
      />

      {/* Weather Bar inside Header wrapper */}
      <div className="max-w-full mx-auto px-0 sm:px-4 w-full flex-shrink-0">
        <WeatherBar
          weather={weather}
          onDistrictChange={handleDistrictChange}
          selectedDistrict={selectedDistrict}
        />
      </div>

      {/* Mobile liquid glossy background (behind chat) */}
      <div className="lg:hidden absolute inset-0 -z-10 liquid-container">
        <div className="liquid-blob blob-a"></div>
        <div className="liquid-blob blob-b"></div>
        <div className="liquid-blob blob-c"></div>
      </div>

      {/* Mobile Menu Overlay - Shows Quick Questions, Tips & Calendar */}
      {showMenu && (
        <div
          className="lg:hidden fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
          onClick={() => setShowMenu(false)}
        >
          <div
            className="absolute top-0 right-0 w-80 h-full bg-white dark:bg-gray-900 shadow-2xl overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 space-y-4">
              {/* Close Button */}
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100">
                  மெனு
                </h2>
                <button
                  onClick={() => setShowMenu(false)}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <span className="text-2xl text-gray-600 dark:text-gray-300">
                    ✕
                  </span>
                </button>
              </div>

              {/* Language Selector (Mobile) */}
              <div className="mb-2">
                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1">
                  மொழி
                </label>
                <select
                  value={language}
                  onChange={(e) => {
                    const val = e.target.value;
                    setLanguage(val);
                    if (isSpeaking) prewarmVoice(languages[val].code);
                  }}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm font-medium text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent shadow-soft"
                >
                  {Object.entries(languages).map(([key, lang]) => (
                    <option key={key} value={key}>
                      {lang.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Quick Questions in Mobile Menu */}
              <div className="mb-4">
                <h3 className="font-semibold text-gray-700 dark:text-gray-200 mb-3 text-sm">
                  விரைவு கேள்விகள்
                </h3>
                <QuickQuestions
                  onQuickQuestion={(text) => {
                    handleQuickQuestion(text);
                    setShowMenu(false);
                  }}
                />
              </div>

              {/* Tips & Calendar Tabs in Mobile Menu */}
              <div className="mb-4">
                <div className="flex gap-2 mb-3">
                  <button
                    onClick={() => setActiveTab("tips")}
                    className={`flex-1 py-2 px-3 rounded-lg text-sm font-semibold transition-all ${
                      activeTab === "tips"
                        ? "bg-emerald-500 text-white"
                        : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                    }`}
                  >
                    💡 குறிப்புகள்
                  </button>
                  <button
                    onClick={() => setActiveTab("calendar")}
                    className={`flex-1 py-2 px-3 rounded-lg text-sm font-semibold transition-all ${
                      activeTab === "calendar"
                        ? "bg-emerald-500 text-white"
                        : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                    }`}
                  >
                    📅 நாட்காட்டி
                  </button>
                </div>
                <div className="max-h-[60vh] overflow-y-auto scrollbar-none">
                  {activeTab === "tips" ? <DailyTips /> : <CropCalendar />}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-full mx-auto px-0 sm:px-2 lg:px-4 py-0 sm:py-2 lg:py-3 flex-1 min-h-0 overflow-hidden w-full flex justify-center items-start relative">
        {/* Quick Questions - Top Left Corner (Fixed) - Hidden on mobile */}
        <div className="hidden lg:block fixed top-44 left-4 w-72 h-[calc(100vh-192px)] overflow-hidden z-40">
          <QuickQuestions onQuickQuestion={handleQuickQuestion} />
        </div>

        {/* Chat Box - Center */}
        <div className="w-full lg:pl-80 lg:pr-[22rem] h-full flex flex-col min-h-0">
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

        {/* Tips & Calendar - Top Right Corner (Fixed) - Hidden on mobile */}
        <div className="hidden lg:flex fixed top-44 right-4 w-80 h-[calc(100vh-192px)] overflow-hidden flex-col gap-3 z-40">
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
          <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
            {activeTab === "tips" ? <DailyTips /> : <CropCalendar />}
          </div>
        </div>
      </div>
    </div>
  );
}
