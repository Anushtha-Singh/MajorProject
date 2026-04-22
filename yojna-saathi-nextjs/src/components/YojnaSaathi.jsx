'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { MessageCircle, X, Mic, MicOff, Volume2, VolumeX, Send, Bot, Loader2, Globe, Copy, Check, RotateCcw, ArrowDown, RefreshCw } from 'lucide-react';
import { languagePatterns, languageNames, greetings } from '@/data/schemesData';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

// Category chips shown after greeting
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
  const [detectedLang, setDetectedLang] = useState('en');
  const [selectedLang, setSelectedLang] = useState('en');
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
      <button onClick={open} 
        className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-br from-[#0271BC] to-[#1E90FF] text-white flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-105 transition-all"
        id="chatbot-toggle">
        <MessageCircle className="w-6 h-6" />
        <span className="absolute top-0 right-0 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white animate-pulse-dot" />
      </button>
    );
  }

  return (
    <div className={isFullPage
      ? "fixed inset-0 z-50 bg-[#faf7f2] flex flex-col"
      : "fixed z-50 bottom-0 right-0 sm:bottom-6 sm:right-6 w-full h-[100dvh] sm:w-[380px] sm:h-[600px] sm:max-h-[calc(100vh-80px)] bg-white sm:rounded-2xl shadow-2xl sm:border border-black/5 flex flex-col overflow-hidden"
    }>
      {/* Header */}
      <div className="shrink-0 flex items-center justify-between px-4 py-3 sm:py-3.5 bg-gradient-to-r from-[#0271BC] to-[#1E90FF] text-white shadow-sm z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-sm">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <div className="font-bold text-base tracking-tight">YojnaSaathi</div>
            <div className="text-xs text-white/80 flex items-center gap-1.5 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
              {languageNames[activeLang]}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1">
          {messages.length > 0 && (
            <button onClick={newChat} className="p-2 rounded-xl hover:bg-white/20 transition-colors" title="New Chat">
              <RefreshCw className="w-4.5 h-4.5" />
            </button>
          )}
          <button onClick={() => setShowLangPicker(!showLangPicker)} className="p-2 rounded-xl hover:bg-white/20 transition-colors" title="Change Language">
            <Globe className="w-5 h-5" />
          </button>
          {!isFullPage && (
            <button onClick={close} className="p-2 rounded-xl hover:bg-white/20 transition-colors">
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Language Picker */}
      {showLangPicker && (
        <div className="shrink-0 p-3 bg-white border-b border-black/5 shadow-sm z-10">
          <div className="grid grid-cols-3 xs:grid-cols-4 gap-2">
            {Object.entries(languageNames).map(([code, name]) => (
              <button key={code} onClick={() => { setSelectedLang(code); setShowLangPicker(false); }} 
                className={`px-2 py-2 rounded-lg text-xs font-bold transition-all truncate
                  ${activeLang === code ? 'bg-[#0271BC] text-white shadow-sm' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                {name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Messages / Welcome Screen */}
      {messages.length === 0 ? (
        <div className="flex-1 p-6 flex flex-col items-center justify-center bg-gray-50/50">
           <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#0271BC]/10 to-[#1E90FF]/10 flex items-center justify-center mb-5">
             <Bot className="w-10 h-10 text-[#0271BC]" />
           </div>
           <h3 className="text-lg font-bold text-gray-800 mb-1">YojnaSaathi</h3>
           <p className="text-sm text-gray-500 mb-6 text-center">Choose your language / आप किस भाषा में बात करना चाहते हैं?</p>
           <div className="grid grid-cols-2 gap-3 w-full max-w-[280px]">
             {Object.entries(languageNames).slice(0, 6).map(([code, name]) => (
               <button key={code} onClick={() => { 
                 setSelectedLang(code); 
                 const g = greetings[code] || greetings.en;
                 setMessages([{ id: crypto.randomUUID(), type: 'bot', text: g, ts: new Date() }]);
               }}
                 className={`p-3 rounded-xl bg-white border-2 shadow-sm text-sm font-semibold transition-all hover:scale-[1.03] active:scale-95
                   ${code === 'en' || code === 'hi' ? 'border-[#0271BC]/30 text-[#0271BC] hover:bg-[#0271BC]/5' : 'border-gray-200 text-gray-700 hover:border-[#0271BC] hover:text-[#0271BC]'}`}>
                 {name}
               </button>
             ))}
           </div>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 sm:gap-4 bg-gray-50/50 relative" ref={chatContainerRef} onScroll={handleScroll}>
        {messages.filter(m => !m.isHidden).map(m => (
          <div key={m.id} className={`flex ${m.type === 'user' ? 'justify-end' : 'justify-start'} animate-in`}>
            <div className={`max-w-[85%] sm:max-w-[80%] px-4 py-2.5 rounded-2xl text-[14px] sm:text-[15px] leading-relaxed break-words shadow-sm
              ${m.type === 'user'
                ? 'bg-gradient-to-br from-[#0271BC] to-[#1E90FF] text-white rounded-br-sm'
                : m.isError ? 'bg-red-50 text-red-700 border border-red-200 rounded-bl-sm' : 'bg-white text-gray-800 border border-black/5 rounded-bl-sm'}`}>
              
              {m.type === 'user' ? (
                <div className="whitespace-pre-wrap">{m.text}</div>
              ) : (
                <ReactMarkdown 
                  remarkPlugins={[remarkGfm]}
                  components={{
                    p: ({node, ...props}) => <p className="mb-2 last:mb-0" {...props} />,
                    strong: ({node, ...props}) => <strong className="font-bold text-[#0271BC]" {...props} />,
                    ul: ({node, ...props}) => <ul className="list-disc pl-4 mb-2 space-y-1" {...props} />,
                    ol: ({node, ...props}) => <ol className="list-decimal pl-4 mb-2 space-y-1" {...props} />,
                    li: ({node, ...props}) => <li className="marker:text-gray-400" {...props} />,
                    a: ({node, href, ...props}) => <a href={href} target="_blank" rel="noopener noreferrer" className="text-[#0271BC] underline hover:text-[#1E90FF]" {...props} />,
                  }}
                >
                  {m.text}
                </ReactMarkdown>
              )}
              
              <div className={`flex items-center gap-2 mt-1.5 ${m.type === 'user' ? 'justify-end text-white/60' : 'justify-between text-gray-400'}`}>
                {m.type === 'bot' && (
                  <div className="flex items-center gap-1.5">
                    <button onClick={() => speak(m.text, m.id)} className="hover:text-[#0271BC] transition-colors p-0.5" title={playingMsgId === m.id ? "Stop" : "Play"}>
                      {playingMsgId === m.id ? <VolumeX className="w-3.5 h-3.5 text-[#0271BC]" /> : <Volume2 className="w-3.5 h-3.5" />}
                    </button>
                    <button onClick={() => copyMessage(m.text, m.id)} className="hover:text-[#0271BC] transition-colors p-0.5" title="Copy">
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

        {/* Typing Indicator (3-dot bounce) */}
        {isLoading && (
          <div className="flex justify-start animate-in">
            <div className="bg-white border border-black/5 px-4 py-3 rounded-2xl rounded-bl-sm flex items-center gap-1.5 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-[#0271BC] animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-2 h-2 rounded-full bg-[#0271BC] animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-2 h-2 rounded-full bg-[#0271BC] animate-bounce" style={{ animationDelay: '300ms' }} />
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
                    className="px-3 py-1.5 text-xs font-semibold bg-white border border-[#0271BC]/20 text-[#0271BC] rounded-full hover:bg-[#0271BC]/5 hover:border-[#0271BC]/40 transition-all active:scale-95 shadow-sm">
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
                    className="px-3 py-1.5 text-xs font-semibold bg-white border border-[#0271BC]/20 text-[#0271BC] rounded-full hover:bg-[#0271BC]/5 hover:border-[#0271BC]/40 transition-all active:scale-95 shadow-sm">
                    {chip.label}
                  </button>
                ))}
              </div>
            );
          }
          
          // Show contextual follow-up chips after detailed responses
          const followUps = activeLang === 'hi' 
            ? [{ label: '📝 Apply कैसे करें?', text: 'इसके लिए apply कैसे करें?' }, { label: '📄 Documents?', text: 'कौन कौन से documents चाहिए?' }, { label: '🔙 और योजनाएं', text: 'और योजनाएं दिखाओ' }]
            : [{ label: '📝 How to Apply?', text: 'How to apply for this scheme?' }, { label: '📄 Documents?', text: 'What documents are required?' }, { label: '🔙 More Schemes', text: 'Show me more schemes' }];
          return (
            <div className="flex flex-wrap gap-2 mt-1 animate-in">
              {followUps.map((chip, i) => (
                <button key={i} onClick={() => sendMessage(chip.text)}
                  className="px-3 py-1.5 text-xs font-semibold bg-white border border-[#0271BC]/20 text-[#0271BC] rounded-full hover:bg-[#0271BC]/5 hover:border-[#0271BC]/40 transition-all active:scale-95 shadow-sm">
                  {chip.label}
                </button>
              ))}
            </div>
          );
        })()}

        <div ref={endRef} />

        {/* Scroll to Bottom FAB */}
        {showScrollBtn && (
          <button onClick={scrollToBottom} className="sticky bottom-2 self-center w-8 h-8 rounded-full bg-white border border-black/10 shadow-md flex items-center justify-center hover:bg-gray-50 transition-all z-10">
            <ArrowDown className="w-4 h-4 text-gray-600" />
          </button>
        )}
        </div>
      )}

      {/* Input */}
      <div className="shrink-0 p-3 sm:p-4 bg-white border-t border-black/5 flex items-end gap-2 sm:gap-3 z-10">
        <button onClick={() => { if (!recRef.current) return; if (isListening) { recRef.current.stop(); setIsListening(false); } else { recRef.current.start(); setIsListening(true); } }}
          className={`shrink-0 w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center transition-all
            ${isListening ? 'bg-red-500 text-white shadow-md animate-pulse' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}>
          {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
        </button>
        <textarea value={inputText} onChange={e => setInputText(e.target.value)} onKeyDown={onKey} rows={1}
          placeholder={activeLang === 'hi' ? 'संदेश लिखें…' : 'Type a message…'}
          className="flex-1 resize-none bg-gray-100 rounded-[1.25rem] px-4 py-2.5 sm:py-3 text-[14px] sm:text-[15px] font-medium border-none outline-none focus:ring-2 focus:ring-[#0271BC]/30 min-h-[44px] sm:min-h-[48px] max-h-[120px] placeholder:text-gray-400" />
        <button onClick={send} disabled={!inputText.trim() || isLoading}
          className="shrink-0 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-gradient-to-br from-[#0271BC] to-[#1E90FF] text-white flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg" 
          id="chatbot-send">
          {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5 translate-x-[-1px] translate-y-[1px]" />}
        </button>
      </div>
    </div>
  );
};

export default YojnaSaathi;
