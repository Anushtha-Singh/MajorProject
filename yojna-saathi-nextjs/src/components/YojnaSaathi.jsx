'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { MessageCircle, X, Mic, MicOff, Volume2, VolumeX, Send, Loader2, Globe, Copy, Check, RotateCcw, ArrowDown, RefreshCw, ChevronLeft } from 'lucide-react';
import Image from 'next/image';
import { languagePatterns, languageNames, languageDisplayNames, greetings } from '@/data/schemesData';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import translations from '@/lib/translations';

// Custom AI chatbot icon — supports both bot2 and bot3 depending on context
const ChatbotIcon = ({ size = 24, className = "", src = "/bot3.png" }) => (
  <Image src={src} alt="Bot" width={size} height={size} priority={true} className={`object-contain ${className}`} />
);

// Category chips — shown after greeting, one set per language
const categoryChips = {
  en: [
    { label: '🌾 Agriculture', text: 'Show me agriculture schemes for farmers' },
    { label: '🏥 Health', text: 'Show me health insurance schemes' },
    { label: '🏠 Housing', text: 'Show me housing schemes' },
    { label: '🎓 Education', text: 'Show me education and scholarship schemes' },
    { label: '💼 Business & Loan', text: 'Show me business loan schemes' },
    { label: '👩 Women & Child', text: 'Show me schemes for women and children' },
  ],
  hi: [
    { label: '🌾 कृषि', text: 'किसानों के लिए कृषि योजनाएं बताइए' },
    { label: '🏥 स्वास्थ्य', text: 'स्वास्थ्य बीमा योजनाएं बताइए' },
    { label: '🏠 आवास', text: 'आवास योजनाएं बताइए' },
    { label: '🎓 शिक्षा', text: 'शिक्षा और छात्रवृत्ति योजनाएं बताइए' },
    { label: '💼 बिजनेस लोन', text: 'बिजनेस लोन योजनाएं बताइए' },
    { label: '👩 महिला एवं बाल', text: 'महिलाओं और बच्चों के लिए योजनाएं बताइए' },
  ],
  bn: [
    { label: '🌾 কৃষি', text: 'কৃষকদের জন্য কৃষি প্রকল্প দেখান' },
    { label: '🏥 স্বাস্থ্য', text: 'স্বাস্থ্য বীমা প্রকল্প দেখান' },
    { label: '🏠 আবাসন', text: 'আবাসন প্রকল্প দেখান' },
    { label: '🎓 শিক্ষা', text: 'শিক্ষা ও বৃত্তি প্রকল্প দেখান' },
    { label: '💼 ব্যবসা ও ঋণ', text: 'ব্যবসায়িক ঋণ প্রকল্প দেখান' },
    { label: '👩 মহিলা ও শিশু', text: 'মহিলা ও শিশুদের জন্য প্রকল্প দেখান' },
  ],
  ta: [
    { label: '🌾 விவசாயம்', text: 'விவசாயிகளுக்கான திட்டங்களைக் காட்டு' },
    { label: '🏥 சுகாதாரம்', text: 'சுகாதார காப்பீட்டு திட்டங்களைக் காட்டு' },
    { label: '🏠 வீட்டுவசதி', text: 'வீட்டுவசதி திட்டங்களைக் காட்டு' },
    { label: '🎓 கல்வி', text: 'கல்வி மற்றும் உதவித்தொகை திட்டங்களைக் காட்டு' },
    { label: '💼 வணிகம்', text: 'வணிக கடன் திட்டங்களைக் காட்டு' },
    { label: '👩 பெண்கள் & குழந்தை', text: 'பெண்கள் மற்றும் குழந்தைகளுக்கான திட்டங்களைக் காட்டு' },
  ],
  te: [
    { label: '🌾 వ్యవసాయం', text: 'రైతులకు వ్యవసాయ పథకాలు చూపించు' },
    { label: '🏥 ఆరోగ్యం', text: 'ఆరోగ్య బీమా పథకాలు చూపించు' },
    { label: '🏠 గృహనిర్మాణం', text: 'గృహ పథకాలు చూపించు' },
    { label: '🎓 విద్య', text: 'విద్య మరియు స్కాలర్‌షిప్ పథకాలు చూపించు' },
    { label: '💼 వ్యాపారం', text: 'వ్యాపార రుణ పథకాలు చూపించు' },
    { label: '👩 మహిళలు & పిల్లలు', text: 'మహిళలు మరియు పిల్లల పథకాలు చూపించు' },
  ],
  mr: [
    { label: '🌾 शेती', text: 'शेतकऱ्यांसाठी कृषी योजना दाखवा' },
    { label: '🏥 आरोग्य', text: 'आरोग्य विमा योजना दाखवा' },
    { label: '🏠 गृहनिर्माण', text: 'गृहनिर्माण योजना दाखवा' },
    { label: '🎓 शिक्षण', text: 'शिक्षण आणि शिष्यवृत्ती योजना दाखवा' },
    { label: '💼 व्यवसाय कर्ज', text: 'व्यवसाय कर्ज योजना दाखवा' },
    { label: '👩 महिला व बाल', text: 'महिला आणि मुलांसाठी योजना दाखवा' },
  ],
  gu: [
    { label: '🌾 ખેતી', text: 'ખેડૂતો માટે કૃષિ યોજનાઓ બતાવો' },
    { label: '🏥 આરોગ્ય', text: 'આરોગ્ય વીમા યોજનાઓ બતાવો' },
    { label: '🏠 ગૃહ', text: 'ગૃહ યોજનાઓ બતાવો' },
    { label: '🎓 શિક્ષણ', text: 'શિક્ષણ અને શિષ્યવૃત્તિ યોજનાઓ બતાવો' },
    { label: '💼 વ્યવસાય લોન', text: 'વ્યવસાય લોન યોજનાઓ બતાવો' },
    { label: '👩 મહિલા & બાળ', text: 'મહિલા અને બાળકો માટે યોજનાઓ બતાવો' },
  ],
  kn: [
    { label: '🌾 ಕೃಷಿ', text: 'ರೈತರಿಗೆ ಕೃಷಿ ಯೋಜನೆಗಳನ್ನು ತೋರಿಸು' },
    { label: '🏥 ಆರೋಗ್ಯ', text: 'ಆರೋಗ್ಯ ವಿಮೆ ಯೋಜನೆಗಳನ್ನು ತೋರಿಸು' },
    { label: '🏠 ವಸತಿ', text: 'ವಸತಿ ಯೋಜನೆಗಳನ್ನು ತೋರಿಸು' },
    { label: '🎓 ಶಿಕ್ಷಣ', text: 'ಶಿಕ್ಷಣ ಮತ್ತು ವಿದ್ಯಾರ್ಥಿವೇತನ ಯೋಜನೆಗಳನ್ನು ತೋರಿಸು' },
    { label: '💼 ವ್ಯಾಪಾರ ಸಾಲ', text: 'ವ್ಯಾಪಾರ ಸಾಲ ಯೋಜನೆಗಳನ್ನು ತೋರಿಸು' },
    { label: '👩 ಮಹಿಳೆ & ಮಗು', text: 'ಮಹಿಳೆ ಮತ್ತು ಮಕ್ಕಳಿಗೆ ಯೋಜನೆಗಳನ್ನು ತೋರಿಸು' },
  ],
  ml: [
    { label: '🌾 കൃഷി', text: 'കർഷകർക്കുള്ള കൃഷി പദ്ധതികൾ കാണിക്കൂ' },
    { label: '🏥 ആരോഗ്യം', text: 'ആരോഗ്യ ഇൻഷുറൻസ് പദ്ധതികൾ കാണിക്കൂ' },
    { label: '🏠 ഭവനം', text: 'ഭവന പദ്ധതികൾ കാണിക്കൂ' },
    { label: '🎓 വിദ്യാഭ്യാസം', text: 'വിദ്യാഭ്യാസ, സ്കോളർഷിപ്പ് പദ്ധതികൾ കാണിക്കൂ' },
    { label: '💼 ബിസിനസ് വായ്പ', text: 'ബിസിനസ് വായ്പ പദ്ധതികൾ കാണിക്കൂ' },
    { label: '👩 സ്ത്രീകൾ & കുട്ടി', text: 'സ്ത്രീകൾക്കും കുട്ടികൾക്കുമുള്ള പദ്ധതികൾ കാണിക്കൂ' },
  ],
  pa: [
    { label: '🌾 ਖੇਤੀ', text: 'ਕਿਸਾਨਾਂ ਲਈ ਖੇਤੀ ਯੋਜਨਾਵਾਂ ਦਿਖਾਓ' },
    { label: '🏥 ਸਿਹਤ', text: 'ਸਿਹਤ ਬੀਮਾ ਯੋਜਨਾਵਾਂ ਦਿਖਾਓ' },
    { label: '🏠 ਮਕਾਨ', text: 'ਮਕਾਨ ਯੋਜਨਾਵਾਂ ਦਿਖਾਓ' },
    { label: '🎓 ਸਿੱਖਿਆ', text: 'ਸਿੱਖਿਆ ਅਤੇ ਵਜ਼ੀਫ਼ਾ ਯੋਜਨਾਵਾਂ ਦਿਖਾਓ' },
    { label: '💼 ਕਾਰੋਬਾਰ ਕਰਜ਼ਾ', text: 'ਕਾਰੋਬਾਰ ਕਰਜ਼ਾ ਯੋਜਨਾਵਾਂ ਦਿਖਾਓ' },
    { label: '👩 ਔਰਤਾਂ & ਬੱਚੇ', text: 'ਔਰਤਾਂ ਅਤੇ ਬੱਚਿਆਂ ਲਈ ਯੋਜਨਾਵਾਂ ਦਿਖਾਓ' },
  ],
  ur: [
    { label: '🌾 زراعت', text: 'کسانوں کے لیے زرعی اسکیمیں دکھائیں' },
    { label: '🏥 صحت', text: 'صحت بیمہ اسکیمیں دکھائیں' },
    { label: '🏠 رہائش', text: 'رہائشی اسکیمیں دکھائیں' },
    { label: '🎓 تعلیم', text: 'تعلیم اور وظیفہ اسکیمیں دکھائیں' },
    { label: '💼 کاروبار قرض', text: 'کاروباری قرض اسکیمیں دکھائیں' },
    { label: '👩 خواتین & بچے', text: 'خواتین اور بچوں کے لیے اسکیمیں دکھائیں' },
  ],
};

// Extract numbered options from bot response for dynamic chips
const extractOptions = (text) => {
  if (!text) return [];
  const options = [];
  // Match patterns like "1. **Scheme Name**" or "1. Scheme Name —"
  const regex = /^\s*(\d+)\.\s+\*{0,2}([^*\n—–-]+)\*{0,2}/gm;
  let match;
  while ((match = regex.exec(text)) !== null) {
    const num = match[1];
    const name = match[2].trim().replace(/[—–-].*$/, '').trim();
    if (name.length > 2 && name.length < 80) {
      options.push({ label: `${num}. ${name}`, text: num });
    }
  }
  return options.slice(0, 6);
};

const YojnaSaathi = ({ isFullPage = false, onToggleFullPage }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [detectedLang, setDetectedLang] = useState(() => {
    if (typeof window !== 'undefined') return localStorage.getItem('yojna_lang') || 'en';
    return 'en';
  });
  const [selectedLang, setSelectedLang] = useState(() => {
    if (typeof window !== 'undefined') return localStorage.getItem('yojna_lang') || 'en';
    return 'en';
  });
  const [isListening, setIsListening] = useState(false);
  const [playingMsgId, setPlayingMsgId] = useState(null);
  const [isInit, setIsInit] = useState(false);
  const [showLangPicker, setShowLangPicker] = useState(false);
  const [copiedMsgId, setCopiedMsgId] = useState(null);
  const [showScrollBtn, setShowScrollBtn] = useState(false);
  const [schemeContextInit, setSchemeContextInit] = useState(false);

  const endRef = useRef(null);
  const chatContainerRef = useRef(null);
  const recRef = useRef(null);
  const synthRef = useRef(null);
  const voicesRef = useRef([]);
  const audioRef = useRef(null);

  // Auto scroll to bottom
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  // Scroll FAB visibility
  const handleScroll = useCallback(() => {
    if (!chatContainerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
    setShowScrollBtn(scrollHeight - scrollTop - clientHeight > 120);
  }, []);

  const scrollToBottom = () => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const detect = useCallback((text) => {
    if (!text) return 'en';
    for (const [l, p] of Object.entries(languagePatterns)) { if (p.test(text)) return l; }
    return 'en';
  }, []);

  // BUG FIX: Update mic language when selectedLang changes
  useEffect(() => {
    if (recRef.current) {
      const micLang = ({ hi: 'hi-IN', ta: 'ta-IN', te: 'te-IN', bn: 'bn-IN', en: 'en-IN', gu: 'gu-IN', pa: 'pa-IN', kn: 'kn-IN', ml: 'ml-IN', or: 'or-IN', mr: 'mr-IN' })[selectedLang] || 'en-IN';
      recRef.current.lang = micLang;
    }
  }, [selectedLang]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
      recRef.current = new SR(); recRef.current.continuous = false; recRef.current.interimResults = false;
      recRef.current.lang = 'en-IN'; // Will be dynamically updated by useEffect above
      recRef.current.onresult = (e) => { setInputText(e.results[0][0].transcript); setIsListening(false); };
      recRef.current.onerror = () => setIsListening(false);
      recRef.current.onend = () => setIsListening(false);
    }
    if ('speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis;
      const loadVoices = () => { voicesRef.current = window.speechSynthesis.getVoices(); };
      loadVoices();
      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = loadVoices;
      }
    }
    return () => { recRef.current?.stop(); };
  }, []);

  const speak = useCallback((text, msgId) => {
    if (!synthRef.current) return;

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }

    // Toggle: stop if already playing this message
    if (playingMsgId === msgId) {
      synthRef.current.cancel();
      setPlayingMsgId(null);
      return;
    }

    const cleanText = text.replace(/https?:\/\/[^\s]+/g, '').replace(/[*#_]/g, '').replace(/\s+/g, ' ').trim();

    synthRef.current.cancel();
    const u = new SpeechSynthesisUtterance(cleanText);

    // Auto-detect language from the TEXT itself, not the UI setting
    const detectedTextLang = detect(cleanText);
    const targetLang = ({ hi: 'hi-IN', ta: 'ta-IN', te: 'te-IN', bn: 'bn-IN', en: 'en-IN', gu: 'gu-IN', pa: 'pa-IN', kn: 'kn-IN', ml: 'ml-IN', or: 'or-IN', mr: 'mr-IN' })[detectedTextLang] || 'en-IN';
    u.lang = targetLang;

    if (voicesRef.current.length > 0) {
      const langVoices = voicesRef.current.filter(v => v.lang === targetLang || v.lang.startsWith(detectedTextLang));
      if (langVoices.length > 0) {
        u.voice = langVoices.find(v => v.name.includes('Google') || v.name.includes('Premium') || v.name.includes('Natural')) || langVoices[0];
      }
    }
    u.rate = 0.95;
    u.pitch = 1.0;

    u.onend = () => setPlayingMsgId(null);
    u.onerror = () => setPlayingMsgId(null);

    setPlayingMsgId(msgId);
    synthRef.current.speak(u);
  }, [playingMsgId, detect]);

  const loadSchemeContext = useCallback((sId) => {
    if (!sId) return;
    setIsOpen(true); // Always open the chat when the button is clicked

    if (schemeContextInit) return; // Don't fetch again if already initialized

    setSchemeContextInit(true);
    setIsLoading(true);
    fetch(`/api/schemes/${sId}`)
      .then(res => res.json())
      .then(data => {
        if (data && data['Scheme Title']) {
          const context = `[SYSTEM CONTEXT: The user wants to check their eligibility for the scheme "${data['Scheme Title']}".
Eligibility Rules:
${data.Eligibility || 'Not specified'}
Benefits:
${data.Benefits || 'Not specified'}
Task: You are an Eligibility Checker. Ask the user for their age, location, occupation, or any specific requirements mentioned in the rules above ONE BY ONE to determine if they are eligible. Ask in their language.]`;

          const botGreeting = `नमस्ते! मैं **${data['Scheme Title']}** के लिए आपकी पात्रता (eligibility) जांचने में मदद करूंगा। \n\nक्या आप मुझे अपनी उम्र, राज्य, और व्यवसाय (occupation) बता सकते हैं?`;

          setMessages([
            { id: crypto.randomUUID(), type: 'user', text: context, isHidden: true, ts: new Date() },
            { id: crypto.randomUUID(), type: 'bot', text: botGreeting, ts: new Date() }
          ]);
        }
      })
      .catch(e => console.error(e))
      .finally(() => setIsLoading(false));
  }, [schemeContextInit]);

  useEffect(() => {
    const handleEvent = (e) => loadSchemeContext(e.detail);
    window.addEventListener('openChatWithScheme', handleEvent);

    // Also check URL on mount in case they came directly
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const sId = params.get('schemeId');
      if (sId) loadSchemeContext(sId);
    }

    return () => window.removeEventListener('openChatWithScheme', handleEvent);
  }, [loadSchemeContext]);

  // Auto-send ?msg= param (used by Find Schemes questionnaire)
  useEffect(() => {
    if (!isFullPage) return;
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const msg = params.get('msg');
    if (!msg) return;
    const decoded = decodeURIComponent(msg);
    // Small delay to let the component fully initialise before sending
    const t = setTimeout(() => sendMessage(decoded), 800);
    // Clean URL so refresh doesn't re-send
    window.history.replaceState({}, '', window.location.pathname);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFullPage]);

  const init = useCallback(() => {
    if (isInit) return;
    setIsInit(true);
  }, [isInit]);

  useEffect(() => {
    if (isFullPage) init();
  }, [isFullPage, init]);

  const open = () => { setIsOpen(true); if (!isInit) init(); };
  const close = () => {
    setIsOpen(false);
    recRef.current?.stop();
    synthRef.current?.cancel();
    setPlayingMsgId(null); // BUG FIX: reset playing state on close
    if (audioRef.current) audioRef.current.pause();
  };

  const newChat = () => {
    synthRef.current?.cancel();
    setPlayingMsgId(null);
    setMessages([]);
    setIsLoading(false);
    setInputText('');
  };

  const copyMessage = async (text, msgId) => {
    const cleanText = text.replace(/[*#_]/g, '');
    await navigator.clipboard.writeText(cleanText);
    setCopiedMsgId(msgId);
    setTimeout(() => setCopiedMsgId(null), 2000);
  };

  const sendMessage = async (msgText) => {
    const text = msgText || inputText;
    if (!text.trim() || isLoading) return;

    const userMsgId = crypto.randomUUID();
    const botMsgId = crypto.randomUUID();

    // BUG FIX: Capture current messages BEFORE updating state to avoid stale closure
    const currentMessages = [...messages, { id: userMsgId, type: 'user', text: text, ts: new Date() }];

    setMessages(currentMessages);
    setInputText('');
    setIsLoading(true);

    const lang = detect(text);
    setDetectedLang(lang);
    const currentLang = selectedLang || lang;

    try {
      // BUG FIX: Don't add empty bot bubble yet, wait for first stream chunk
      const r = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          // BUG FIX: Filter empty messages & send fresh state
          messages: currentMessages.filter(m => m.text && m.text.trim()),
          language: currentLang
        })
      });

      if (!r.ok) throw new Error('API failed');

      const reader = r.body.getReader();
      const decoder = new TextDecoder();
      let fullText = '';
      let botAdded = false;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        fullText += decoder.decode(value, { stream: true });

        // BUG FIX: Only add bot bubble once we have actual text (no empty flash)
        if (!botAdded && fullText.trim()) {
          setMessages(p => [...p, { id: botMsgId, type: 'bot', text: fullText, ts: new Date() }]);
          botAdded = true;
        } else if (botAdded) {
          setMessages(p => p.map(m => m.id === botMsgId ? { ...m, text: fullText } : m));
        }
      }

      // Edge case: if stream was empty
      if (!botAdded && fullText) {
        setMessages(p => [...p, { id: botMsgId, type: 'bot', text: fullText, ts: new Date() }]);
      }
    } catch {
      setMessages(p => [...p, { id: crypto.randomUUID(), type: 'bot', text: lang === 'hi' ? 'क्षमा करें, त्रुटि हुई। कृपया दोबारा कोशिश करें।' : 'Sorry, something went wrong. Please try again.', ts: new Date(), isError: true, retryText: text }]);
    }
    finally { setIsLoading(false); }
  };

  const send = () => sendMessage(inputText);
  const onKey = (e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } };
  const activeLang = selectedLang || detectedLang;

  // ── FAB ──
  if (!isOpen && !isFullPage) {
    return (
      // ── FAB BUTTON ──
      // To move the icon: change bottom-2/right-1 values (negative = off-screen edge)
      // To resize the icon: change the `size` prop below (currently 200)
      <button onClick={open}
        className="fixed bottom-2 right-1 sm:bottom-3 sm:right-2 z-50 flex items-center justify-center hover:scale-110 transition-transform"
        id="chatbot-toggle">
        <ChatbotIcon src="/bot2.png" size={200} className="drop-shadow-2xl" />
        <span className="absolute top-4 right-4 w-6 h-6 rounded-full bg-emerald-400 border-[3px] border-white animate-pulse-dot" style={{ boxShadow: '0 0 10px rgba(52,211,153,0.9)' }} />
      </button>
    );
  }

  return (
    <div className={isFullPage
      ? "fixed inset-0 z-50 flex flex-col bg-slate-50"
      : "fixed z-50 bottom-0 right-0 sm:bottom-6 sm:right-6 w-full h-[100dvh] sm:w-[380px] sm:h-[600px] sm:max-h-[calc(100vh-72px)] bg-white sm:rounded-3xl sm:border border-black/8 flex flex-col overflow-hidden"
    } style={!isFullPage ? { boxShadow: '0 32px 80px rgba(59,130,246,0.22), 0 8px 24px rgba(0,0,0,0.12)' } : {}}>
      {/* Header */}
      <div className="shrink-0 flex items-center justify-between px-4 py-4 text-white z-10 relative overflow-hidden" style={{ background: 'linear-gradient(135deg,#2563EB 0%,#3B82F6 50%,#60A5FA 100%)' }}>
        <div className="absolute inset-0 opacity-15" style={{ backgroundImage: 'radial-gradient(circle at 80% 50%, #93C5FD 0%, transparent 60%)' }} />
        <div className="flex items-center gap-3 relative">
          {isFullPage && onToggleFullPage && (
            <button onClick={onToggleFullPage} className="p-2 -ml-2 rounded-xl hover:bg-white/20 transition-colors shrink-0" title="Back">
              <ChevronLeft className="w-6 h-6" />
            </button>
          )}
          <div className="flex items-center justify-center shrink-0 -ml-2">
            <ChatbotIcon size={66} className="drop-shadow-md" />
          </div>
          <div>
            <div className="font-bold text-base tracking-tight">YojnaSaathi</div>
            <div className="text-xs text-white/70 flex items-center gap-1.5 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse-dot" style={{ boxShadow: '0 0 8px rgba(52,211,153,0.9)' }} />
              Online · {languageNames[activeLang]}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-0.5 relative">
          {messages.length > 0 && (
            <button onClick={newChat} className="p-2.5 rounded-xl hover:bg-white/20 transition-colors" title="New Chat">
              <RefreshCw className="w-4 h-4" />
            </button>
          )}
          <button onClick={() => setShowLangPicker(!showLangPicker)} className="p-2.5 rounded-xl hover:bg-white/20 transition-colors" title="Change Language">
            <Globe className="w-4.5 h-4.5" />
          </button>
          {!isFullPage && (
            <button onClick={close} className="p-2.5 rounded-xl hover:bg-white/20 transition-colors">
              <X className="w-4.5 h-4.5" />
            </button>
          )}
        </div>
      </div>

      {/* Language Picker */}
      {showLangPicker && (
        <div className="shrink-0 p-3 bg-white border-b border-black/5 shadow-sm z-10">
          <div className="grid grid-cols-2 gap-2">
            {Object.entries(languageDisplayNames).map(([code, name]) => (
              <button key={code} onClick={() => { setSelectedLang(code); setShowLangPicker(false); }}
                className={`px-2 py-2 rounded-lg text-xs font-bold transition-all text-left leading-tight
                  ${activeLang === code ? 'text-white shadow-sm' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                style={activeLang === code ? { background: 'linear-gradient(135deg,#1D4ED8,#2563EB)' } : {}}>
                {name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Messages / Welcome Screen */}
      {messages.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center px-5 py-6 relative overflow-hidden" style={{ background: '#f8faff' }}>

          {/* Site-matching blue ambient blobs */}
          <div className="blob-1 absolute rounded-full" style={{ width: '320px', height: '320px', background: 'radial-gradient(circle,rgba(59,130,246,0.18),rgba(96,165,250,0.1))', filter: 'blur(80px)', top: '-20%', left: '-25%' }} />
          <div className="blob-2 absolute rounded-full" style={{ width: '260px', height: '260px', background: 'radial-gradient(circle,rgba(96,165,250,0.15),rgba(147,197,253,0.08))', filter: 'blur(70px)', bottom: '-5%', right: '-20%' }} />
          <div className="blob-3 absolute rounded-full" style={{ width: '200px', height: '200px', background: 'radial-gradient(circle,rgba(37,99,235,0.12),rgba(59,130,246,0.08))', filter: 'blur(60px)', bottom: '20%', left: '-10%' }} />

          {/* Bot icon */}
          <div className="relative z-15 mb-1 mt-22 flex items-center justify-center">
            <ChatbotIcon src="/bot2.png" size={150} className="drop-shadow-2xl animate-float" />
            {/* Green active dot */}
            <span className="absolute bottom-4 right-1 w-5 h-5 rounded-full bg-emerald-400 border-[3px] border-white z-20 animate-pulse-dot" style={{ boxShadow: '0 0 12px rgba(52,211,153,0.9)' }} />
          </div>

          {/* Title */}
          <h3 className="text-[22px] font-extrabold mb-1 tracking-tight z-10" style={{ background: 'linear-gradient(135deg,#3B82F6,#3B82F6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>YojnaSaathi</h3>
          <p className="text-xs text-gray-500 mb-4 text-center leading-relaxed z-10 max-w-[190px]">India&apos;s AI assistant for government welfare schemes</p>

          {/* Feature chips */}
          <div className="flex flex-wrap gap-2 justify-center mb-5 z-10">
            {[['🌾', 'Schemes'], ['🏥', 'Health'], ['🎓', 'Education'], ['🏠', 'Housing']].map(([icon, label]) => (
              <span key={label} className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold" style={{ background: 'rgba(59,130,246,0.08)', color: '#1D4ED8', border: '1.5px solid rgba(99,102,241,0.2)' }}>
                {icon} {label}
              </span>
            ))}
          </div>

          {/* Language divider */}
          <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-3 z-10">Choose your language</p>

          {/* Language buttons — shows bilingual format e.g. हिन्दी - Hindi */}
          <div className="grid grid-cols-2 gap-2 w-full max-w-[320px] z-10">
            {Object.entries(languageDisplayNames).slice(0, 8).map(([code, name]) => (
              <button key={code} onClick={() => {
                setSelectedLang(code);
                const g = greetings[code] || greetings.en;
                setMessages([{ id: crypto.randomUUID(), type: 'bot', text: g, ts: new Date() }]);
              }}
                className="py-2 px-3 rounded-2xl text-xs font-bold transition-all hover:scale-[1.04] active:scale-95 bg-white shadow-md hover:shadow-lg text-left leading-tight hover:bg-blue-50"
                style={{ border: '2px solid rgba(59,130,246,0.2)', color: '#2563EB' }}>
                {name}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 sm:gap-4 chat-bg relative" ref={chatContainerRef} onScroll={handleScroll}>
          {messages.filter(m => !m.isHidden).map(m => (
            <div key={m.id} className={`flex items-end gap-2 ${m.type === 'user' ? 'justify-end' : 'justify-start'} animate-in`}>
              {m.type === 'bot' && (
                <div className="shrink-0 flex items-center justify-center mb-1">
                  <ChatbotIcon size={40} className="drop-shadow-sm" />
                </div>
              )}
              <div className={`max-w-[78%] sm:max-w-[74%] px-4 py-3 rounded-2xl text-[14px] leading-relaxed break-words
              ${m.type === 'user'
                  ? 'text-white rounded-br-none'
                  : m.isError ? 'bg-red-50 text-red-700 border border-red-200 rounded-bl-none shadow-sm' : 'rounded-bl-none border shadow-sm'}`}
                style={m.type === 'user'
                  ? { background: 'linear-gradient(135deg,#3B82F6 0%,#60A5FA 100%)', boxShadow: '0 4px 16px rgba(59,130,246,0.3)' }
                  : m.isError ? {} : { background: '#EFF6FF', borderColor: '#BFDBFE', color: '#1E3A8A' }}>

                {m.type === 'user' ? (
                  <div className="whitespace-pre-wrap">{m.text}</div>
                ) : (
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      p: ({ node, ...props }) => <p className="mb-2 last:mb-0" {...props} />,
                      strong: ({ node, ...props }) => <strong className="font-bold" style={{ color: m.type === 'user' ? '#bfdbfe' : '#2563EB' }} {...props} />,
                      ul: ({ node, ...props }) => <ul className="list-disc pl-4 mb-2 space-y-1" {...props} />,
                      ol: ({ node, ...props }) => <ol className="list-decimal pl-4 mb-2 space-y-1" {...props} />,
                      li: ({ node, ...props }) => <li className="marker:text-[#3B82F6]/50" {...props} />,
                      a: ({ node, href, ...props }) => <a href={href} target="_blank" rel="noopener noreferrer" className="underline opacity-80 hover:opacity-100" {...props} />,
                    }}
                  >
                    {m.text}
                  </ReactMarkdown>
                )}

                <div className={`flex items-center gap-2 mt-1.5 ${m.type === 'user' ? 'justify-end text-white/60' : 'justify-between text-gray-400'}`}>
                  {m.type === 'bot' && (
                    <div className="flex items-center gap-1.5">
                      <button onClick={() => speak(m.text, m.id)} className="hover:text-[#3B82F6] transition-colors p-0.5" title={playingMsgId === m.id ? 'Stop' : 'Play'}>
                        {playingMsgId === m.id ? <VolumeX className="w-3.5 h-3.5 text-[#3B82F6]" /> : <Volume2 className="w-3.5 h-3.5" />}
                      </button>
                      <button onClick={() => copyMessage(m.text, m.id)} className="hover:text-[#3B82F6] transition-colors p-0.5" title="Copy">
                        {copiedMsgId === m.id ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                      {m.isError && m.retryText && (
                        <button onClick={() => sendMessage(m.retryText)} className="hover:text-red-600 transition-colors p-0.5" title="Retry">
                          <RotateCcw className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  )}
                  <div className="text-[10px] sm:text-xs font-medium">
                    {m.ts.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Typing Indicator */}
          {isLoading && (
            <div className="flex items-end gap-2 justify-start animate-in">
              <div className="shrink-0 flex items-center justify-center">
                <ChatbotIcon size={40} className="drop-shadow-sm" />
              </div>
              <div className="bg-white border border-black/5 px-4 py-3.5 rounded-2xl rounded-bl-none flex items-center gap-1.5 shadow-sm">
                <span className="typing-dot w-2 h-2 rounded-full bg-[#3B82F6]" />
                <span className="typing-dot w-2 h-2 rounded-full bg-[#3B82F6]" />
                <span className="typing-dot w-2 h-2 rounded-full bg-[#3B82F6]" />
              </div>
            </div>
          )}

          {/* Dynamic Quick Reply Chips */}
          {!isLoading && messages.length > 0 && messages[messages.length - 1]?.type === 'bot' && (() => {
            const lastBotMsg = messages[messages.length - 1];
            const dynamicOptions = extractOptions(lastBotMsg.text);

            // Show dynamic numbered options if bot gave a list
            if (dynamicOptions.length > 1) {
              return (
                <div className="flex flex-wrap gap-2 mt-1 animate-in">
                  {dynamicOptions.map((chip, i) => (
                    <button key={i} onClick={() => sendMessage(chip.text)}
                      className="chip-btn px-3 py-1.5 text-xs font-semibold bg-white border border-[#3B82F6]/20 text-[#3B82F6] rounded-full hover:bg-[#3B82F6]/5 hover:border-[#3B82F6]/50 transition-all active:scale-95 shadow-sm">
                      {chip.label}
                    </button>
                  ))}
                </div>
              );
            }

            // Show category chips only after first greeting (ignore hidden messages)
            if (messages.filter(m => !m.isHidden).length <= 2) {
              return (
                <div className="flex flex-wrap gap-2 mt-1 animate-in">
                  {(categoryChips[activeLang] || categoryChips.en).map((chip, i) => (
                    <button key={i} onClick={() => sendMessage(chip.text)}
                      className="chip-btn px-3 py-1.5 text-xs font-semibold bg-white border border-[#3B82F6]/20 text-[#3B82F6] rounded-full hover:bg-[#3B82F6]/5 hover:border-[#3B82F6]/50 transition-all active:scale-95 shadow-sm">
                      {chip.label}
                    </button>
                  ))}
                </div>
              );
            }

            // Show contextual follow-up chips after detailed responses
            const followUpDict = {
              hi: [{ label: '📝 Apply कैसे करें?', text: 'इसके लिए apply कैसे करें?' }, { label: '📄 Documents?', text: 'कौन कौन से documents चाहिए?' }, { label: '🔙 और योजनाएं', text: 'और योजनाएं दिखाओ' }],
              bn: [{ label: '📝 আবেদন করবেন?', text: 'এর জন্য আবেদন কীভাবে করব?' }, { label: '📄 নথিপত্র?', text: 'কোন কোন নথিপত্র দরকার?' }, { label: '🔙 আরও প্রকল্প', text: 'আরও প্রকল্প দেখাও' }],
              ta: [{ label: '📝 விண்ணப்பிக்க?', text: 'இதற்கு எப்படி விண்ணப்பிப்பது?' }, { label: '📄 ஆவணங்கள்?', text: 'என்ன ஆவணங்கள் தேவை?' }, { label: '🔙 மேலும் திட்டங்கள்', text: 'மேலும் திட்டங்கள் காட்டு' }],
              te: [{ label: '📝 దరఖాస్తు చేయడం?', text: 'దీనికి ఎలా దరఖాస్తు చేయాలి?' }, { label: '📄 పత్రాలు?', text: 'ఏ పత్రాలు అవసరం?' }, { label: '🔙 మరిన్ని పథకాలు', text: 'మరిన్ని పథకాలు చూపించు' }],
              mr: [{ label: '📝 अर्ज कसा करायचा?', text: 'यासाठी अर्ज कसा करायचा?' }, { label: '📄 कागदपत्रे?', text: 'कोणती कागदपत्रे लागतात?' }, { label: '🔙 आणखी योजना', text: 'आणखी योजना दाखवा' }],
              gu: [{ label: '📝 અરજી કેવી રીતે?', text: 'આ માટે અરજી કેવી રીતે કરવી?' }, { label: '📄 દસ્તાવેજો?', text: 'કયા દસ્તાવેજો જોઈએ?' }, { label: '🔙 વધુ યોજનાઓ', text: 'વધુ યોજનાઓ બતાવો' }],
              kn: [{ label: '📝 ಅರ್ಜಿ ಹೇಗೆ?', text: 'ಇದಕ್ಕೆ ಅರ್ಜಿ ಹೇಗೆ ಸಲ್ಲಿಸಬೇಕು?' }, { label: '📄 ದಾಖಲೆಗಳು?', text: 'ಯಾವ ದಾಖಲೆಗಳು ಬೇಕು?' }, { label: '🔙 ಇನ್ನಷ್ಟು ಯೋಜನೆಗಳು', text: 'ಇನ್ನಷ್ಟು ಯೋಜನೆಗಳು ತೋರಿಸು' }],
              ml: [{ label: '📝 അപേക്ഷ?', text: 'ഇതിനായി എങ്ങനെ അപേക്ഷിക്കണം?' }, { label: '📄 രേഖകൾ?', text: 'ഏതൊക്കെ രേഖകൾ വേണം?' }, { label: '🔙 കൂടുതൽ പദ്ധതികൾ', text: 'കൂടുതൽ പദ്ധതികൾ കാണിക്കൂ' }],
              pa: [{ label: '📝 ਅਰਜ਼ੀ ਕਿਵੇਂ?', text: 'ਇਸ ਲਈ ਅਰਜ਼ੀ ਕਿਵੇਂ ਕਰਨੀ ਹੈ?' }, { label: '📄 ਦਸਤਾਵੇਜ਼?', text: 'ਕਿਹੜੇ ਦਸਤਾਵੇਜ਼ ਚਾਹੀਦੇ ਹਨ?' }, { label: '🔙 ਹੋਰ ਯੋਜਨਾਵਾਂ', text: 'ਹੋਰ ਯੋਜਨਾਵਾਂ ਦਿਖਾਓ' }],
              ur: [{ label: '📝 درخواست کیسے?', text: 'اس کے لیے درخواست کیسے دیں؟' }, { label: '📄 دستاویزات?', text: 'کون سے دستاویزات چاہئیں؟' }, { label: '🔙 مزید اسکیمیں', text: 'مزید اسکیمیں دکھائیں' }],
            };
            const followUps = followUpDict[activeLang] || [{ label: '📝 How to Apply?', text: 'How to apply for this scheme?' }, { label: '📄 Documents?', text: 'What documents are required?' }, { label: '🔙 More Schemes', text: 'Show me more schemes' }];
            return (
              <div className="flex flex-wrap gap-2 mt-1 animate-in">
                {followUps.map((chip, i) => (
                  <button key={i} onClick={() => sendMessage(chip.text)}
                    className="chip-btn px-3 py-1.5 text-xs font-semibold bg-white border border-[#3B82F6]/20 text-[#3B82F6] rounded-full hover:bg-[#3B82F6]/5 hover:border-[#3B82F6]/50 transition-all active:scale-95 shadow-sm">
                    {chip.label}
                  </button>
                ))}
              </div>
            );
          })()}

          <div ref={endRef} />

          {/* Scroll to Bottom FAB */}
          {showScrollBtn && (
            <button onClick={scrollToBottom} className="sticky bottom-2 self-center w-9 h-9 rounded-full bg-white border border-[#3B82F6]/20 shadow-md flex items-center justify-center hover:bg-[#3B82F6]/5 transition-all z-10">
              <ArrowDown className="w-4 h-4 text-[#3B82F6] bounce-down" />
            </button>
          )}
        </div>
      )}

      {/* Input */}
      <div className="shrink-0 px-3 py-2.5 sm:px-4 sm:py-3 border-t border-black/5 flex items-end gap-2 sm:gap-2.5 z-10" style={{ background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(12px)' }}>
        <button onClick={() => { if (!recRef.current) return; if (isListening) { recRef.current.stop(); setIsListening(false); } else { recRef.current.start(); setIsListening(true); } }}
          className={`shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-all
            ${isListening ? 'bg-red-500 text-white shadow-md animate-pulse' : 'bg-gray-100 text-gray-500 hover:bg-[#3B82F6]/10 hover:text-[#3B82F6]'}`}>
          {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
        </button>
        <textarea value={inputText} onChange={e => setInputText(e.target.value)} onKeyDown={onKey} rows={1}
          placeholder={translations[activeLang]?.chatbot?.placeholder || 'Type a message…'}
          className="flex-1 resize-none rounded-[1.25rem] px-4 py-2.5 text-[14px] sm:text-[15px] font-medium outline-none border border-gray-200 focus:border-[#3B82F6]/40 focus:ring-2 focus:ring-[#3B82F6]/15 min-h-[44px] max-h-[120px] placeholder:text-gray-400 bg-gray-50 transition-all" />
        <button onClick={send} disabled={!inputText.trim() || isLoading}
          className="shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-[#3B82F6] to-[#60A5FA] text-white flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg hover:scale-105 active:scale-95"
          id="chatbot-send">
          {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5 translate-x-[-1px] translate-y-[1px]" />}
        </button>
      </div>
    </div>
  );
};

export default YojnaSaathi;
