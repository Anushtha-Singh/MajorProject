// Sample Government Schemes Data for YojnaSaathi Chatbot
export const sampleSchemes = [
  {
    id: 1,
    title: "Pradhan Mantri Kisan Samman Nidhi (PM-KISAN)",
    titleHindi: "प्रधानमंत्री किसान सम्मान निधि (पीएम-किसान)",
    category: "Agriculture",
    level: "Central",
    department: "Ministry of Agriculture & Farmers Welfare",
    details: "Direct income support scheme for farmers",
    detailsHindi: "किसानों के लिए प्रत्यक्ष आय सहायता योजना",
    benefits: "₹6,000 per year in three equal installments of ₹2,000 each",
    benefitsHindi: "प्रति वर्ष ₹6,000 तीन समान किस्तों में ₹2,000 प्रत्येक",
    eligibility: "Small and marginal farmers with landholding up to 2 hectares",
    eligibilityHindi: "2 हेक्टेयर तक की जमीन वाले छोटे और सीमांत किसान",
    applicationProcess: [
      "Visit nearest Common Service Centre (CSC)",
      "Provide Aadhaar number and bank account details",
      "Submit land records and other required documents",
      "Application will be processed and verified"
    ],
    applicationProcessHindi: [
      "निकटतम कॉमन सर्विस सेंटर (सीएससी) पर जाएं",
      "आधार नंबर और बैंक खाता विवरण प्रदान करें",
      "जमीन के रिकॉर्ड और अन्य आवश्यक दस्तावेज जमा करें",
      "आवेदन प्रसंस्कृत और सत्यापित किया जाएगा"
    ],
    documentsRequired: ["Aadhaar Card", "Bank Account Details", "Land Records", "Mobile Number"],
    documentsRequiredHindi: ["आधार कार्ड", "बैंक खाता विवरण", "जमीन के रिकॉर्ड", "मोबाइल नंबर"],
    sources: ["https://pmkisan.gov.in/", "Ministry of Agriculture & Farmers Welfare"]
  },
  {
    id: 2,
    title: "Ayushman Bharat Pradhan Mantri Jan Arogya Yojana (AB-PMJAY)",
    titleHindi: "आयुष्मान भारत प्रधानमंत्री जन आरोग्य योजना (एबी-पीएमजेएवाई)",
    category: "Health",
    level: "Central",
    department: "Ministry of Health & Family Welfare",
    details: "Health insurance scheme for secondary and tertiary care hospitalization",
    detailsHindi: "द्वितीयक और तृतीयक देखभाल अस्पताल में भर्ती के लिए स्वास्थ्य बीमा योजना",
    benefits: "Health cover of ₹5 lakh per family per year for secondary and tertiary care",
    benefitsHindi: "द्वितीयक और तृतीयक देखभाल के लिए प्रति परिवार प्रति वर्ष ₹5 लाख का स्वास्थ्य कवर",
    eligibility: "Families identified as per SECC database (Socio-Economic Caste Census)",
    eligibilityHindi: "एसईसीसी डेटाबेस के अनुसार पहचाने गए परिवार",
    applicationProcess: ["Check eligibility on official website", "Visit empaneled hospital", "Show Aadhaar card for verification", "Get treatment without paying upfront"],
    applicationProcessHindi: ["आधिकारिक वेबसाइट पर पात्रता जांचें", "पैनल अस्पताल पर जाएं", "सत्यापन के लिए आधार कार्ड दिखाएं", "अग्रिम भुगतान किए बिना उपचार प्राप्त करें"],
    documentsRequired: ["Aadhaar Card", "Ration Card (if available)", "Mobile Number"],
    documentsRequiredHindi: ["आधार कार्ड", "राशन कार्ड (यदि उपलब्ध हो)", "मोबाइल नंबर"],
    sources: ["https://pmjay.gov.in/", "Ministry of Health & Family Welfare"]
  },
  {
    id: 3,
    title: "Pradhan Mantri Awas Yojana (PMAY)",
    titleHindi: "प्रधानमंत्री आवास योजना (पीएमएवाई)",
    category: "Housing",
    level: "Central",
    department: "Ministry of Housing and Urban Affairs",
    details: "Housing for All by 2022 mission",
    detailsHindi: "2022 तक सभी के लिए आवास मिशन",
    benefits: "Financial assistance up to ₹2.67 lakh for construction of pucca house",
    benefitsHindi: "पक्के घर के निर्माण के लिए ₹2.67 लाख तक की वित्तीय सहायता",
    eligibility: "Economically Weaker Section (EWS) and Low Income Group (LIG) families",
    eligibilityHindi: "आर्थिक रूप से कमजोर वर्ग (ईडब्ल्यूएस) और निम्न आय वर्ग (एलआईजी) परिवार",
    applicationProcess: ["Apply online through official portal", "Submit required documents", "Verification by concerned authority", "Approval and fund disbursement"],
    applicationProcessHindi: ["आधिकारिक पोर्टल के माध्यम से ऑनलाइन आवेदन करें", "आवश्यक दस्तावेज जमा करें", "संबंधित प्राधिकरण द्वारा सत्यापन", "अनुमोदन और धन वितरण"],
    documentsRequired: ["Aadhaar Card", "Income Certificate", "Caste Certificate (if applicable)", "Bank Account Details", "Land Documents"],
    documentsRequiredHindi: ["आधार कार्ड", "आय प्रमाण पत्र", "जाति प्रमाण पत्र (यदि लागू हो)", "बैंक खाता विवरण", "जमीन के दस्तावेज"],
    sources: ["https://pmaymis.gov.in/", "Ministry of Housing and Urban Affairs"]
  },
  {
    id: 4,
    title: "Pradhan Mantri Mudra Yojana (PMMY)",
    titleHindi: "प्रधानमंत्री मुद्रा योजना (पीएमएमवाई)",
    category: "Business",
    level: "Central",
    department: "Ministry of Finance",
    details: "Micro finance scheme for small businesses",
    detailsHindi: "छोटे व्यवसायों के लिए सूक्ष्म वित्त योजना",
    benefits: "Loans up to ₹10 lakh for micro, small and medium enterprises",
    benefitsHindi: "सूक्ष्म, लघु और मध्यम उद्यमों के लिए ₹10 लाख तक का ऋण",
    eligibility: "Non-farm income generating activities, micro and small enterprises",
    eligibilityHindi: "गैर-कृषि आय सृजन गतिविधियां, सूक्ष्म और लघु उद्यम",
    applicationProcess: ["Visit any bank, NBFC or MFI", "Fill application form", "Submit required documents", "Loan sanction and disbursement"],
    applicationProcessHindi: ["किसी भी बैंक, एनबीएफसी या एमएफआई पर जाएं", "आवेदन पत्र भरें", "आवश्यक दस्तावेज जमा करें", "ऋण स्वीकृति और वितरण"],
    documentsRequired: ["Aadhaar Card", "PAN Card", "Business Plan", "Bank Account Details", "Identity and Address Proof"],
    documentsRequiredHindi: ["आधार कार्ड", "पैन कार्ड", "व्यवसाय योजना", "बैंक खाता विवरण", "पहचान और पता प्रमाण"],
    sources: ["https://www.mudra.org.in/", "Ministry of Finance"]
  },
  {
    id: 5,
    title: "Pradhan Mantri Ujjwala Yojana (PMUY)",
    titleHindi: "प्रधानमंत्री उज्ज्वला योजना (पीएमयूवाई)",
    category: "Social Welfare",
    level: "Central",
    department: "Ministry of Petroleum and Natural Gas",
    details: "Free LPG connection scheme for women",
    detailsHindi: "महिलाओं के लिए मुफ्त एलपीजी कनेक्शन योजना",
    benefits: "Free LPG connection with first refill and safety equipment",
    benefitsHindi: "पहली रिफिल और सुरक्षा उपकरण के साथ मुफ्त एलपीजी कनेक्शन",
    eligibility: "Women above 18 years from BPL families",
    eligibilityHindi: "बीपीएल परिवारों की 18 वर्ष से अधिक आयु की महिलाएं",
    applicationProcess: ["Visit nearest LPG distributor", "Fill application form with Aadhaar details", "Submit required documents", "Get LPG connection and cylinder"],
    applicationProcessHindi: ["निकटतम एलपीजी डिस्ट्रीब्यूटर पर जाएं", "आधार विवरण के साथ आवेदन पत्र भरें", "आवश्यक दस्तावेज जमा करें", "एलपीजी कनेक्शन और सिलेंडर प्राप्त करें"],
    documentsRequired: ["Aadhaar Card", "BPL Ration Card", "Bank Account Details", "Mobile Number"],
    documentsRequiredHindi: ["आधार कार्ड", "बीपीएल राशन कार्ड", "बैंक खाता विवरण", "मोबाइल नंबर"],
    sources: ["https://www.pmuy.gov.in/", "Ministry of Petroleum and Natural Gas"]
  }
];

// Language detection patterns for Indian languages
export const languagePatterns = {
  hi: /[\u0900-\u097F]/g,
  ta: /[\u0B80-\u0BFF]/g,
  te: /[\u0C00-\u0C7F]/g,
  bn: /[\u0980-\u09FF]/g,
  gu: /[\u0A80-\u0AFF]/g,
  pa: /[\u0A00-\u0A7F]/g,
  kn: /[\u0C80-\u0CFF]/g,
  ml: /[\u0D00-\u0D7F]/g,
  or: /[\u0B00-\u0B7F]/g,
  mr: /[\u0900-\u097F]/g,
};

// Language names in their native scripts
export const languageNames = {
  en: "English",
  hi: "हिंदी",
  ta: "தமிழ்",
  te: "తెలుగు",
  bn: "বাংলা",
  gu: "ગુજરાતી",
  pa: "ਪੰਜਾਬੀ",
  kn: "ಕನ್ನಡ",
  ml: "മലയാളം",
  or: "ଓଡ଼ିଆ",
  mr: "मराठी"
};

// Bilingual display names for language pickers — "NativeScript - English"
export const languageDisplayNames = {
  en: "English",
  hi: "हिन्दी - Hindi",
  ta: "தமிழ் - Tamil",
  te: "తెలుగు - Telugu",
  bn: "বাংলা - Bengali",
  gu: "ગુજરાતી - Gujarati",
  pa: "ਪੰਜਾਬੀ - Punjabi",
  kn: "ಕನ್ನಡ - Kannada",
  ml: "മലയാളം - Malayalam",
  or: "ଓଡ଼ିଆ - Odia",
  mr: "मराठी - Marathi",
  ur: "اردو - Urdu",
};

// Greeting messages in different languages
export const greetings = {
  en: "Welcome to YojnaSaathi! Your easy path to government schemes. How can I help you today?",
  hi: "योजना साथी में आपका स्वागत है! आपके अधिकारों तक का आसान रास्ता। आज मैं आपकी कैसे मदद कर सकता हूं?",
  ta: "யோஜனா சாத்திக்கு வரவேற்கிறோம்! அரசு திட்டங்களுக்கான எளிய வழி. இன்று நான் உங்களுக்கு எவ்வாறு உதவ முடியும்?",
  te: "యోజనా సాథికి స్వాగతం! ప్రభుత్వ పథకాలకు సులభమైన మార్గం. ఈరోజు నేను మీకు ఎలా సహాయపడగలను?",
  bn: "যোজনাসাথিতে স্বাগতম! সরকারি প্রকল্পের সহজ পথ। আজ আমি আপনাকে কীভাবে সাহায্য করতে পারি?",
  gu: "યોજના સાથીમાં આપનું સ્વાગત છે! સરકારી યોજનાઓનો સરળ માર્ગ. આજે હું તમારી કેવી રીતે મદદ કરી શકું?",
  pa: "ਯੋਜਨਾ ਸਾਥੀ ਵਿੱਚ ਸਵਾਗਤ! ਸਰਕਾਰੀ ਯੋਜਨਾਵਾਂ ਦਾ ਆਸਾਨ ਰਸਤਾ। ਅੱਜ ਮੈਂ ਤੁਹਾਡੀ ਕਿਵੇਂ ਮਦਦ ਕਰ ਸਕਦਾ ਹਾਂ?",
  kn: "ಯೋಜನಾ ಸಾಥಿಗೆ ಸ್ವಾಗತ! ಸರ್ಕಾರಿ ಯೋಜನೆಗಳಿಗೆ ಸುಲಭ ಮಾರ್ಗ. ಇಂದು ನಾನು ನಿಮಗೆ ಹೇಗೆ ಸಹಾಯ ಮಾಡಬಹುದು?",
  ml: "യോജനാ സാഥിയിലേക്ക് സ്വാഗതം! സർക്കാർ പദ്ധതികളിലേക്കുള്ള എളുപ്പമാർഗ്ഗം. ഇന്ന് ഞാൻ നിങ്ങളെ എങ്ങനെ സഹായിക്കാം?",
  or: "ଯୋଜନା ସାଥିରେ ସ୍ୱାଗତ! ସରକାରୀ ଯୋଜନାଗୁଡ଼ିକର ସହଜ ପଥ। ଆଜି ମୁଁ ଆପଣଙ୍କୁ କିପରି ସାହାଯ୍ୟ କରିପାରିବି?",
  mr: "योजना साथीमध्ये आपले स्वागत आहे! सरकारी योजनांकडे सोपा मार्ग. आज मी तुमची कशी मदत करू शकतो?"
};

// Follow-up questions in different languages
export const followUpQuestions = {
  en: "Would you like to know about another scheme?",
  hi: "क्या आप किसी और योजना के बारे में जानना चाहेंगे?",
  ta: "வேறு திட்டத்தைப் பற்றி அறிய விரும்புகிறீர்களா?",
  te: "మీరు మరొక పథకం గురించి తెలుసుకోవాలనుకుంటున్నారా?",
  bn: "আপনি কি অন্য কোন প্রকল্প সম্পর্কে জানতে চান?",
  gu: "શું તમે બીજી યોજના વિશે જાણવા માંગો છો?",
  pa: "ਕੀ ਤੁਸੀਂ ਕਿਸੇ ਹੋਰ ਯੋਜਨਾ ਬਾਰੇ ਜਾਣਨਾ ਚਾਹੁੰਦੇ ਹੋ?",
  kn: "ನೀವು ಮತ್ತೊಂದು ಯೋಜನೆಯ ಬಗ್ಗೆ ತಿಳಿದುಕೊಳ್ಳಲು ಬಯಸುತ್ತೀರಾ?",
  ml: "മറ്റൊരു പദ്ധതിയെക്കുറിച്ച് അറിയാൻ ആഗ്രഹിക്കുന്നുണ്ടോ?",
  or: "ଆପଣ ଅନ୍ୟ କୌଣସି ଯୋଜନା ବିଷୟରେ ଜାଣିବାକୁ ଚାହୁଁଛନ୍ତି କି?",
  mr: "तुम्हाला दुसऱ्या योजनेबद्दल जाणून घ्यायचे आहे का?"
};

// Format scheme response
export const formatSchemeResponse = (scheme, language = 'en') => {
  const isHindi = language === 'hi';
  return {
    "Scheme Title": isHindi ? scheme.titleHindi : scheme.title,
    "Details": isHindi ? scheme.detailsHindi : scheme.details,
    "Benefits": isHindi ? scheme.benefitsHindi : scheme.benefits,
    "Eligibility": isHindi ? scheme.eligibilityHindi : scheme.eligibility,
    "Application Process (Steps)": isHindi ? scheme.applicationProcessHindi : scheme.applicationProcess,
    "Documents Required": isHindi ? scheme.documentsRequiredHindi : scheme.documentsRequired,
    "Level": scheme.level,
    "Department/State": scheme.department,
    "Sources & References": scheme.sources
  };
};
