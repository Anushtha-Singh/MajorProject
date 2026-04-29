import translate from 'google-translate-api-x';
import fs from 'fs';

const TARGET_LANGS = ['bn', 'ta', 'te', 'mr', 'gu', 'kn', 'ml', 'pa', 'ur']; // hi is already done manually or we can redo it

const uiDict = {
  navbar: {
    brand: "Yojna Saathi", home: "Home", schemes: "Schemes", chat: "Chat", cta: "Find Schemes"
  },
  footer: {
    brand: "Yojna Saathi", tagline: "Empowering every citizen with accessible government scheme assistance.", privacy: "Privacy", terms: "Terms", support: "Support", home: "Home", schemes: "Schemes", chat: "Chat"
  },
  home: {
    badge: "AI-Powered • 11 Languages • 3500+ Schemes",
    h1a: "Empowering Citizens with", h1b: "Government Schemes",
    desc: "Discover, understand, and apply for 3500+ Central & State government schemes — in your own language.",
    cta1: "Explore Schemes", cta2: "Chat with Saathi",
    stat1: "Total Schemes", stat2: "Central Schemes", stat3: "State Schemes",
    catTitle: "Explore by Category", catSub: "Find schemes across Agriculture, Education, Health, and more.",
    howTitle: "How It Works", howSub: "Three simple steps to find the right scheme.",
    s1: "Share Your Details", s1d: "Tell us your age, state, occupation, and category.",
    s2: "Get Recommendations", s2d: "AI scans 3500+ schemes and shows your best matches.",
    s3: "Apply with Guidance", s3d: "Step-by-step instructions to apply on official portals.",
    faqTitle: "Frequently Asked Questions",
    ctaT: "Need help finding the right scheme?",
    ctaD: "Talk to our AI assistant in Hindi, Tamil, Bengali, or 8 other languages.",
    ctaBtn: "Start Chatting →"
  },
  schemes: {
    filters: "Filters", reset: "Reset all", found: "schemes found", filtered: "filtered", clear: "Clear filters",
    viewBtn: "View details", state: "State", central: "Central", search: "Search schemes...",
    allCat: "All Categories", allLevel: "All Levels", allBen: "All Benefits"
  },
  details: {
    onPage: "On this page", share: "Share", copy: "Copy link", copied: "Copied!", back: "Back to schemes",
    secDetails: "Details", secBenefits: "Benefits", secElig: "Eligibility", secApp: "How to Apply", secDocs: "Documents Required", secSources: "Sources",
    checkElig: "Check Eligibility with AI", checkEligMobile: "Check Eligibility", askAi: "Ask AI →", offSite: "Official Site", eligTitle: "Check your eligibility", eligDesc: "Chat with our AI in your language"
  },
  chat: {
    title: "Chat with ", subtitle: "Ask about government schemes. Find eligible schemes, understand benefits, and get step-by-step application guidance.",
    f1t: "11 Languages", f1d: "Hindi, Tamil, Bengali, and more",
    f2t: "Instant Answers", f2d: "AI-powered with real-time streaming",
    f3t: "Voice Support", f3d: "Speak or type your questions"
  }
};

async function translateObject(obj, to) {
  const translated = {};
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'object') {
      translated[key] = await translateObject(value, to);
    } else {
      try {
        const res = await translate(value, { from: 'en', to });
        translated[key] = res.text;
      } catch (e) {
        console.error(`Failed to translate ${value} to ${to}:`, e.message);
        translated[key] = value; // Fallback
      }
    }
  }
  return translated;
}

async function main() {
  const result = {
    en: uiDict,
    hi: {
      navbar: { brand: "योजना साथी", home: "होम", schemes: "योजनाएँ", chat: "चैट", cta: "योजना खोजें" },
      footer: { brand: "योजना साथी", tagline: "हर नागरिक को सुलभ सरकारी योजना सहायता से सशक्त बनाना।", privacy: "गोपनीयता", terms: "शर्तें", support: "सहायता", home: "होम", schemes: "योजनाएँ", chat: "चैट" },
      home: {
        badge: "AI-संचालित • 11 भाषाएँ • 3500+ योजनाएँ",
        h1a: "नागरिकों को सशक्त बनाना", h1b: "सरकारी योजनाओं से",
        desc: "अपनी भाषा में 3500+ केंद्र और राज्य सरकारी योजनाओं को खोजें, समझें और आवेदन करें।",
        cta1: "योजनाएँ देखें", cta2: "साथी से चैट करें",
        stat1: "कुल योजनाएँ", stat2: "केंद्रीय योजनाएँ", stat3: "राज्य योजनाएँ",
        catTitle: "श्रेणी के अनुसार खोजें", catSub: "कृषि, शिक्षा, स्वास्थ्य और अन्य में योजनाएँ।",
        howTitle: "कैसे काम करता है", howSub: "सही योजना खोजने के तीन आसान कदम।",
        s1: "विवरण दें", s1d: "उम्र, राज्य, व्यवसाय और श्रेणी बताएं।",
        s2: "सिफ़ारिशें पाएं", s2d: "AI 3500+ योजनाओं में से सर्वश्रेष्ठ दिखाता है।",
        s3: "मार्गदर्शन से आवेदन", s3d: "आधिकारिक पोर्टल पर आवेदन के चरण-दर-चरण निर्देश।",
        faqTitle: "अक्सर पूछे जाने वाले प्रश्न",
        ctaT: "सही योजना खोजने में सहायता चाहिए?",
        ctaD: "AI सहायक से हिंदी, तमिल, बंगाली या 8 अन्य भाषाओं में बात करें।",
        ctaBtn: "चैट शुरू करें →"
      },
      schemes: { filters: "फ़िल्टर", reset: "सभी रीसेट करें", found: "योजनाएँ मिलीं", filtered: "फ़िल्टर की गई", clear: "फ़िल्टर साफ़ करें", viewBtn: "विवरण देखें", state: "राज्य", central: "केंद्र", search: "योजनाएँ खोजें...", allCat: "सभी श्रेणियां", allLevel: "सभी स्तर", allBen: "सभी लाभ" },
      details: { onPage: "इस पृष्ठ पर", share: "साझा करें", copy: "लिंक कॉपी करें", copied: "कॉपी किया गया!", back: "योजनाओं पर वापस जाएं", secDetails: "विवरण", secBenefits: "लाभ", secElig: "पात्रता", secApp: "आवेदन प्रक्रिया", secDocs: "आवश्यक दस्तावेज", secSources: "स्रोत", checkElig: "AI के साथ पात्रता जांचें", checkEligMobile: "पात्रता जांचें", askAi: "AI से पूछें →", offSite: "आधिकारिक वेबसाइट", eligTitle: "अपनी पात्रता जांचें", eligDesc: "अपनी भाषा में हमारे AI से बात करें" },
      chat: { title: "बात करें ", subtitle: "सरकारी योजनाओं के बारे में पूछें। योजनाओं के लाभ समझें और आवेदन के लिए मार्गदर्शन प्राप्त करें।", f1t: "11 भाषाएं", f1d: "हिंदी, तमिल, बंगाली और अधिक", f2t: "तुरंत उत्तर", f2d: "AI-संचालित रियल-टाइम स्ट्रीमिंग", f3t: "आवाज़ सहायता", f3d: "बोलें या टाइप करें" }
    }
  };

  for (const lang of TARGET_LANGS) {
    console.log(`Translating UI to ${lang}...`);
    result[lang] = await translateObject(uiDict, lang);
  }

  // Generate JS module instead of JSON so it can be imported easily
  const jsContent = `const translations = ${JSON.stringify(result, null, 2)};\n\nexport default translations;`;
  fs.writeFileSync('src/lib/translations.js', jsContent);
  console.log('UI Translations saved to src/lib/translations.js');
}

main();
