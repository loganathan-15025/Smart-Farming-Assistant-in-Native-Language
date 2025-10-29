import React, { useState } from "react";
import Header from "./layout/Header";
import WeatherBar from "./layout/WeatherBar";
import Sidebar from "./layout/Sidebar";
import ChatBox from "./chat/ChatBox";
import { useVoiceRecognition } from "../hooks/useVoiceRecognition";
import { useWeather } from "../hooks/useWeather";
import { useOnlineStatus } from "../hooks/useOnlineStatus";
import { sendQuestionToAPI, speakText } from "../utils/serviceApi";
import { getOfflineResponse } from "../utils/offlineStorage";
import { languages } from "../data/languages";

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
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [activeTab, setActiveTab] = useState("chat");
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [language, setLanguage] = useState("tamil");

  // Custom Hooks
  const { weather } = useWeather();
  const isOnline = useOnlineStatus();
  const { isListening, startListening } = useVoiceRecognition(
    languages[language].code
  );

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
    setIsSpeaking(!isSpeaking);
    if (isSpeaking) {
      window.speechSynthesis.cancel();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      {/* Header */}
      <Header
        isOnline={isOnline}
        language={language}
        onLanguageChange={setLanguage}
        showMenu={showMenu}
        onMenuToggle={() => setShowMenu(!showMenu)}
      />

      {/* Weather Bar inside Header wrapper */}
      <div className="max-w-7xl mx-auto px-4">
        <WeatherBar weather={weather} />
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6 flex gap-6">
        {/* Sidebar */}
        <Sidebar
          showMenu={showMenu}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onQuickQuestion={handleQuickQuestion}
        />

        {/* Chat Box */}
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
    </div>
  );
}
