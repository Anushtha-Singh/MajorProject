/**
 * Category definitions with translations for all supported languages.
 * Each entry has:
 *   key   – URL/filter key
 *   icon  – emoji
 *   count – approximate scheme count
 *   names – { [langCode]: "Translated name" }
 *   subs  – { [langCode]: "Short subtitle" }
 */
export const CATEGORIES = [
  {
    key: "education", icon: "📚", count: 966,
    names: {
      en: "Education", hi: "शिक्षा", bn: "শিক্ষা", ta: "கல்வி",
      te: "విద్య", mr: "शिक्षण", gu: "શિક્ષણ", kn: "ಶಿಕ್ಷಣ",
      ml: "വിദ്യാഭ്യാസം", pa: "ਸਿੱਖਿਆ", ur: "تعلیم",
    },
    subs: {
      en: "Scholarships, Skills", hi: "छात्रवृत्ति, कौशल", bn: "বৃত্তি, দক্ষতা",
      ta: "உதவித்தொகை, திறன்கள்", te: "స్కాలర్‌షిప్, నైపుణ్యాలు",
      mr: "शिष्यवृत्ती, कौशल्ये", gu: "શિષ્યવૃત્તિ, કૌશલ્ય",
      kn: "ವಿದ್ಯಾರ್ಥಿವೇತನ, ಕೌಶಲ", ml: "സ്കോളർഷിപ്പ്, കഴിവ്",
      pa: "ਵਜ਼ੀਫ਼ਾ, ਹੁਨਰ", ur: "وظیفہ، مہارت",
    },
  },
  {
    key: "social", icon: "🤝", count: 4208,
    names: {
      en: "Social Welfare", hi: "समाज कल्याण", bn: "সামাজিক কল্যাণ",
      ta: "சமூக நலன்", te: "సామాజిక సంక్షేమం", mr: "समाज कल्याण",
      gu: "સામાજિક કલ્યાણ", kn: "ಸಮಾಜ ಕಲ್ಯಾಣ", ml: "സാമൂഹ്യ ക്ഷേമം",
      pa: "ਸਮਾਜ ਭਲਾਈ", ur: "سماجی بہبود",
    },
    subs: {
      en: "Empowerment, Pension", hi: "सशक्तिकरण, पेंशन", bn: "ক্ষমতায়ন, পেনশন",
      ta: "அதிகாரமளித்தல், ஓய்வூதியம்", te: "సాధికారత, పెన్షన్",
      mr: "सशक्तीकरण, निवृत्तीवेतन", gu: "સશક્તિકરણ, પેન્શન",
      kn: "ಸಬಲೀಕರಣ, ಪಿಂಚಣಿ", ml: "ശാക്തീകരണം, പെൻഷൻ",
      pa: "ਸਸ਼ਕਤੀਕਰਨ, ਪੈਨਸ਼ਨ", ur: "بااختیاری، پنشن",
    },
  },
  {
    key: "health", icon: "🏥", count: 137,
    names: {
      en: "Health", hi: "स्वास्थ्य", bn: "স্বাস্থ্য", ta: "சுகாதாரம்",
      te: "ఆరోగ్యం", mr: "आरोग्य", gu: "આરોગ્ય", kn: "ಆರೋಗ್ಯ",
      ml: "ആരോഗ്യം", pa: "ਸਿਹਤ", ur: "صحت",
    },
    subs: {
      en: "Insurance, Treatment", hi: "बीमा, उपचार", bn: "বীমা, চিকিৎসা",
      ta: "காப்பீடு, சிகிச்சை", te: "బీమా, చికిత్స",
      mr: "विमा, उपचार", gu: "વીમો, સારવાર", kn: "ವಿಮೆ, ಚಿಕಿತ್ಸೆ",
      ml: "ഇൻഷുറൻസ്, ചികിത്സ", pa: "ਬੀਮਾ, ਇਲਾਜ", ur: "بیمہ، علاج",
    },
  },
  {
    key: "women", icon: "👩", count: 161,
    names: {
      en: "Women & Child", hi: "महिला एवं बाल", bn: "মহিলা ও শিশু",
      ta: "பெண்கள் & குழந்தை", te: "మహిళలు & పిల్లలు",
      mr: "महिला व बाल", gu: "મહિલા & બાળ", kn: "ಮಹಿಳೆ & ಮಗು",
      ml: "സ്ത്രീകൾ & കുട്ടി", pa: "ਔਰਤਾਂ & ਬੱਚੇ", ur: "خواتین & بچے",
    },
    subs: {
      en: "Maternity, Nutrition", hi: "मातृत्व, पोषण", bn: "মাতৃত্ব, পুষ্টি",
      ta: "மகப்பேறு, ஊட்டச்சத்து", te: "ప్రసూతి, పోషణ",
      mr: "मातृत्व, पोषण", gu: "માતૃત્વ, પોષણ", kn: "ಮಾತೃತ್ವ, ಪೋಷಣೆ",
      ml: "പ്രസൂതി, പോഷണം", pa: "ਮਾਤਾ, ਪੋਸ਼ਣ", ur: "زچگی، غذائیت",
    },
  },
  {
    key: "agri", icon: "🌾", count: 245,
    names: {
      en: "Agriculture", hi: "कृषि", bn: "কৃষি", ta: "விவசாயம்",
      te: "వ్యవసాయం", mr: "शेती", gu: "ખેતી", kn: "ಕೃಷಿ",
      ml: "കൃഷി", pa: "ਖੇਤੀ", ur: "زراعت",
    },
    subs: {
      en: "Farming, Subsidies", hi: "खेती, सब्सिडी", bn: "চাষ, ভর্তুকি",
      ta: "வேளாண்மை, மானியம்", te: "వ్యవసాయం, రాయితీలు",
      mr: "शेती, अनुदान", gu: "ખેતી, સબસિડી", kn: "ಕೃಷಿ, ಸಬ್ಸಿಡಿ",
      ml: "കൃഷി, സബ്‌സിഡി", pa: "ਖੇਤੀ, ਸਬਸਿਡੀ", ur: "کاشتکاری، سبسڈی",
    },
  },
  {
    key: "business", icon: "💼", count: 180,
    names: {
      en: "Business", hi: "व्यापार", bn: "ব্যবসা", ta: "வணிகம்",
      te: "వ్యాపారం", mr: "व्यवसाय", gu: "વ્યવસાય", kn: "ವ್ಯಾಪಾರ",
      ml: "ബിസിനസ്", pa: "ਕਾਰੋਬਾਰ", ur: "کاروبار",
    },
    subs: {
      en: "Loans, MSME", hi: "ऋण, एमएसएमई", bn: "ঋণ, MSME",
      ta: "கடன்கள், MSME", te: "రుణాలు, MSME",
      mr: "कर्ज, MSME", gu: "લોન, MSME", kn: "ಸಾಲ, MSME",
      ml: "വായ്പ, MSME", pa: "ਕਰਜ਼ਾ, MSME", ur: "قرض، MSME",
    },
  },
  {
    key: "housing", icon: "🏠", count: 95,
    names: {
      en: "Housing", hi: "आवास", bn: "আবাসন", ta: "வீட்டுவசதி",
      te: "గృహనిర్మాణం", mr: "गृहनिर्माण", gu: "ગૃહ", kn: "ವಸತಿ",
      ml: "ഭവനം", pa: "ਮਕਾਨ", ur: "رہائش",
    },
    subs: {
      en: "Low-cost Homes", hi: "कम लागत", bn: "কম খরচে বাড়ি",
      ta: "குறைந்த செலவு", te: "తక్కువ వ్యయం",
      mr: "कमी खर्चात घरे", gu: "ઓછી કિંમતે ઘર", kn: "ಕಡಿಮೆ ವೆಚ್ಚ",
      ml: "കുറഞ്ഞ ചെലവ്", pa: "ਘੱਟ ਲਾਗਤ", ur: "کم قیمت گھر",
    },
  },
  {
    key: "skills", icon: "🔧", count: 310,
    names: {
      en: "Employment", hi: "रोजगार", bn: "কর্মসংস্থান", ta: "வேலைவாய்ப்பு",
      te: "ఉపాధి", mr: "रोजगार", gu: "રોજગાર", kn: "ಉದ್ಯೋಗ",
      ml: "തൊഴിൽ", pa: "ਰੁਜ਼ਗਾਰ", ur: "روزگار",
    },
    subs: {
      en: "Jobs, Training", hi: "नौकरी, प्रशिक्षण", bn: "চাকরি, প্রশিক্ষণ",
      ta: "வேலைகள், பயிற்சி", te: "ఉద్యోగాలు, శిక్షణ",
      mr: "नोकऱ्या, प्रशिक्षण", gu: "નોકરી, તાલીમ", kn: "ಉದ್ಯೋಗ, ತರಬೇತಿ",
      ml: "ജോലി, പരിശീലനം", pa: "ਨੌਕਰੀ, ਸਿਖਲਾਈ", ur: "نوکری، تربیت",
    },
  },
  {
    key: "bfsi", icon: "🏦", count: 140,
    names: {
      en: "Banking", hi: "बैंकिंग", bn: "ব্যাংকিং", ta: "வங்கி",
      te: "బ్యాంకింగ్", mr: "बँकिंग", gu: "બેંકિંગ", kn: "ಬ್ಯಾಂಕಿಂಗ್",
      ml: "ബാങ്കിംഗ്", pa: "ਬੈਂਕਿੰਗ", ur: "بینکنگ",
    },
    subs: {
      en: "Insurance, Savings", hi: "बीमा, बचत", bn: "বীমা, সঞ্চয়",
      ta: "காப்பீடு, சேமிப்பு", te: "బీమా, పొదుపు",
      mr: "विमा, बचत", gu: "વીમો, બચત", kn: "ವಿಮೆ, ಉಳಿತಾಯ",
      ml: "ഇൻഷുറൻസ്, സമ്പാദ്യം", pa: "ਬੀਮਾ, ਬੱਚਤ", ur: "بیمہ، بچت",
    },
  },
  {
    key: "science", icon: "💻", count: 65,
    names: {
      en: "Science & IT", hi: "विज्ञान", bn: "বিজ্ঞান ও আইটি", ta: "அறிவியல் & தொழில்நுட்பம்",
      te: "విజ్ఞానం & ఐటీ", mr: "विज्ञान व आयटी", gu: "વિજ્ઞાન & IT",
      kn: "ವಿಜ್ಞಾನ & ಐಟಿ", ml: "ശാസ്ത്രം & ഐടി", pa: "ਵਿਗਿਆਨ & IT", ur: "سائنس & IT",
    },
    subs: {
      en: "Research", hi: "अनुसंधान", bn: "গবেষণা", ta: "ஆராய்ச்சி",
      te: "పరిశోధన", mr: "संशोधन", gu: "સંશોધન", kn: "ಸಂಶೋಧನೆ",
      ml: "ഗവേഷണം", pa: "ਖੋਜ", ur: "تحقیق",
    },
  },
];

/** Lookup category by key */
export const getCatByKey = (key) => CATEGORIES.find(c => c.key === key);

/** Get localised name for a category, falling back to English */
export const getCatName = (key, lang) => {
  const cat = getCatByKey(key);
  if (!cat) return key;
  return cat.names[lang] || cat.names.en;
};

/** Get localised subtitle for a category, falling back to English */
export const getCatSub = (key, lang) => {
  const cat = getCatByKey(key);
  if (!cat) return '';
  return cat.subs[lang] || cat.subs.en;
};

/**
 * The English category names used for API calls (must match DB values).
 * Keys match CATEGORIES[*].key → value used in p.set('category', ...) call.
 */
export const CATS_EN = {
  education: "Education & Learning",
  social:    "Social Welfare & Empowerment",
  health:    "Health & Wellness",
  women:     "Women & Child",
  agri:      "Agriculture",
  business:  "Business & Entrepreneurship",
  housing:   "Housing",
  skills:    "Skills & Employment",
  bfsi:      "Banking & Finance",
  science:   "Science & IT",
};
