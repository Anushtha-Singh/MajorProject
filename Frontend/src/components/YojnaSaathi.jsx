import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageCircle, 
  X, 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Send, 
  Maximize2, 
  Minimize2,
  Bot,
  User,
  Loader2,
  Globe
} from 'lucide-react';
import { sampleSchemes, languagePatterns, languageNames, greetings, followUpQuestions } from '../data/schemesData';
import { getGeminiResponse, formatSchemeResponse } from '../utils/geminiApi';

const YojnaSaathi = ({ isFullPage = false, onToggleFullPage }) => {
  // State management
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [detectedLanguage, setDetectedLanguage] = useState('en');
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [isListening, setIsListening] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [showLanguageSelector, setShowLanguageSelector] = useState(false);
  const [recentQuestions, setRecentQuestions] = useState([]);

  // Refs
  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);
  const synthRef = useRef(null);

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Language detection function
  const detectLanguage = useCallback((text) => {
    if (!text) return 'en';
    
    for (const [lang, pattern] of Object.entries(languagePatterns)) {
      if (pattern.test(text)) {
        return lang;
      }
    }
    return 'en';
  }, []);

  // Load recent questions from cache
  useEffect(() => {
    const cached = localStorage.getItem('yojnaSaathi_recentQuestions');
    if (cached) {
      try {
        setRecentQuestions(JSON.parse(cached));
      } catch (e) {
        console.error('Error loading cached questions:', e);
      }
    }
  }, []);

  // Initialize speech recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'hi-IN'; // Default to Hindi, will be updated based on detected language

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInputText(transcript);
        const detectedLang = detectLanguage(transcript);
        setDetectedLanguage(detectedLang);
        setIsListening(false);
      };

      recognitionRef.current.onerror = () => {
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }

    // Initialize speech synthesis
    if ('speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis;
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [detectLanguage]);

  // Text-to-speech function
  const speakText = useCallback((text, lang = detectedLanguage) => {
    if (isMuted || !synthRef.current) return;

    // Cancel any ongoing speech
    synthRef.current.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    
    // Set language and voice
    const langMap = {
      'hi': 'hi-IN',
      'ta': 'ta-IN',
      'te': 'te-IN',
      'bn': 'bn-IN',
      'gu': 'gu-IN',
      'pa': 'pa-IN',
      'kn': 'kn-IN',
      'ml': 'ml-IN',
      'or': 'or-IN',
      'mr': 'mr-IN',
      'en': 'en-IN'
    };

    utterance.lang = langMap[lang] || 'en-IN';
    
    // Enhanced voice settings for more natural female voice
    utterance.rate = 0.9; // Slightly faster for better flow
    utterance.pitch = 1.1; // Higher pitch for female voice
    utterance.volume = 0.9; // Clear volume
    
    // Try to select a female voice
    const voices = synthRef.current.getVoices();
    const femaleVoice = voices.find(voice => 
      voice.lang.startsWith(langMap[lang] || 'en-IN') && 
      (voice.name.toLowerCase().includes('female') || 
       voice.name.toLowerCase().includes('woman') ||
       voice.name.toLowerCase().includes('priya') ||
       voice.name.toLowerCase().includes('neha') ||
       voice.name.toLowerCase().includes('samantha') ||
       voice.name.toLowerCase().includes('karen'))
    );
    
    if (femaleVoice) {
      utterance.voice = femaleVoice;
    }

    // Clean text for better speech - make numbers natural and remove URLs
    utterance.text = text
      .replace(/https?:\/\/[^\s]+/g, '') // Remove URLs
      .replace(/www\.[^\s]+/g, '') // Remove www URLs
      .replace(/₹(\d+)/g, (match, num) => {
        const number = parseInt(num);
        if (number >= 100000) {
          return `${(number/100000).toFixed(1)} lakh rupees`;
        } else if (number >= 1000) {
          return `${(number/1000).toFixed(1)} thousand rupees`;
        } else {
          return `${number} rupees`;
        }
      })
      .replace(/(\d+)/g, (match, num) => {
        const number = parseInt(num);
        if (number >= 100000) {
          return `${(number/100000).toFixed(1)} lakh`;
        } else if (number >= 1000) {
          return `${(number/1000).toFixed(1)} thousand`;
        } else {
          return number.toString();
        }
      })
      .replace(/[.,!?;:]/g, ' ') // Replace punctuation with spaces
      .replace(/[%]/g, 'percent ') // Replace percentage
      .replace(/\s+/g, ' ') // Remove extra spaces
      .trim();

    synthRef.current.speak(utterance);
  }, [isMuted, detectedLanguage]);

  // Initialize chatbot with greeting
  const initializeChatbot = useCallback(() => {
    if (isInitialized) return;
    
    const currentLang = selectedLanguage || detectedLanguage;
    const greeting = greetings[currentLang] || greetings.en;

    const initialMessage = {
      id: Date.now(),
      type: 'bot',
      text: greeting,
      timestamp: new Date()
    };

    setMessages([initialMessage]);
    setIsInitialized(true);
    
    // Speak the greeting immediately
    setTimeout(() => {
      speakText(greeting, currentLang);
    }, 200);
  }, [selectedLanguage, detectedLanguage, isInitialized, speakText]);

  // Open chatbot
  const openChatbot = () => {
    setIsOpen(true);
    if (!isInitialized) {
      initializeChatbot();
    }
  };

  // Close chatbot
  const closeChatbot = () => {
    setIsOpen(false);
    setIsInitialized(false);
    setMessages([]);
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    if (synthRef.current) {
      synthRef.current.cancel();
    }
  };

  // Toggle speech recognition
  const toggleListening = () => {
    if (!recognitionRef.current) return;

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  // Toggle mute/unmute
  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (!isMuted && synthRef.current) {
      synthRef.current.cancel();
    }
  };

  // Handle scheme-specific queries
  const handleSchemeQuery = (userMessage, lang) => {
    const message = userMessage.toLowerCase();
    
    // Check if user is asking about a specific scheme
    for (const scheme of sampleSchemes) {
      const title = scheme.title.toLowerCase();
      const titleHindi = scheme.titleHindi.toLowerCase();
      
      if (message.includes(title) || message.includes(titleHindi) || 
          message.includes(scheme.category.toLowerCase())) {
        const formattedScheme = formatSchemeResponse(scheme, lang);
        return JSON.stringify(formattedScheme, null, 2);
      }
    }
    
    return null;
  };

  // Handle sending message
  const handleSendMessage = async () => {
    if (!inputText.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      text: inputText,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    // Add to recent questions cache
    setRecentQuestions(prev => {
      const newQuestions = [inputText, ...prev.filter(q => q !== inputText)].slice(0, 5);
      localStorage.setItem('yojnaSaathi_recentQuestions', JSON.stringify(newQuestions));
      return newQuestions;
    });

    // Detect language from user input
    const detectedLang = detectLanguage(inputText);
    setDetectedLanguage(detectedLang);

    try {
      // First check if it's a scheme-specific query
      const schemeResponse = handleSchemeQuery(inputText, detectedLang);
      
      let response;
      if (schemeResponse) {
        response = schemeResponse;
      } else {
        // Use Gemini API for general queries
        response = await getGeminiResponse(inputText, detectedLang);
      }
      
      const botMessage = {
        id: Date.now() + 1,
        type: 'bot',
        text: response,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
      
      // Add follow-up question
      const followUp = followUpQuestions[detectedLang] || followUpQuestions.en;
      const followUpMessage = {
        id: Date.now() + 2,
        type: 'bot',
        text: followUp,
        timestamp: new Date()
      };
      
      setTimeout(() => {
        setMessages(prev => [...prev, followUpMessage]);
        // Speak the response (but not the follow-up)
        speakText(response, detectedLang);
      }, 300);
      
    } catch (error) {
      console.error('Error getting response:', error);
      const errorMessage = {
        id: Date.now() + 1,
        type: 'bot',
        text: detectedLang === 'hi' 
          ? 'क्षमा करें, कुछ त्रुटि हुई है। कृपया पुनः प्रयास करें।'
          : 'Sorry, there was an error. Please try again.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle key press
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Chatbot toggle button (for popup mode)
  if (!isOpen && !isFullPage) {
    return (
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        className="fixed bottom-6 right-6 z-50"
      >
        <motion.button
          whileHover={{ scale: 1.1, rotate: 5 }}
          whileTap={{ scale: 0.9 }}
          onClick={openChatbot}
          className="relative bg-gradient-to-r from-[#1E90FF] to-[#00BFFF] text-white p-4 rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 group"
          aria-label="Open YojnaSaathi Chatbot"
        >
          <MessageCircle className="w-6 h-6" />
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute inset-0 bg-gradient-to-r from-[#1E90FF] to-[#00BFFF] rounded-full opacity-30"
          />
          <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full animate-pulse">
            Live
          </div>
        </motion.button>
      </motion.div>
    );
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className={`${
          isFullPage 
            ? 'fixed inset-0 z-50 bg-gradient-to-br from-blue-50 to-indigo-100' 
            : 'fixed bottom-6 right-6 w-96 h-[600px] bg-white rounded-3xl shadow-2xl border border-gray-200 z-50 overflow-hidden'
        } flex flex-col`}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-[#1E90FF] to-[#00BFFF] text-white p-4 rounded-t-3xl flex items-center justify-between relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-[#1E90FF]/90 to-[#00BFFF]/90" />
          <div className="relative flex items-center gap-3">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Bot className="w-6 h-6" />
            </motion.div>
            <div>
              <h3 className="font-bold text-lg">YojnaSaathi</h3>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <p className="text-sm opacity-90">
                  {languageNames[selectedLanguage || detectedLanguage]} • {isMuted ? 'Muted' : 'Audio On'}
                </p>
              </div>
            </div>
          </div>
          <div className="relative flex items-center gap-2">
            <button
              onClick={() => setShowLanguageSelector(!showLanguageSelector)}
              className="p-2 hover:bg-white/20 rounded-full transition-colors"
              aria-label="Select Language"
            >
              <Globe className="w-5 h-5" />
            </button>
            <button
              onClick={toggleMute}
              className="p-2 hover:bg-white/20 rounded-full transition-colors"
              aria-label={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            </button>
            {onToggleFullPage && (
              <button
                onClick={onToggleFullPage}
                className="p-2 hover:bg-white/20 rounded-full transition-colors"
                aria-label={isFullPage ? 'Minimize' : 'Maximize'}
              >
                {isFullPage ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
              </button>
            )}
            <button
              onClick={closeChatbot}
              className="p-2 hover:bg-white/20 rounded-full transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Language Selector */}
        {showLanguageSelector && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white border-b p-3"
          >
            <p className="text-sm text-gray-600 mb-2">Select Language:</p>
            <div className="grid grid-cols-3 gap-2">
              {Object.entries(languageNames).map(([code, name]) => (
                <button
                  key={code}
                  onClick={() => {
                    setSelectedLanguage(code);
                    setShowLanguageSelector(false);
                  }}
                  className={`p-2 text-xs rounded-lg transition-colors ${
                    (selectedLanguage || detectedLanguage) === code
                      ? 'bg-[#1E90FF] text-white'
                      : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  {name}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Recent Questions */}
        {recentQuestions.length > 0 && messages.length <= 1 && (
          <div className="p-4 border-b bg-gradient-to-r from-blue-50 to-indigo-50">
            <p className="text-sm text-gray-600 mb-2">
              {(selectedLanguage || detectedLanguage) === 'hi' ? 'हाल के प्रश्न:' : 'Recent Questions:'}
            </p>
            <div className="flex flex-wrap gap-2">
              {recentQuestions.slice(0, 3).map((question, index) => (
                <button
                  key={index}
                  onClick={() => setInputText(question)}
                  className="px-3 py-1 bg-white border border-gray-200 rounded-full text-xs hover:bg-blue-50 hover:border-blue-300 transition-colors"
                >
                  {question.length > 30 ? question.substring(0, 30) + '...' : question}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] p-3 rounded-2xl ${
                  message.type === 'user'
                    ? 'bg-[#1E90FF] text-white'
                    : 'bg-gray-100 text-gray-900'
                }`}
              >
                <div className="flex items-start gap-2">
                  {message.type === 'bot' && <Bot className="w-4 h-4 mt-1 flex-shrink-0" />}
                  {message.type === 'user' && <User className="w-4 h-4 mt-1 flex-shrink-0" />}
                  <div className="text-sm leading-relaxed whitespace-pre-wrap">
                    {message.text.split(' ').map((word, index) => {
                      if (word.match(/^https?:\/\/|^www\./)) {
                        return (
                          <a
                            key={index}
                            href={word.startsWith('http') ? word : `https://${word}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 underline"
                          >
                            {word}
                          </a>
                        );
                      }
                      return word + ' ';
                    })}
                  </div>
                </div>
                <div className={`text-xs mt-2 opacity-70 ${
                  message.type === 'user' ? 'text-right' : 'text-left'
                }`}>
                  {message.timestamp.toLocaleTimeString()}
                </div>
              </div>
            </motion.div>
          ))}
          
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-start"
            >
              <div className="bg-gray-100 p-3 rounded-2xl flex items-center gap-2">
                <Bot className="w-4 h-4" />
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-sm text-gray-600">
                  {detectedLanguage === 'hi' ? 'प्रतिक्रिया आ रही है...' : 'Getting response...'}
                </span>
              </div>
            </motion.div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 border-t bg-gradient-to-r from-gray-50 to-blue-50">
          <div className="flex items-end gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleListening}
              className={`p-3 rounded-full transition-all duration-300 ${
                isListening 
                  ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-lg animate-pulse' 
                  : 'bg-gradient-to-r from-gray-200 to-gray-300 text-gray-600 hover:from-gray-300 hover:to-gray-400 shadow-md'
              }`}
              aria-label={isListening ? 'Stop listening' : 'Start voice input'}
            >
              {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </motion.button>
            
            <div className="flex-1">
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={
                  (selectedLanguage || detectedLanguage) === 'hi' 
                    ? 'अपना संदेश लिखें या माइक पर क्लिक करें...' 
                    : 'Type your message or click mic...'
                }
                className="w-full p-4 border-2 border-gray-200 rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-[#1E90FF] focus:border-transparent text-base bg-white shadow-sm transition-all duration-300"
                rows={1}
                style={{ minHeight: '52px', maxHeight: '120px' }}
              />
            </div>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSendMessage}
              disabled={!inputText.trim() || isLoading}
              className="p-3 bg-gradient-to-r from-[#1E90FF] to-[#00BFFF] text-white rounded-full hover:from-[#1E7FE6] hover:to-[#0099CC] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg"
              aria-label="Send message"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </motion.button>
          </div>
          
          <div className="mt-3 text-xs text-gray-600 text-center flex items-center justify-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span>
              {(selectedLanguage || detectedLanguage) === 'hi' 
                ? `भाषा: ${languageNames[selectedLanguage || detectedLanguage]} • Enter दबाकर भेजें`
                : `Language: ${languageNames[selectedLanguage || detectedLanguage]} • Press Enter to send`
              }
            </span>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default YojnaSaathi;
