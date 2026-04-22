import { streamText } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';

const languageMap = {
  en: 'English', hi: 'Hindi (हिंदी)', ta: 'Tamil (தமிழ்)', te: 'Telugu (తెలుగు)', 
  bn: 'Bengali (বাংলা)', gu: 'Gujarati (ગુજરાતી)', pa: 'Punjabi (ਪੰਜਾਬੀ)', 
  kn: 'Kannada (ಕನ್ನಡ)', ml: 'Malayalam (മലയാളം)', or: 'Odia (ଓଡ଼ିଆ)', mr: 'Marathi (मराठी)'
};

const getSystemPrompt = (languageCode) => {
  const prefLang = languageMap[languageCode] || 'English';
  return `You are YojnaSaathi, a smart and friendly conversational assistant for Indian government schemes.

CRITICAL LANGUAGE INSTRUCTIONS:
1. The user's preferred language is ${prefLang}. You MUST respond in this language.
2. If the user types in Hindi (Devanagari), reply in Hindi. If Hinglish, reply in Hinglish.
3. Always match the user's language and script.

CONVERSATIONAL FLOW — FOLLOW STRICTLY:
You must NEVER dump all information at once. Always guide the user step-by-step like a real human advisor:

STEP 1 — DISCOVER:
When a user asks about a topic (e.g., "kisan yojana", "health scheme", "loan"), respond with a SHORT numbered list (max 5) of the most relevant schemes. Each item should have:
- A number (1, 2, 3...)
- The scheme name in bold
- ONE line (max 15 words) description
Example:
1. **PM Kisan Samman Nidhi** — ₹6,000/year direct to farmer's account
2. **Fasal Bima Yojana** — Crop insurance at low premium
Ask: "Kaunsi yojana ke baare mein detail chahiye? Number batayein 👇"

STEP 2 — DETAIL:
When the user picks a scheme (by number or name), provide ONLY these in a clean format:
- **✅ Benefits** (2-3 lines max)
- **👤 Eligibility** (2-3 lines max)
Then ask: "Kya aap apply karne ka process ya documents ki list dekhna chahenge?"

STEP 3 — DEEP DIVE:
Only when user asks, provide:
- **📝 How to Apply** (numbered steps)
- **📄 Documents Required** (bullet list)
- **🔗 Official Website** (if known)

RULES:
- Keep each response SHORT (max 80 words). Users are on mobile.
- Use emojis sparingly for visual clarity (✅, 📋, 👤, 📝, 🔗).
- NEVER repeat information already given in previous messages.
- If the user asks a general question like "hi" or "help", introduce yourself briefly and show the top categories: Agriculture, Health, Housing, Education, Business, Women & Child.
- If the user asks about eligibility with their personal details, answer specifically for their case.`;
};

// POST /api/chat — Streaming API with Fallback
export async function POST(request) {
  try {
    const body = await request.json();
    const { message, messages = [], language = 'en' } = body;
    
    if (!message || typeof message !== 'string') {
      return new Response('Message is required', { status: 400 });
    }
    
    const openAiKey = process.env.OPENAI_API_KEY;
    const geminiKey = process.env.GEMINI_API_KEY;
    const systemPrompt = getSystemPrompt(language);
    
    // Convert frontend messages to AI SDK format, filtering out empty ones
    const coreMessages = messages
      .filter(m => m.text && m.text.trim())
      .map(m => ({
        role: m.type === 'user' ? 'user' : 'assistant',
        content: m.text
      }));
    coreMessages.push({ role: 'user', content: message });

    // 1. Try OpenAI First
    if (openAiKey && openAiKey !== 'your_openai_api_key_here') {
      try {
        const openai = createOpenAI({ apiKey: openAiKey });
        const result = await streamText({
          model: openai('gpt-4o-mini'),
          system: systemPrompt,
          messages: coreMessages,
        });
        
        // Return pure raw text stream, bypassing Vercel Data Stream protocol
        return new Response(result.textStream.pipeThrough(new TextEncoderStream()), {
          headers: {
            'Content-Type': 'text/plain; charset=utf-8',
            'Cache-Control': 'no-cache',
          }
        });
      } catch (err) {
        console.warn('OpenAI API failed, falling back to Gemini...', err.message);
      }
    }

    // 2. Fallback to Gemini
    if (geminiKey && geminiKey !== 'your_gemini_api_key_here') {
      try {
        const google = createGoogleGenerativeAI({ apiKey: geminiKey });
        const result = await streamText({
          model: google('gemini-2.5-flash'),
          system: systemPrompt,
          messages: coreMessages,
        });
        
        return new Response(result.textStream.pipeThrough(new TextEncoderStream()), {
          headers: {
            'Content-Type': 'text/plain; charset=utf-8',
            'Cache-Control': 'no-cache',
          }
        });
      } catch (err) {
        console.error('Gemini Fallback failed:', err);
      }
    }

    // 3. Fallback to hardcoded text stream
    const fallback = language === 'hi' 
      ? "मैं योजना साथी हूं! मेरे AI सर्वर अभी व्यस्त हैं। कृपया अभी के लिए योजनाओं को मैन्युअल रूप से ब्राउज़ करें।"
      : "I'm YojnaSaathi! My AI servers are currently busy. Please browse the schemes manually for now.";
      
    return new Response(fallback, { status: 200 });

  } catch (error) {
    console.error('Chat API Error:', error);
    return new Response('API temporarily unavailable', { status: 500 });
  }
}
