'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ArrowLeft, ArrowRight, Check, Sparkles, Search, RefreshCw } from 'lucide-react';
import { CATEGORIES } from '@/data/categoryData';

const STATES = [
  'Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh','Goa',
  'Gujarat','Haryana','Himachal Pradesh','Jharkhand','Karnataka','Kerala',
  'Madhya Pradesh','Maharashtra','Manipur','Meghalaya','Mizoram','Nagaland',
  'Odisha','Punjab','Rajasthan','Sikkim','Tamil Nadu','Telangana','Tripura',
  'Uttar Pradesh','Uttarakhand','West Bengal','Delhi','Jammu & Kashmir',
  'Ladakh','Chandigarh','Puducherry','Andaman & Nicobar','Lakshadweep',
];

const STATE_TRANSLATIONS = {
  hi: {'Andhra Pradesh':'आंध्र प्रदेश','Arunachal Pradesh':'अरुणाचल प्रदेश','Assam':'असम','Bihar':'बिहार','Chhattisgarh':'छत्तीसगढ़','Goa':'गोवा','Gujarat':'गुजरात','Haryana':'हरियाणा','Himachal Pradesh':'हिमाचल प्रदेश','Jharkhand':'झारखंड','Karnataka':'कर्नाटक','Kerala':'केरल','Madhya Pradesh':'मध्य प्रदेश','Maharashtra':'महाराष्ट्र','Manipur':'मणिपुर','Meghalaya':'मेघालय','Mizoram':'मिजोरम','Nagaland':'नागालैंड','Odisha':'ओडिशा','Punjab':'पंजाब','Rajasthan':'राजस्थान','Sikkim':'सिक्किम','Tamil Nadu':'तमिलनाडु','Telangana':'तेलंगाना','Tripura':'त्रिपुरा','Uttar Pradesh':'उत्तर प्रदेश','Uttarakhand':'उत्तराखंड','West Bengal':'पश्चिम बंगाल','Delhi':'दिल्ली','Jammu & Kashmir':'जम्मू और कश्मीर','Ladakh':'लद्दाख','Chandigarh':'चंडीगढ़','Puducherry':'पुडुचेरी','Andaman & Nicobar':'अंडमान और निकोबार','Lakshadweep':'लक्षद्वीप'},
  bn: {'Andhra Pradesh':'অন্ধ্রপ্রদেশ','Arunachal Pradesh':'অরুণাচল প্রদেশ','Assam':'আসাম','Bihar':'বিহার','Chhattisgarh':'ছত্তিশগড়','Goa':'গোয়া','Gujarat':'গুজরাট','Haryana':'হরিয়ানা','Himachal Pradesh':'হিমাচল প্রদেশ','Jharkhand':'ঝাড়খণ্ড','Karnataka':'কর্ণাটক','Kerala':'কেরালা','Madhya Pradesh':'মধ্যপ্রদেশ','Maharashtra':'মহারাষ্ট্র','Manipur':'মণিপুর','Meghalaya':'মেঘালয়','Mizoram':'মিজোরাম','Nagaland':'নাগাল্যান্ড','Odisha':'ওড়িশা','Punjab':'পাঞ্জাব','Rajasthan':'রাজস্থান','Sikkim':'সিকিম','Tamil Nadu':'তামিলনাড়ু','Telangana':'তেলেঙ্গানা','Tripura':'ত্রিপুরা','Uttar Pradesh':'উত্তর প্রদেশ','Uttarakhand':'উত্তরাখণ্ড','West Bengal':'পশ্চিমবঙ্গ','Delhi':'দিল্লি','Jammu & Kashmir':'জম্মু ও কাশ্মীর','Ladakh':'লাদাখ','Chandigarh':'চণ্ডীগড়','Puducherry':'পুদুচেরি','Andaman & Nicobar':'আন্দামান ও নিকোবর','Lakshadweep':'লাক্ষাদ্বীপ'},
  ta: {'Andhra Pradesh':'ஆந்திரப் பிரதேசம்','Arunachal Pradesh':'அருணாச்சலப் பிரதேசம்','Assam':'அசாம்','Bihar':'பீகார்','Chhattisgarh':'சத்தீஸ்கர்','Goa':'கோவா','Gujarat':'குஜராத்','Haryana':'ஹரியானா','Himachal Pradesh':'இமாச்சலப் பிரதேசம்','Jharkhand':'ஜார்க்கண்ட்','Karnataka':'கர்நாடகா','Kerala':'கேரளா','Madhya Pradesh':'மத்தியப் பிரதேசம்','Maharashtra':'மகாராஷ்டிரா','Manipur':'மணிப்பூர்','Meghalaya':'மேகாலயா','Mizoram':'மிசோரம்','Nagaland':'நாகாலாந்து','Odisha':'ஒடிசா','Punjab':'பஞ்சாப்','Rajasthan':'ராஜஸ்தான்','Sikkim':'சிக்கிம்','Tamil Nadu':'தமிழ்நாடு','Telangana':'தெலுங்கானா','Tripura':'திரிபுரா','Uttar Pradesh':'உத்தரப் பிரதேசம்','Uttarakhand':'உத்தரகண்ட்','West Bengal':'மேற்கு வங்காளம்','Delhi':'டெல்லி','Jammu & Kashmir':'ஜம்மு மற்றும் காஷ்மீர்','Ladakh':'லடாக்','Chandigarh':'சண்டிகர்','Puducherry':'புதுச்சேரி','Andaman & Nicobar':'அந்தமான் மற்றும் நிக்கோபார்','Lakshadweep':'லட்சத்தீவு'},
  te: {'Andhra Pradesh':'ఆంధ్రప్రదేశ్','Arunachal Pradesh':'అరుణాచల్ ప్రదేశ్','Assam':'అస్సాం','Bihar':'బీహార్','Chhattisgarh':'ఛత్తీస్‌గఢ్','Goa':'గోవా','Gujarat':'గుజరాత్','Haryana':'హర్యానా','Himachal Pradesh':'హిమాచల్ ప్రదేశ్','Jharkhand':'జార్ఖండ్','Karnataka':'కర్ణాటక','Kerala':'కేరళ','Madhya Pradesh':'మధ్యప్రదేశ్','Maharashtra':'మహారాష్ట్ర','Manipur':'మణిపూర్','Meghalaya':'మేఘాలయ','Mizoram':'మిజోరం','Nagaland':'నాగాలాండ్','Odisha':'ఒడిశా','Punjab':'పంజాబ్','Rajasthan':'రాజస్థాన్','Sikkim':'సిక్కిం','Tamil Nadu':'తమిళనాడు','Telangana':'తెలంగాణ','Tripura':'త్రిపుర','Uttar Pradesh':'ఉత్తర ప్రదేశ్','Uttarakhand':'ఉత్తరాఖండ్','West Bengal':'పశ్చిమ బెంగాల్','Delhi':'ఢిల్లీ','Jammu & Kashmir':'జమ్మూ మరియు కాశ్మీర్','Ladakh':'లడఖ్','Chandigarh':'చండీగఢ్','Puducherry':'పుదుచ్చేరి','Andaman & Nicobar':'అండమాన్ మరియు నికోబార్','Lakshadweep':'లక్షద్వీప్'},
  gu: {'Andhra Pradesh':'આંધ્રપ્રદેશ','Arunachal Pradesh':'અરુણાચલ પ્રદેશ','Assam':'આસામ','Bihar':'બિહાર','Chhattisgarh':'છત્તીસગઢ','Goa':'ગોવા','Gujarat':'ગુજરાત','Haryana':'હરિયાણા','Himachal Pradesh':'હિમાચલ પ્રદેશ','Jharkhand':'ઝારખંડ','Karnataka':'કર્ણાટક','Kerala':'કેરળ','Madhya Pradesh':'મધ્યપ્રદેશ','Maharashtra':'મહારાષ્ટ્ર','Manipur':'મણિપુર','Meghalaya':'મેઘાલય','Mizoram':'મિઝોરમ','Nagaland':'નાગાલેન્ડ','Odisha':'ઓડિશા','Punjab':'પંજાબ','Rajasthan':'રાજસ્થાન','Sikkim':'સિક્કિમ','Tamil Nadu':'તામિલનાડુ','Telangana':'તેલંગાણા','Tripura':'ત્રિપુરા','Uttar Pradesh':'ઉત્તર પ્રદેશ','Uttarakhand':'ઉત્તરાખંડ','West Bengal':'પશ્ચિમ બંગાળ','Delhi':'દિલ્હી','Jammu & Kashmir':'જમ્મુ અને કાશ્મીર','Ladakh':'લદ્દાખ','Chandigarh':'ચંદીગઢ','Puducherry':'પુડુચેરી','Andaman & Nicobar':'આંદામાન અને નિકોબાર','Lakshadweep':'લક્ષદ્વીપ'},
  mr: {'Andhra Pradesh':'आंध्र प्रदेश','Arunachal Pradesh':'अरुणाचल प्रदेश','Assam':'आसाम','Bihar':'बिहार','Chhattisgarh':'छत्तीसगढ','Goa':'गोवा','Gujarat':'गुजरात','Haryana':'हरियाणा','Himachal Pradesh':'हिमाचल प्रदेश','Jharkhand':'झारखंड','Karnataka':'कर्नाटक','Kerala':'केरळ','Madhya Pradesh':'मध्य प्रदेश','Maharashtra':'महाराष्ट्र','Manipur':'मणिपूर','Meghalaya':'मेघालय','Mizoram':'मिझोरम','Nagaland':'नागालँड','Odisha':'ओडिशा','Punjab':'पंजाब','Rajasthan':'राजस्थान','Sikkim':'सिक्कीम','Tamil Nadu':'तमिळनाडू','Telangana':'तेलंगणा','Tripura':'त्रिपुरा','Uttar Pradesh':'उत्तर प्रदेश','Uttarakhand':'उत्तराखंड','West Bengal':'पश्चिम बंगाल','Delhi':'दिल्ली','Jammu & Kashmir':'जम्मू आणि काश्मीर','Ladakh':'लडाख','Chandigarh':'चंदीगड','Puducherry':'पुडुचेरी','Andaman & Nicobar':'अंदमान आणि निकोबार','Lakshadweep':'लक्षद्वीप'},
  pa: {'Andhra Pradesh':'ਆਂਧਰਾ ਪ੍ਰਦੇਸ਼','Arunachal Pradesh':'ਅਰੁਣਾਚਲ ਪ੍ਰਦੇਸ਼','Assam':'ਅਸਾਮ','Bihar':'ਬਿਹਾਰ','Chhattisgarh':'ਛੱਤੀਸਗੜ੍ਹ','Goa':'ਗੋਆ','Gujarat':'ਗੁਜਰਾਤ','Haryana':'ਹਰਿਆਣਾ','Himachal Pradesh':'ਹਿਮਾਚਲ ਪ੍ਰਦੇਸ਼','Jharkhand':'ਝਾਰਖੰਡ','Karnataka':'ਕਰਨਾਟਕ','Kerala':'ਕੇਰਲਾ','Madhya Pradesh':'ਮੱਧ ਪ੍ਰਦੇਸ਼','Maharashtra':'ਮਹਾਰਾਸ਼ਟਰ','Manipur':'ਮਣੀਪੁਰ','Meghalaya':'ਮੇਘਾਲਿਆ','Mizoram':'ਮਿਜ਼ੋਰਮ','Nagaland':'ਨਾਗਾਲੈਂਡ','Odisha':'ਓਡੀਸ਼ਾ','Punjab':'ਪੰਜਾਬ','Rajasthan':'ਰਾਜਸਥਾਨ','Sikkim':'ਸਿੱਕਮ','Tamil Nadu':'ਤਾਮਿਲਨਾਡੂ','Telangana':'ਤੇਲੰਗਾਨਾ','Tripura':'ਤ੍ਰਿਪੁਰਾ','Uttar Pradesh':'ਉੱਤਰ ਪ੍ਰਦੇਸ਼','Uttarakhand':'ਉੱਤਰਾਖੰਡ','West Bengal':'ਪੱਛਮੀ ਬੰਗਾਲ','Delhi':'ਦਿੱਲੀ','Jammu & Kashmir':'ਜੰਮੂ ਅਤੇ ਕਸ਼ਮੀਰ','Ladakh':'ਲੱਦਾਖ','Chandigarh':'ਚੰਡੀਗੜ੍ਹ','Puducherry':'ਪੁਡੂਚੇਰੀ','Andaman & Nicobar':'ਅੰਡੇਮਾਨ ਅਤੇ ਨਿਕੋਬਾਰ','Lakshadweep':'ਲਕਸ਼ਦੀਪ'},
  kn: {'Andhra Pradesh':'ಆಂಧ್ರಪ್ರದೇಶ','Arunachal Pradesh':'ಅರುಣಾಚಲ ಪ್ರದೇಶ','Assam':'ಅಸ್ಸಾಂ','Bihar':'ಬಿಹಾರ','Chhattisgarh':'ಛತ್ತೀಸ್‌ಗಢ','Goa':'ಗೋವಾ','Gujarat':'ಗುಜರಾತ್','Haryana':'ಹರಿಯಾಣ','Himachal Pradesh':'ಹಿಮಾಚಲ ಪ್ರದೇಶ','Jharkhand':'ಜಾರ್ಖಂಡ್','Karnataka':'ಕರ್ನಾಟಕ','Kerala':'ಕೇರಳ','Madhya Pradesh':'ಮಧ್ಯಪ್ರದೇಶ','Maharashtra':'ಮಹಾರಾಷ್ಟ್ರ','Manipur':'ಮಣಿಪುರ','Meghalaya':'ಮೇಘಾಲಯ','Mizoram':'ಮಿಜೋರಾಂ','Nagaland':'ನಾಗಾಲ್ಯಾಂಡ್','Odisha':'ಒಡಿಶಾ','Punjab':'ಪಂಜಾಬ್','Rajasthan':'ರಾಜಸ್ಥಾನ','Sikkim':'ಸಿಕ್ಕಿಂ','Tamil Nadu':'ತಮಿಳುನಾಡು','Telangana':'ತೆಲಂಗಾಣ','Tripura':'ತ್ರಿಪುರಾ','Uttar Pradesh':'ಉತ್ತರ ಪ್ರದೇಶ','Uttarakhand':'ಉತ್ತರಾಖಂಡ','West Bengal':'ಪಶ್ಚಿಮ ಬಂಗಾಳ','Delhi':'ದೆಹಲಿ','Jammu & Kashmir':'ಜಮ್ಮು ಮತ್ತು ಕಾಶ್ಮೀರ','Ladakh':'ಲಡಾಖ್','Chandigarh':'ಚಂಡೀಗಢ','Puducherry':'ಪುದುಚೇರಿ','Andaman & Nicobar':'ಅಂಡಮಾನ್ ಮತ್ತು ನಿಕೋಬಾರ್','Lakshadweep':'ಲಕ್ಷದ್ವೀಪ'},
  ml: {'Andhra Pradesh':'ആന്ധ്രാപ്രദേശ്','Arunachal Pradesh':'അരുണാചൽ പ്രദേശ്','Assam':'അസം','Bihar':'ബീഹാർ','Chhattisgarh':'ഛത്തീസ്ഗഡ്','Goa':'ഗോവ','Gujarat':'ഗുജറാത്ത്','Haryana':'ഹരിയാന','Himachal Pradesh':'ഹിമാചൽ പ്രദേശ്','Jharkhand':'ജാർഖണ്ഡ്','Karnataka':'കർണാടക','Kerala':'കേരളം','Madhya Pradesh':'മധ്യപ്രദേശ്','Maharashtra':'മഹാരാഷ്ട്ര','Manipur':'മണിപ്പൂർ','Meghalaya':'മേഘാലയ','Mizoram':'മിസോറാം','Nagaland':'നാഗാലാൻഡ്','Odisha':'ഒഡീഷ','Punjab':'പഞ്ചാബ്','Rajasthan':'രാജസ്ഥാൻ','Sikkim':'സിക്കിം','Tamil Nadu':'തമിഴ്നാട്','Telangana':'തെലങ്കാന','Tripura':'ത്രിപുര','Uttar Pradesh':'ഉത്തർപ്രദേശ്','Uttarakhand':'ഉത്തരാഖണ്ഡ്','West Bengal':'പശ്ചിമ ബംഗാൾ','Delhi':'ഡൽഹി','Jammu & Kashmir':'ജമ്മു ആൻഡ് കശ്മീർ','Ladakh':'ലഡാക്ക്','Chandigarh':'ചണ്ഡീഗഡ്','Puducherry':'പുതുച്ചേരി','Andaman & Nicobar':'ആൻഡമാൻ ആൻഡ് നിക്കോബാർ','Lakshadweep':'ലക്ഷദ്വീപ്'},
  or: {'Andhra Pradesh':'ଆନ୍ଧ୍ର ପ୍ରଦେଶ','Arunachal Pradesh':'ଅରୁଣାଚଳ ପ୍ରଦେଶ','Assam':'ଆସାମ','Bihar':'ବିହାର','Chhattisgarh':'ଛତିଶଗଡ','Goa':'ଗୋଆ','Gujarat':'ଗୁଜୁରାଟ','Haryana':'ହରିଆଣା','Himachal Pradesh':'ହିମାଚଳ ପ୍ରଦେଶ','Jharkhand':'ଝାଡଖଣ୍ଡ','Karnataka':'କର୍ଣ୍ଣାଟକ','Kerala':'କେରଳ','Madhya Pradesh':'ମଧ୍ୟ ପ୍ରଦେଶ','Maharashtra':'ମହାରାଷ୍ଟ୍ର','Manipur':'ମଣିପୁର','Meghalaya':'ମେଘାଳୟ','Mizoram':'ମିଜୋରାମ','Nagaland':'ନାଗାଲାଣ୍ଡ','Odisha':'ଓଡିଶା','Punjab':'ପଞ୍ଜାବ','Rajasthan':'ରାଜସ୍ଥାନ','Sikkim':'ସିକ୍କିମ୍','Tamil Nadu':'ତାମିଲନାଡୁ','Telangana':'ତେଲେଙ୍ଗାନା','Tripura':'ତ୍ରିପୁରା','Uttar Pradesh':'ଉତ୍ତର ପ୍ରଦେଶ','Uttarakhand':'ଉତ୍ତରାଖଣ୍ଡ','West Bengal':'ପଶ୍ଚିମ ବଙ୍ଗଳା','Delhi':'ଦିଲ୍ଲୀ','Jammu & Kashmir':'ଜାମ୍ମୁ ଓ କାଶ୍ମୀର','Ladakh':'ଲଦାଖ','Chandigarh':'ଚଣ୍ଡିଗଡ଼','Puducherry':'ପୁଡୁଚେରୀ','Andaman & Nicobar':'ଆଣ୍ଡାମାନ ଏବଂ ନିକୋବର','Lakshadweep':'ଲାକ୍ଷାଦ୍ୱୀପ'},
  ur: {'Andhra Pradesh':'آندھرا پردیش','Arunachal Pradesh':'اروناچل پردیش','Assam':'آسام','Bihar':'بہار','Chhattisgarh':'چھتیس گڑھ','Goa':'گوا','Gujarat':'گجرات','Haryana':'ہریانہ','Himachal Pradesh':'ہماچل پردیش','Jharkhand':'جھارکھنڈ','Karnataka':'کرناٹک','Kerala':'کیرالہ','Madhya Pradesh':'مدھیہ پردیش','Maharashtra':'مہاراشٹر','Manipur':'منی پور','Meghalaya':'میگھالیہ','Mizoram':'میزورم','Nagaland':'ناگالینڈ','Odisha':'اڈیشہ','Punjab':'پنجاب','Rajasthan':'راجستھان','Sikkim':'سکم','Tamil Nadu':'تمل ناڈو','Telangana':'تلنگانہ','Tripura':'تریپورہ','Uttar Pradesh':'اتر پردیش','Uttarakhand':'اتراکھنڈ','West Bengal':'مغربی بنگال','Delhi':'دہلی','Jammu & Kashmir':'جموں و کشمیر','Ladakh':'لداخ','Chandigarh':'چنڈی گڑھ','Puducherry':'پڈوچیری','Andaman & Nicobar':'انڈمان اور نکوبار','Lakshadweep':'لکش دیپ'}
};

const UI = {
  en: {
    header: "Find Schemes For You", step: "Step", of: "of",
    searchState: "Search state...", back: "Back", next: "Next", skip: "Skip this question →",
    findMySchemes: "Find My Schemes", profileReady: "Your Profile is Ready!",
    profileSub: "Based on your answers, here are two ways to explore schemes tailored for you.",
    browse: "Browse Matching Schemes", askAI: "Ask AI for Personalized Advice",
    startOver: "Start Over", ageSuffix: "Years",
    q1_t: "Tell us about yourself", q1_s: "What is your gender?",
    q1_o1: "Male", q1_o2: "Female", q1_o3: "Transgender",
    q2_t: "How old are you?", q2_s: "Many schemes have age-based eligibility criteria", q2_p: "Enter your age (e.g. 28)",
    q3_t: "Which state do you live in?", q3_s: "State-specific schemes will be included in results",
    q4_t: "What is your occupation?", q4_s: "Schemes are often tailored to specific occupations",
    q4_o1: "Farmer", q4_o2: "Student", q4_o3: "Salaried", q4_o4: "Self-Employed", q4_o5: "Unemployed", q4_o6: "Other",
    q5_t: "Annual family income?", q5_s: "Income criteria determines scheme eligibility",
    q5_o1: "Below ₹1 Lakh", q5_o2: "₹1 – 3 Lakh", q5_o3: "₹3 – 6 Lakh", q5_o4: "Above ₹6 Lakh",
    q6_t: "Social category", q6_s: "Reserved-category schemes may apply to you",
    q6_o1: "General", q6_o2: "OBC", q6_o3: "SC", q6_o4: "ST", q6_o5: "Minority",
    q7_t: "Areas of interest", q7_s: "Select all that apply — we'll find your best matches"
  },
  hi: {
    header: "अपने लिए योजनाएं खोजें", step: "चरण", of: "से",
    searchState: "राज्य खोजें...", back: "पीछे", next: "अगला", skip: "यह प्रश्न छोड़ें →",
    findMySchemes: "मेरी योजनाएं खोजें", profileReady: "आपकी प्रोफ़ाइल तैयार है!",
    profileSub: "आपके उत्तरों के आधार पर, योजनाओं का पता लगाने के दो तरीके यहां दिए गए हैं।",
    browse: "योजनाएं ब्राउज़ करें", askAI: "AI से व्यक्तिगत सलाह लें",
    startOver: "फिर से शुरू करें", ageSuffix: "वर्ष",
    q1_t: "अपने बारे में बताएं", q1_s: "आपका लिंग क्या है?",
    q1_o1: "पुरुष", q1_o2: "महिला", q1_o3: "ट्रांसजेंडर",
    q2_t: "आपकी आयु कितनी है?", q2_s: "कई योजनाओं में आयु-आधारित पात्रता होती है", q2_p: "अपनी आयु दर्ज करें (उदा. 28)",
    q3_t: "आप किस राज्य में रहते हैं?", q3_s: "राज्य-विशिष्ट योजनाओं को परिणामों में शामिल किया जाएगा",
    q4_t: "आपका व्यवसाय क्या है?", q4_s: "योजनाएं अक्सर विशिष्ट व्यवसायों के अनुरूप होती हैं",
    q4_o1: "किसान", q4_o2: "छात्र", q4_o3: "वेतनभोगी", q4_o4: "स्वरोजगार", q4_o5: "बेरोजगार", q4_o6: "अन्य",
    q5_t: "वार्षिक पारिवारिक आय?", q5_s: "आय मानदंड योजना पात्रता निर्धारित करता है",
    q5_o1: "₹1 लाख से कम", q5_o2: "₹1 – 3 लाख", q5_o3: "₹3 – 6 लाख", q5_o4: "₹6 लाख से अधिक",
    q6_t: "सामाजिक वर्ग", q6_s: "आरक्षित-श्रेणी की योजनाएं आप पर लागू हो सकती हैं",
    q6_o1: "सामान्य", q6_o2: "ओबीसी", q6_o3: "एससी", q6_o4: "एसटी", q6_o5: "अल्पसंख्यक",
    q7_t: "रुचि के क्षेत्र", q7_s: "लागू होने वाले सभी चुनें — हम आपके लिए सबसे अच्छे मिलान खोजेंगे"
  },
  ta: {
    header: "உங்களுக்கான திட்டங்கள்", step: "படி", of: "/",
    searchState: "மாநிலத்தை தேடு...", back: "பின்செல்", next: "அடுத்து", skip: "கேள்வியை தவிர்க்க →",
    findMySchemes: "திட்டங்களை கண்டுபிடி", profileReady: "உங்கள் சுயவிவரம் தயார்!",
    profileSub: "உங்கள் பதில்களின் அடிப்படையில் உங்களுக்கான திட்டங்களை ஆராய இரு வழிகள்.",
    browse: "பொருத்தமான திட்டங்கள்", askAI: "AI இடம் தனிப்பட்ட ஆலோசனை கேள்",
    startOver: "மீண்டும் தொடங்கு", ageSuffix: "வயது",
    q1_t: "உங்களை பற்றி கூறுங்கள்", q1_s: "உங்கள் பாலினம் என்ன?",
    q1_o1: "ஆண்", q1_o2: "பெண்", q1_o3: "திருநங்கை",
    q2_t: "உங்கள் வயது என்ன?", q2_s: "வயது தகுதியை பொறுத்து திட்டங்கள் அமையும்", q2_p: "வயது (உம்: 28)",
    q3_t: "எந்த மாநிலத்தில் வசிக்கிறீர்கள்?", q3_s: "மாநில திட்டங்கள் இதில் சேர்க்கப்படும்",
    q4_t: "உங்கள் தொழில் என்ன?", q4_s: "தொழிலை பொறுத்து திட்டங்கள் அமையும்",
    q4_o1: "விவசாயி", q4_o2: "மாணவர்", q4_o3: "மாத சம்பளம்", q4_o4: "சுயதொழில்", q4_o5: "வேலையில்லை", q4_o6: "மற்றவை",
    q5_t: "ஆண்டு வருமானம்?", q5_s: "வருமானம் தகுதியை நிர்ணயிக்கும்",
    q5_o1: "₹1 லட்சத்திற்கு கீழ்", q5_o2: "₹1 – 3 லட்சம்", q5_o3: "₹3 – 6 லட்சம்", q5_o4: "₹6 லட்சத்திற்கு மேல்",
    q6_t: "சமூக பிரிவு", q6_s: "இடஒதுக்கீடு திட்டங்கள் உங்களுக்கு பொருந்தலாம்",
    q6_o1: "பொது", q6_o2: "OBC", q6_o3: "SC", q6_o4: "ST", q6_o5: "சிறுபான்மையினர்",
    q7_t: "விருப்பமான துறைகள்", q7_s: "அனைத்தையும் தேர்ந்தெடுக்கவும் — சிறந்த பொருத்தங்களை கண்டுபிடிப்போம்"
  },
  te: {
    header: "మీ కోసం పథకాలు", step: "దశ", of: "/",
    searchState: "రాష్ట్రాన్ని వెతకండి...", back: "వెనుకకు", next: "తర్వాత", skip: "ప్రశ్నను దాటవేయండి →",
    findMySchemes: "నా పథకాలను వెతకండి", profileReady: "మీ ప్రొఫైల్ సిద్ధంగా ఉంది!",
    profileSub: "మీ సమాధానాల ఆధారంగా పథకాలను అన్వేషించడానికి రెండు మార్గాలు ఇక్కడ ఉన్నాయి.",
    browse: "సరిపోయే పథకాలను బ్రౌజ్ చేయండి", askAI: "వ్యక్తిగత సలహా కోసం AIని అడగండి",
    startOver: "మళ్లీ ప్రారంభించండి", ageSuffix: "సంవత్సరాలు",
    q1_t: "మీ గురించి చెప్పండి", q1_s: "మీ లింగం ఏమిటి?",
    q1_o1: "పురుషుడు", q1_o2: "స్త్రీ", q1_o3: "ట్రాన్స్‌జెండర్",
    q2_t: "మీ వయస్సు ఎంత?", q2_s: "చాలా పథకాలకు వయస్సు ఆధారిత అర్హత ఉంటుంది", q2_p: "వయస్సును నమోదు చేయండి (ఉదా. 28)",
    q3_t: "మీరు ఏ రాష్ట్రంలో నివసిస్తున్నారు?", q3_s: "రాష్ట్ర-నిర్దిష్ట పథకాలు ఫలితాల్లో చేర్చబడతాయి",
    q4_t: "మీ వృత్తి ఏమిటి?", q4_s: "పథకాలు తరచుగా నిర్దిష్ట వృత్తులకు అనుగుణంగా ఉంటాయి",
    q4_o1: "రైతు", q4_o2: "విద్యార్థి", q4_o3: "జీతగాడు", q4_o4: "స్వయం ఉపాధి", q4_o5: "నిరుద్యోగి", q4_o6: "ఇతరులు",
    q5_t: "వార్షిక కుటుంబ ఆదాయం?", q5_s: "ఆదాయ ప్రమాణాలు అర్హతను నిర్ణయిస్తాయి",
    q5_o1: "₹1 లక్ష కంటే తక్కువ", q5_o2: "₹1 – 3 లక్షలు", q5_o3: "₹3 – 6 లక్షలు", q5_o4: "₹6 లక్షల కంటే ఎక్కువ",
    q6_t: "సామాజిక వర్గం", q6_s: "రిజర్వు చేయబడిన వర్గం పథకాలు మీకు వర్తించవచ్చు",
    q6_o1: "జనరల్", q6_o2: "ఓబీసీ (OBC)", q6_o3: "ఎస్సీ (SC)", q6_o4: "ఎస్టీ (ST)", q6_o5: "మైనారిటీ",
    q7_t: "ఆసక్తి ఉన్న రంగాలు", q7_s: "వర్తించేవన్నీ ఎంచుకోండి — మేము ఉత్తమమైన వాటిని కనుగొంటాము"
  },
  bn: {
    header: "আপনার জন্য প্রকল্প খুঁজুন", step: "ধাপ", of: "/",
    searchState: "রাজ্য খুঁজুন...", back: "পিছনে", next: "পরবর্তী", skip: "এই প্রশ্নটি এড়িয়ে যান →",
    findMySchemes: "আমার প্রকল্প খুঁজুন", profileReady: "আপনার প্রোফাইল প্রস্তুত!",
    profileSub: "আপনার উত্তরের ভিত্তিতে প্রকল্পগুলি অন্বেষণ করার দুটি উপায় এখানে রয়েছে।",
    browse: "মিলিত প্রকল্পগুলি ব্রাউজ করুন", askAI: "ব্যক্তিগত উপদেশের জন্য এআইকে জিজ্ঞাসা করুন",
    startOver: "আবার শুরু করুন", ageSuffix: "বছর",
    q1_t: "আপনার সম্পর্কে বলুন", q1_s: "আপনার লিঙ্গ কী?",
    q1_o1: "পুরুষ", q1_o2: "মহিলা", q1_o3: "তৃতীয় লিঙ্গ",
    q2_t: "আপনার বয়স কত?", q2_s: "অনেক প্রকল্পের বয়স ভিত্তিক যোগ্যতার মানদণ্ড রয়েছে", q2_p: "আপনার বয়স লিখুন (উদাঃ ২৮)",
    q3_t: "আপনি কোন রাজ্যে বাস করেন?", q3_s: "রাজ্য-নির্দিষ্ট প্রকল্পগুলি ফলাফলে অন্তর্ভুক্ত করা হবে",
    q4_t: "আপনার পেশা কী?", q4_s: "প্রকল্পগুলি প্রায়শই নির্দিষ্ট পেশাগুলির জন্য তৈরি করা হয়",
    q4_o1: "কৃষক", q4_o2: "ছাত্র", q4_o3: "বেতনভুক্ত", q4_o4: "স্ব-নিযুক্ত", q4_o5: "বেকার", q4_o6: "অন্যান্য",
    q5_t: "বার্ষিক পারিবারিক আয়?", q5_s: "আয়ের মানদণ্ড প্রকল্পের যোগ্যতা নির্ধারণ করে",
    q5_o1: "₹১ লাখের নিচে", q5_o2: "₹১ – ৩ লাখ", q5_o3: "₹৩ – ৬ লাখ", q5_o4: "₹৬ লাখের উপরে",
    q6_t: "সামাজিক শ্রেণী", q6_s: "সংরক্ষিত বিভাগের প্রকল্পগুলি আপনার ক্ষেত্রে প্রযোজ্য হতে পারে",
    q6_o1: "সাধারণ", q6_o2: "ওবিসি", q6_o3: "তফসিলি জাতি", q6_o4: "তফসিলি উপজাতি", q6_o5: "সংখ্যালঘু",
    q7_t: "আগ্রহের ক্ষেত্র", q7_s: "প্রযোজ্য সমস্ত নির্বাচন করুন — আমরা আপনার জন্য সেরা মিল খুঁজে পাব"
  },
  gu: {
    header: "તમારા માટે યોજનાઓ શોધો", step: "પગલું", of: "/",
    searchState: "રાજ્ય શોધો...", back: "પાછળ", next: "આગળ", skip: "આ પ્રશ્ન છોડી દો →",
    findMySchemes: "મારી યોજનાઓ શોધો", profileReady: "તમારી પ્રોફાઇલ તૈયાર છે!",
    profileSub: "તમારા જવાબોના આધારે, યોજનાઓ શોધવાની બે રીત અહીં છે.",
    browse: "મેચ થતી યોજનાઓ બ્રાઉઝ કરો", askAI: "વ્યક્તિગત સલાહ માટે AI ને પૂછો",
    startOver: "ફરી શરૂ કરો", ageSuffix: "વર્ષ",
    q1_t: "તમારા વિશે કહો", q1_s: "તમારું લિંગ શું છે?",
    q1_o1: "પુરુષ", q1_o2: "સ્ત્રી", q1_o3: "ટ્રાન્સજેન્ડર",
    q2_t: "તમારી ઉંમર કેટલી છે?", q2_s: "ઘણી યોજનાઓમાં ઉંમર આધારિત પાત્રતા હોય છે", q2_p: "ઉંમર દાખલ કરો (દા.ત. 28)",
    q3_t: "તમે કયા રાજ્યમાં રહો છો?", q3_s: "રાજ્ય આધારિત યોજનાઓ પરિણામોમાં શામેલ કરવામાં આવશે",
    q4_t: "તમારો વ્યવસાય શું છે?", q4_s: "યોજનાઓ ચોક્કસ વ્યવસાયો માટે બનાવવામાં આવે છે",
    q4_o1: "ખેડૂત", q4_o2: "વિદ્યાર્થી", q4_o3: "પગારદાર", q4_o4: "સ્વ-રોજગાર", q4_o5: "બેરોજગાર", q4_o6: "અન્ય",
    q5_t: "વાર્ષિક કૌટુંબિક આવક?", q5_s: "આવક પાત્રતા નક્કી કરે છે",
    q5_o1: "₹1 લાખથી ઓછી", q5_o2: "₹1 – 3 લાખ", q5_o3: "₹3 – 6 લાખ", q5_o4: "₹6 લાખથી વધુ",
    q6_t: "સામાજિક વર્ગ", q6_s: "અનામત વર્ગની યોજનાઓ તમને લાગુ પડી શકે છે",
    q6_o1: "સામાન્ય", q6_o2: "ઓબીસી", q6_o3: "એસસી", q6_o4: "એસટી", q6_o5: "લઘુમતી",
    q7_t: "રસના ક્ષેત્રો", q7_s: "લાગુ પડતા તમામ પસંદ કરો — અમે શ્રેષ્ઠ મેચ શોધીશું"
  },
  mr: {
    header: "तुमच्यासाठी योजना शोधा", step: "पायरी", of: "/",
    searchState: "राज्य शोधा...", back: "मागे", next: "पुढे", skip: "हा प्रश्न वगळा →",
    findMySchemes: "माझ्या योजना शोधा", profileReady: "तुमची प्रोफाईल तयार आहे!",
    profileSub: "तुमच्या उत्तरांवर आधारित, योजना शोधण्याचे दोन मार्ग येथे आहेत.",
    browse: "जुळणाऱ्या योजना पहा", askAI: "वैयक्तिकृत सल्ल्यासाठी AI ला विचारा",
    startOver: "पुन्हा सुरू करा", ageSuffix: "वर्षे",
    q1_t: "तुमच्याबद्दल सांगा", q1_s: "तुमचे लिंग काय आहे?",
    q1_o1: "पुरुष", q1_o2: "स्त्री", q1_o3: "तृतीयपंथी",
    q2_t: "तुमचे वय काय आहे?", q2_s: "बऱ्याच योजनांमध्ये वयावर आधारित पात्रता असते", q2_p: "तुमचे वय टाका (उदा. २८)",
    q3_t: "तुम्ही कोणत्या राज्यात राहता?", q3_s: "राज्य-विशिष्ट योजना परिणामांमध्ये समाविष्ट केल्या जातील",
    q4_t: "तुमचा व्यवसाय काय आहे?", q4_s: "योजना बऱ्याचदा विशिष्ट व्यवसायांनुसार तयार केल्या जातात",
    q4_o1: "शेतकरी", q4_o2: "विद्यार्थी", q4_o3: "पगारदार", q4_o4: "स्वयंरोजगार", q4_o5: "बेरोजगार", q4_o6: "इतर",
    q5_t: "वार्षिक कौटुंबिक उत्पन्न?", q5_s: "उत्पन्नाचे निकष योजनेची पात्रता ठरवतात",
    q5_o1: "₹१ लाखापेक्षा कमी", q5_o2: "₹१ – ३ लाख", q5_o3: "₹३ – ६ लाख", q5_o4: "₹६ लाखांपेक्षा जास्त",
    q6_t: "सामाजिक प्रवर्ग", q6_s: "राखीव प्रवर्गातील योजना तुम्हाला लागू होऊ शकतात",
    q6_o1: "खुला", q6_o2: "ओबीसी (OBC)", q6_o3: "एससी (SC)", q6_o4: "एसटी (ST)", q6_o5: "अल्पसंख्याक",
    q7_t: "आवडीचे क्षेत्र", q7_s: "लागू होणारे सर्व निवडा — आम्ही सर्वोत्तम योजना शोधू"
  },
  pa: {
    header: "ਆਪਣੇ ਲਈ ਸਕੀਮਾਂ ਲੱਭੋ", step: "ਕਦਮ", of: "/",
    searchState: "ਰਾਜ ਲੱਭੋ...", back: "ਪਿੱਛੇ", next: "ਅੱਗੇ", skip: "ਇਹ ਸਵਾਲ ਛੱਡੋ →",
    findMySchemes: "ਮੇਰੀਆਂ ਸਕੀਮਾਂ ਲੱਭੋ", profileReady: "ਤੁਹਾਡੀ ਪ੍ਰੋਫਾਈਲ ਤਿਆਰ ਹੈ!",
    profileSub: "ਤੁਹਾਡੇ ਜਵਾਬਾਂ ਦੇ ਆਧਾਰ 'ਤੇ, ਸਕੀਮਾਂ ਲੱਭਣ ਦੇ ਦੋ ਤਰੀਕੇ ਇੱਥੇ ਹਨ।",
    browse: "ਮੇਲ ਖਾਂਦੀਆਂ ਸਕੀਮਾਂ ਦੇਖੋ", askAI: "ਨਿੱਜੀ ਸਲਾਹ ਲਈ AI ਨੂੰ ਪੁੱਛੋ",
    startOver: "ਦੁਬਾਰਾ ਸ਼ੁਰੂ ਕਰੋ", ageSuffix: "ਸਾਲ",
    q1_t: "ਆਪਣੇ ਬਾਰੇ ਦੱਸੋ", q1_s: "ਤੁਹਾਡਾ ਲਿੰਗ ਕੀ ਹੈ?",
    q1_o1: "ਮਰਦ", q1_o2: "ਔਰਤ", q1_o3: "ਟਰਾਂਸਜੈਂਡਰ",
    q2_t: "ਤੁਹਾਡੀ ਉਮਰ ਕਿੰਨੀ ਹੈ?", q2_s: "ਕਈ ਸਕੀਮਾਂ ਵਿੱਚ ਉਮਰ-ਅਧਾਰਿਤ ਯੋਗਤਾ ਹੁੰਦੀ ਹੈ", q2_p: "ਆਪਣੀ ਉਮਰ ਦਰਜ ਕਰੋ (ਜਿਵੇਂ ਕਿ 28)",
    q3_t: "ਤੁਸੀਂ ਕਿਹੜੇ ਰਾਜ ਵਿੱਚ ਰਹਿੰਦੇ ਹੋ?", q3_s: "ਰਾਜ-ਵਿਸ਼ੇਸ਼ ਸਕੀਮਾਂ ਨਤੀਜਿਆਂ ਵਿੱਚ ਸ਼ਾਮਲ ਕੀਤੀਆਂ ਜਾਣਗੀਆਂ",
    q4_t: "ਤੁਹਾਡਾ ਪੇਸ਼ਾ ਕੀ ਹੈ?", q4_s: "ਸਕੀਮਾਂ ਅਕਸਰ ਖਾਸ ਪੇਸ਼ਿਆਂ ਲਈ ਬਣਾਈਆਂ ਜਾਂਦੀਆਂ ਹਨ",
    q4_o1: "ਕਿਸਾਨ", q4_o2: "ਵਿਦਿਆਰਥੀ", q4_o3: "ਤਨਖਾਹਦਾਰ", q4_o4: "ਸਵੈ-ਰੁਜ਼ਗਾਰ", q4_o5: "ਬੇਰੁਜ਼ਗਾਰ", q4_o6: "ਹੋਰ",
    q5_t: "ਸਲਾਨਾ ਪਰਿਵਾਰਕ ਆਮਦਨ?", q5_s: "ਆਮਦਨ ਯੋਗਤਾ ਨਿਰਧਾਰਤ ਕਰਦੀ ਹੈ",
    q5_o1: "₹1 ਲੱਖ ਤੋਂ ਘੱਟ", q5_o2: "₹1 – 3 ਲੱਖ", q5_o3: "₹3 – 6 ਲੱਖ", q5_o4: "₹6 ਲੱਖ ਤੋਂ ਵੱਧ",
    q6_t: "ਸਮਾਜਿਕ ਸ਼੍ਰੇਣੀ", q6_s: "ਰਾਖਵੀਂ ਸ਼੍ਰੇਣੀ ਦੀਆਂ ਸਕੀਮਾਂ ਤੁਹਾਡੇ 'ਤੇ ਲਾਗੂ ਹੋ ਸਕਦੀਆਂ ਹਨ",
    q6_o1: "ਜਨਰਲ", q6_o2: "ਓਬੀਸੀ", q6_o3: "ਐਸਸੀ", q6_o4: "ਐਸਟੀ", q6_o5: "ਘੱਟ ਗਿਣਤੀ",
    q7_t: "ਦਿਲਚਸਪੀ ਵਾਲੇ ਖੇਤਰ", q7_s: "ਲਾਗੂ ਹੋਣ ਵਾਲੇ ਸਾਰੇ ਚੁਣੋ — ਅਸੀਂ ਸਭ ਤੋਂ ਵਧੀਆ ਸਕੀਮਾਂ ਲੱਭਾਂਗੇ"
  },
  kn: {
    header: "ನಿಮಗಾಗಿ ಯೋಜನೆಗಳನ್ನು ಹುಡುಕಿ", step: "ಹಂತ", of: "/",
    searchState: "ರಾಜ್ಯವನ್ನು ಹುಡುಕಿ...", back: "ಹಿಂದೆ", next: "ಮುಂದೆ", skip: "ಈ ಪ್ರಶ್ನೆಯನ್ನು ಬಿಟ್ಟುಬಿಡಿ →",
    findMySchemes: "ನನ್ನ ಯೋಜನೆಗಳನ್ನು ಹುಡುಕಿ", profileReady: "ನಿಮ್ಮ ಪ್ರೊಫೈಲ್ ಸಿದ್ಧವಾಗಿದೆ!",
    profileSub: "ನಿಮ್ಮ ಉತ್ತರಗಳ ಆಧಾರದ ಮೇಲೆ, ಯೋಜನೆಗಳನ್ನು ಅನ್ವೇಷಿಸಲು ಎರಡು ಮಾರ್ಗಗಳಿವೆ.",
    browse: "ಹೊಂದಾಣಿಕೆಯಾಗುವ ಯೋಜನೆಗಳನ್ನು ಬ್ರೌಸ್ ಮಾಡಿ", askAI: "ವೈಯಕ್ತಿಕ ಸಲಹೆಗಾಗಿ AI ಅನ್ನು ಕೇಳಿ",
    startOver: "ಮತ್ತೆ ಪ್ರಾರಂಭಿಸಿ", ageSuffix: "ವರ್ಷಗಳು",
    q1_t: "ನಿಮ್ಮ ಬಗ್ಗೆ ತಿಳಿಸಿ", q1_s: "ನಿಮ್ಮ ಲಿಂಗವೇನು?",
    q1_o1: "ಪುರುಷ", q1_o2: "ಮಹಿಳೆ", q1_o3: "ತೃತೀಯಲಿಂಗಿ",
    q2_t: "ನಿಮ್ಮ ವಯಸ್ಸು ಎಷ್ಟು?", q2_s: "ಹಲವು ಯೋಜನೆಗಳು ವಯಸ್ಸಿನ ಆಧಾರಿತ ಅರ್ಹತೆಯನ್ನು ಹೊಂದಿವೆ", q2_p: "ನಿಮ್ಮ ವಯಸ್ಸನ್ನು ನಮೂದಿಸಿ (ಉದಾ. 28)",
    q3_t: "ನೀವು ಯಾವ ರಾಜ್ಯದಲ್ಲಿ ವಾಸಿಸುತ್ತಿದ್ದೀರಿ?", q3_s: "ರಾಜ್ಯ-ನಿರ್ದಿಷ್ಟ ಯೋಜನೆಗಳನ್ನು ಫಲಿತಾಂಶಗಳಲ್ಲಿ ಸೇರಿಸಲಾಗುತ್ತದೆ",
    q4_t: "ನಿಮ್ಮ ವೃತ್ತಿ ಏನು?", q4_s: "ಯೋಜನೆಗಳನ್ನು ನಿರ್ದಿಷ್ಟ ವೃತ್ತಿಗಳಿಗೆ ಅನುಗುಣವಾಗಿ ವಿನ್ಯಾಸಗೊಳಿಸಲಾಗಿದೆ",
    q4_o1: "ರೈತ", q4_o2: "ವಿದ್ಯಾರ್ಥಿ", q4_o3: "ವೇತನ ಪಡೆಯುವವರು", q4_o4: "ಸ್ವಯಂ ಉದ್ಯೋಗಿ", q4_o5: "ನಿರುದ್ಯೋಗಿ", q4_o6: "ಇತರೆ",
    q5_t: "ವಾರ್ಷಿಕ ಕುಟುಂಬದ ಆದಾಯ?", q5_s: "ಆದಾಯದ ಮಾನದಂಡವು ಅರ್ಹತೆಯನ್ನು ನಿರ್ಧರಿಸುತ್ತದೆ",
    q5_o1: "₹1 ಲಕ್ಷಕ್ಕಿಂತ ಕಡಿಮೆ", q5_o2: "₹1 – 3 ಲಕ್ಷ", q5_o3: "₹3 – 6 ಲಕ್ಷ", q5_o4: "₹6 ಲಕ್ಷಕ್ಕಿಂತ ಹೆಚ್ಚು",
    q6_t: "ಸಾಮಾಜಿಕ ವರ್ಗ", q6_s: "ಮೀಸಲಾತಿ ವರ್ಗದ ಯೋಜನೆಗಳು ನಿಮಗೆ ಅನ್ವಯವಾಗಬಹುದು",
    q6_o1: "ಸಾಮಾನ್ಯ", q6_o2: "ಒಬಿಸಿ", q6_o3: "ಎಸ್ಸಿ", q6_o4: "ಎಸ್ಟಿ", q6_o5: "ಅಲ್ಪಸಂಖ್ಯಾತ",
    q7_t: "ಆಸಕ್ತಿಯ ಕ್ಷೇತ್ರಗಳು", q7_s: "ಅನ್ವಯವಾಗುವ ಎಲ್ಲವನ್ನೂ ಆಯ್ಕೆಮಾಡಿ — ನಾವು ಉತ್ತಮ ಹೊಂದಾಣಿಕೆಗಳನ್ನು ಹುಡುಕುತ್ತೇವೆ"
  },
  ml: {
    header: "നിങ്ങൾക്കുള്ള പദ്ധതികൾ കണ്ടെത്തുക", step: "ഘട്ടം", of: "/",
    searchState: "സംസ്ഥാനം തിരയുക...", back: "പുറകിലേക്ക്", next: "അടുത്തത്", skip: "ഈ ചോദ്യം ഒഴിവാക്കുക →",
    findMySchemes: "എന്റെ പദ്ധതികൾ കണ്ടെത്തുക", profileReady: "നിങ്ങളുടെ പ്രൊഫൈൽ തയ്യാറാണ്!",
    profileSub: "നിങ്ങളുടെ ഉത്തരങ്ങളെ അടിസ്ഥാനമാക്കി, പദ്ധതികൾ പര്യവേക്ഷണം ചെയ്യാനുള്ള രണ്ട് വഴികൾ ഇതാ.",
    browse: "അനുയോജ്യമായ പദ്ധതികൾ കാണുക", askAI: "വ്യക്തിഗത ഉപദേശത്തിനായി AI-യോട് ചോദിക്കുക",
    startOver: "വീണ്ടും ആരംഭിക്കുക", ageSuffix: "വയസ്സ്",
    q1_t: "നിങ്ങളെക്കുറിച്ച് പറയുക", q1_s: "നിങ്ങളുടെ ലിംഗഭേദം എന്താണ്?",
    q1_o1: "പുരുഷൻ", q1_o2: "സ്ത്രീ", q1_o3: "ട്രാൻസ്ജെൻഡർ",
    q2_t: "നിങ്ങളുടെ പ്രായം എത്രയാണ്?", q2_s: "പല പദ്ധതികൾക്കും പ്രായത്തെ അടിസ്ഥാനമാക്കിയുള്ള യോഗ്യതയുണ്ട്", q2_p: "നിങ്ങളുടെ പ്രായം നൽകുക (ഉദാ: 28)",
    q3_t: "നിങ്ങൾ ഏത് സംസ്ഥാനത്താണ് താമസിക്കുന്നത്?", q3_s: "സംസ്ഥാന-നിർദ്ദിഷ്ട പദ്ധതികൾ ഫലങ്ങളിൽ ഉൾപ്പെടുത്തും",
    q4_t: "നിങ്ങളുടെ തൊഴിൽ എന്താണ്?", q4_s: "പദ്ധതികൾ പലപ്പോഴും നിർദ്ദിഷ്ട തൊഴിലുകൾക്കായി രൂപകൽപ്പന ചെയ്തതാണ്",
    q4_o1: "കർഷകൻ", q4_o2: "വിദ്യാർത്ഥി", q4_o3: "ശമ്പളക്കാരൻ", q4_o4: "സ്വയം തൊഴിൽ", q4_o5: "തൊഴിലില്ലാത്തവർ", q4_o6: "മറ്റുള്ളവ",
    q5_t: "വാർഷിക കുടുംബ വരുമാനം?", q5_s: "വരുമാന മാനദണ്ഡങ്ങൾ യോഗ്യത നിർണ്ണയിക്കുന്നു",
    q5_o1: "₹1 ലക്ഷത്തിൽ താഴെ", q5_o2: "₹1 – 3 ലക്ഷം", q5_o3: "₹3 – 6 ലക്ഷം", q5_o4: "₹6 ലക്ഷത്തിന് മുകളിൽ",
    q6_t: "സാമൂഹിക വിഭാഗം", q6_s: "സംവരണ വിഭാഗ പദ്ധതികൾ നിങ്ങൾക്ക് ബാധകമായേക്കാം",
    q6_o1: "പൊതുവിഭാഗം", q6_o2: "ഒബിസി", q6_o3: "എസ്സി", q6_o4: "എസ്ടി", q6_o5: "ന്യൂനപക്ഷം",
    q7_t: "താല്പര്യമുള്ള മേഖലകൾ", q7_s: "ബാധകമായ എല്ലാം തിരഞ്ഞെടുക്കുക — ഞങ്ങൾ മികച്ചവ കണ്ടെത്തും"
  },
  or: {
    header: "ଆପଣଙ୍କ ପାଇଁ ଯୋଜନା ଖୋଜନ୍ତୁ", step: "ପଦକ୍ଷେପ", of: "/",
    searchState: "ରାଜ୍ୟ ଖୋଜନ୍ତୁ...", back: "ପଛକୁ", next: "ଆଗକୁ", skip: "ଏହି ପ୍ରଶ୍ନକୁ ବାଦ୍ ଦିଅନ୍ତୁ →",
    findMySchemes: "ମୋର ଯୋଜନା ଖୋଜନ୍ତୁ", profileReady: "ଆପଣଙ୍କ ପ୍ରୋଫାଇଲ୍ ପ୍ରସ୍ତୁତ ଅଛି!",
    profileSub: "ଆପଣଙ୍କ ଉତ୍ତର ଆଧାରରେ ଯୋଜନା ଅନୁସନ୍ଧାନ କରିବାର ଦୁଇଟି ଉପାୟ ଏଠାରେ ଅଛି |",
    browse: "ମେଳ ଖାଉଥିବା ଯୋଜନା ଦେଖନ୍ତୁ", askAI: "ବ୍ୟକ୍ତିଗତ ପରାମର୍ଶ ପାଇଁ AI କୁ ପଚାରନ୍ତୁ",
    startOver: "ପୁନର୍ବାର ଆରମ୍ଭ କରନ୍ତୁ", ageSuffix: "ବର୍ଷ",
    q1_t: "ଆପଣଙ୍କ ବିଷୟରେ କୁହନ୍ତୁ", q1_s: "ଆପଣଙ୍କ ଲିଙ୍ଗ କଣ?",
    q1_o1: "ପୁରୁଷ", q1_o2: "ମହିଳା", q1_o3: "କିନ୍ନର",
    q2_t: "ଆପଣଙ୍କ ବୟସ କେତେ?", q2_s: "ଅନେକ ଯୋଜନାରେ ବୟସ ଆଧାରିତ ଯୋଗ୍ୟତା ଥାଏ |", q2_p: "ଆପଣଙ୍କ ବୟସ ଲେଖନ୍ତୁ (ଉଦାହରଣ: 28)",
    q3_t: "ଆପଣ କେଉଁ ରାଜ୍ୟରେ ରୁହନ୍ତି?", q3_s: "ରାଜ୍ୟ-ନିର୍ଦ୍ଦିଷ୍ଟ ଯୋଜନା ଫଳାଫଳରେ ଅନ୍ତର୍ଭୁକ୍ତ କରାଯିବ |",
    q4_t: "ଆପଣଙ୍କ ପେଶା କଣ?", q4_s: "ଯୋଜନାଗୁଡିକ ପ୍ରାୟତଃ ନିର୍ଦ୍ଦିଷ୍ଟ ପେଶା ପାଇଁ ପ୍ରସ୍ତୁତ କରାଯାଏ |",
    q4_o1: "କୃଷକ", q4_o2: "ଛାତ୍ର", q4_o3: "ବେତନଭୋଗୀ", q4_o4: "ଆତ୍ମନିର୍ଭରଶୀଳ", q4_o5: "ବେକାର", q4_o6: "ଅନ୍ୟାନ୍ୟ",
    q5_t: "ବାର୍ଷିକ ପାରିବାରିକ ଆୟ?", q5_s: "ଆୟ ମାନଦଣ୍ଡ ଯୋଗ୍ୟତା ନିର୍ଦ୍ଧାରଣ କରେ |",
    q5_o1: "₹1 ଲକ୍ଷରୁ କମ୍", q5_o2: "₹1 – 3 ଲକ୍ଷ", q5_o3: "₹3 – 6 ଲକ୍ଷ", q5_o4: "₹6 ଲକ୍ଷରୁ ଅଧିକ",
    q6_t: "ସାମାଜିକ ବର୍ଗ", q6_s: "ସଂରକ୍ଷିତ ବର୍ଗ ଯୋଜନା ଆପଣଙ୍କ ପାଇଁ ଲାଗୁ ହୋଇପାରେ |",
    q6_o1: "ସାଧାରଣ", q6_o2: "ଓବିସି", q6_o3: "ଏସସି", q6_o4: "ଏସଟି", q6_o5: "ସଂଖ୍ୟାଲଘୁ",
    q7_t: "ଆଗ୍ରହର କ୍ଷେତ୍ର", q7_s: "ପ୍ରଯୁଜ୍ୟ ସମସ୍ତ ବାଛନ୍ତୁ — ଆମେ ସର୍ବୋତ୍ତମ ଯୋଜନା ଖୋଜିବୁ |"
  },
  ur: {
    header: "اپنے لیے اسکیمیں تلاش کریں", step: "مرحلہ", of: "/",
    searchState: "ریاست تلاش کریں...", back: "پیچھے", next: "آگے", skip: "اس سوال کو چھوڑیں →",
    findMySchemes: "میری اسکیمیں تلاش کریں", profileReady: "آپ کا پروفائل تیار ہے!",
    profileSub: "آپ کے جوابات کی بنیاد پر، اسکیمیں تلاش کرنے کے دو طریقے یہ ہیں۔",
    browse: "مماثل اسکیمیں براؤز کریں", askAI: "ذاتی مشورے کے لیے AI سے پوچھیں",
    startOver: "دوبارہ شروع کریں", ageSuffix: "سال",
    q1_t: "اپنے بارے میں بتائیں", q1_s: "آپ کی صنف کیا ہے؟",
    q1_o1: "مرد", q1_o2: "خاتون", q1_o3: "ٹرانس جینڈر",
    q2_t: "آپ کی عمر کتنی ہے؟", q2_s: "بہت سی اسکیموں میں عمر کی بنیاد پر اہلیت ہوتی ہے", q2_p: "اپنی عمر درج کریں (جیسے 28)",
    q3_t: "آپ کس ریاست میں رہتے ہیں؟", q3_s: "ریاست سے متعلق اسکیمیں نتائج میں شامل ہوں گی",
    q4_t: "آپ کا پیشہ کیا ہے؟", q4_s: "اسکیمیں اکثر مخصوص پیشوں کے لیے بنائی جاتی ہیں",
    q4_o1: "کسان", q4_o2: "طالب علم", q4_o3: "تنخواہ دار", q4_o4: "خود روزگار", q4_o5: "بے روزگار", q4_o6: "دیگر",
    q5_t: "سالانہ خاندانی آمدنی؟", q5_s: "آمدنی کا معیار اہلیت کا تعین کرتا ہے",
    q5_o1: "₹1 لاکھ سے کم", q5_o2: "₹1 – 3 لاکھ", q5_o3: "₹3 – 6 لاکھ", q5_o4: "₹6 لاکھ سے زیادہ",
    q6_t: "سماجی زمرہ", q6_s: "محفوظ زمرے کی اسکیمیں آپ پر لاگو ہو سکتی ہیں",
    q6_o1: "جنرل", q6_o2: "او بی سی", q6_o3: "ایس سی", q6_o4: "ایس ٹی", q6_o5: "اقلیت",
    q7_t: "دلچسپی کے شعبے", q7_s: "تمام متعلقہ کا انتخاب کریں — ہم بہترین اسکیمیں تلاش کریں گے"
  }
};

export default function FindSchemes() {
  const router = useRouter();
  const [lang, setLang] = useState('en');
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [stateQ, setStateQ] = useState('');
  const [done, setDone] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('yojna_lang');
    if (saved) setLang(saved);
  }, []);

  const t = UI[lang] || UI.en;

  const QUESTIONS = [
    {
      id: 'gender', step: 1, type: 'chips', title: t.q1_t, subtitle: t.q1_s,
      options: [
        { v: 'male', l: t.q1_o1, icon: '👨' },
        { v: 'female', l: t.q1_o2, icon: '👩' },
        { v: 'transgender', l: t.q1_o3, icon: '🏳️‍⚧️' },
      ],
    },
    {
      id: 'age', step: 2, type: 'number', title: t.q2_t, subtitle: t.q2_s, placeholder: t.q2_p,
    },
    {
      id: 'state', step: 3, type: 'dropdown', title: t.q3_t, subtitle: t.q3_s, options: STATES,
    },
    {
      id: 'occupation', step: 4, type: 'chips', title: t.q4_t, subtitle: t.q4_s,
      options: [
        { v: 'farmer', l: t.q4_o1, icon: '🌾' },
        { v: 'student', l: t.q4_o2, icon: '🎓' },
        { v: 'salaried', l: t.q4_o3, icon: '💼' },
        { v: 'self_employed', l: t.q4_o4, icon: '🏪' },
        { v: 'unemployed', l: t.q4_o5, icon: '🔍' },
        { v: 'other', l: t.q4_o6, icon: '👤' },
      ],
    },
    {
      id: 'income', step: 5, type: 'chips', title: t.q5_t, subtitle: t.q5_s,
      options: [
        { v: 'below_1l', l: t.q5_o1, icon: '📉' },
        { v: '1_3l', l: t.q5_o2, icon: '📊' },
        { v: '3_6l', l: t.q5_o3, icon: '📈' },
        { v: 'above_6l', l: t.q5_o4, icon: '💰' },
      ],
    },
    {
      id: 'caste', step: 6, type: 'chips', title: t.q6_t, subtitle: t.q6_s,
      options: [
        { v: 'general', l: t.q6_o1, icon: '👤' },
        { v: 'obc', l: t.q6_o2, icon: '🔵' },
        { v: 'sc', l: t.q6_o3, icon: '🟣' },
        { v: 'st', l: t.q6_o4, icon: '🟤' },
        { v: 'minority', l: t.q6_o5, icon: '🌙' },
      ],
    },
    {
      id: 'interests', step: 7, type: 'multi', title: t.q7_t, subtitle: t.q7_s,
      options: CATEGORIES.map(c => ({ v: c.key, l: c.names[lang] || c.names.en, icon: c.icon })),
    },
  ];

  const TOTAL = QUESTIONS.length;
  const q = QUESTIONS[step];
  const ans = answers[q?.id];
  const getStateName = (s) => STATE_TRANSLATIONS[lang]?.[s] || s;

  const canNext = () => {
    if (!q) return false;
    if (q.type === 'multi') return Array.isArray(ans) && ans.length > 0;
    if (q.type === 'number') {
      if (!ans || String(ans).trim() === '') return false;
      if (q.id === 'age') {
        const ageVal = parseInt(ans, 10);
        if (isNaN(ageVal) || ageVal < 1 || ageVal > 120) return false;
      }
      return true;
    }
    if (q.type === 'dropdown') return !!ans;
    return !!ans;
  };

  const select = (val) => {
    if (q.type === 'multi') {
      const prev = answers[q.id] || [];
      const next = prev.includes(val) ? prev.filter(x => x !== val) : [...prev, val];
      setAnswers(p => ({ ...p, [q.id]: next }));
    } else {
      setAnswers(p => ({ ...p, [q.id]: val }));
    }
  };

  const next = () => {
    if (step < TOTAL - 1) setStep(s => s + 1);
    else finish();
  };
  const back = () => { if (step > 0) setStep(s => s - 1); };

  const finish = () => {
    setDone(true);
    localStorage.setItem('findSchemes_answers', JSON.stringify(answers));
  };

  const buildChatMsg = () => {
    const a = answers;
    const qOcc = QUESTIONS.find(q => q.id === 'occupation');
    const occ = qOcc?.options.find(o => o.v === a.occupation)?.l || a.occupation || '';
    
    const qInc = QUESTIONS.find(q => q.id === 'income');
    const income = qInc?.options.find(o => o.v === a.income)?.l || a.income || '';
    
    const qCaste = QUESTIONS.find(q => q.id === 'caste');
    const caste = qCaste?.options.find(o => o.v === a.caste)?.l || a.caste || '';
    
    const interests = (a.interests || []).map(i => CATEGORIES.find(c => c.key === i)?.names.en || i).join(', ');
    
    return encodeURIComponent(
      `I am a ${a.age || 'adult'}-year-old ${a.gender || 'person'} from ${a.state || 'India'}. ` +
      `Occupation: ${occ || 'Not specified'}. Annual income: ${income || 'Not specified'}. Social category: ${caste || 'Not specified'}. ` +
      `Interested in: ${interests || 'all schemes'}. ` +
      `Please suggest all government schemes I am eligible for.`
    );
  };

  const browseCat = () => {
    const keywords = [];
    if (answers.gender) keywords.push(getOptLabel('gender', answers.gender));
    if (answers.occupation) keywords.push(getOptLabel('occupation', answers.occupation));
    if (answers.state) keywords.push(answers.state);
    if (answers.caste && answers.caste !== 'general') keywords.push(getOptLabel('caste', answers.caste));
    
    const cat = (answers.interests || [])[0];
    const searchStr = encodeURIComponent(keywords.join(' '));
    
    let url = '/schemes';
    if (cat || searchStr) {
      url += '?';
      if (cat) url += `cat=${cat}`;
      if (cat && searchStr) url += '&';
      if (searchStr) url += `search=${searchStr}`;
    }
    router.push(url);
  };

  const pct = Math.round(((step + 1) / TOTAL) * 100);

  // Safely get labels for chips
  const getOptLabel = (qId, val) => {
    if (qId === 'state') return STATE_TRANSLATIONS[lang]?.[val] || val;
    if (!val) return null;
    const question = QUESTIONS.find(x => x.id === qId);
    if (!question || !question.options) return val;
    const opt = question.options.find(o => o.v === val);
    return opt ? opt.l : val;
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar lang={lang} setLang={setLang} />

      {/* Ambient blobs */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full bg-[#3B82F6]/10 blur-[120px]" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-[#60A5FA]/8 blur-[100px]" />
      </div>

      <main className="flex-1 flex flex-col items-center justify-center px-4 py-12 relative z-10">
        <div className="w-full max-w-xl">

          {!done ? (
            <>
              {/* Header */}
              <div className="text-center mb-8">
                <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 text-[#0271BC] text-sm font-bold mb-4 border border-blue-100">
                  <Sparkles className="w-4 h-4" /> {t.header}
                </span>
                <p className="text-gray-400 text-sm font-medium">
                  {t.step} {step + 1} {t.of} {TOTAL}
                </p>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-gray-100 rounded-full h-2 mb-8 overflow-hidden">
                <div
                  className="h-2 rounded-full transition-all duration-500"
                  style={{ width: `${pct}%`, background: 'linear-gradient(90deg,#3B82F6,#60A5FA)' }}
                />
              </div>

              {/* Card */}
              {q && (
                <div className="bg-white rounded-3xl border border-black/6 shadow-[0_8px_40px_rgba(59,130,246,0.12)] p-8">
                  <h2 className="text-2xl font-extrabold text-gray-900 mb-1 tracking-tight">{q.title}</h2>
                  <p className="text-sm text-gray-400 font-medium mb-7">{q.subtitle}</p>

                  {/* CHIPS */}
                  {(q.type === 'chips' || q.type === 'multi') && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {q.options.map(o => {
                        const isSelected = q.type === 'multi'
                          ? (answers[q.id] || []).includes(o.v)
                          : answers[q.id] === o.v;
                        return (
                          <button
                            key={o.v}
                            onClick={() => select(o.v)}
                            className={`relative flex flex-col items-center gap-2 p-4 rounded-2xl border-2 font-bold text-sm transition-all duration-200 hover:scale-[1.03] active:scale-95
                              ${isSelected
                                ? 'border-[#3B82F6] bg-blue-50 text-[#2563EB] shadow-md'
                                : 'border-gray-100 bg-gray-50 text-gray-600 hover:border-[#3B82F6]/40 hover:bg-blue-50/50'}`}
                          >
                            {isSelected && (
                              <span className="absolute top-2 right-2 w-5 h-5 rounded-full bg-[#3B82F6] flex items-center justify-center">
                                <Check className="w-3 h-3 text-white" />
                              </span>
                            )}
                            <span className="text-2xl">{o.icon}</span>
                            <span className="text-center">{o.l}</span>
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {/* NUMBER */}
                  {q.type === 'number' && (
                    <input
                      type="number"
                      min={1} max={120}
                      placeholder={q.placeholder}
                      value={answers[q.id] || ''}
                      onChange={e => setAnswers(p => ({ ...p, [q.id]: e.target.value }))}
                      className="w-full border-2 border-gray-200 focus:border-[#3B82F6] rounded-2xl px-5 py-4 text-2xl font-bold outline-none transition-colors text-gray-800 bg-gray-50 placeholder:text-gray-300"
                    />
                  )}

                  {/* DROPDOWN */}
                  {q.type === 'dropdown' && (
                    <div className="space-y-3">
                      <input
                        type="text"
                        placeholder={t.searchState}
                        value={stateQ}
                        onChange={e => setStateQ(e.target.value)}
                        className="w-full border-2 border-gray-200 focus:border-[#3B82F6] rounded-2xl px-5 py-3 text-sm font-medium outline-none transition-colors bg-gray-50 placeholder:text-gray-400"
                      />
                      <div className="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto pr-1">
                        {STATES.filter(s => getStateName(s).toLowerCase().includes(stateQ.toLowerCase()) || s.toLowerCase().includes(stateQ.toLowerCase())).map(s => (
                          <button
                            key={s}
                            onClick={() => setAnswers(p => ({ ...p, [q.id]: s }))}
                            className={`px-3 py-2.5 rounded-xl text-sm font-bold text-left transition-all
                              ${answers[q.id] === s
                                ? 'bg-[#3B82F6] text-white shadow-sm'
                                : 'bg-gray-50 text-gray-600 hover:bg-blue-50 border border-gray-100'}`}
                          >
                            {getStateName(s)}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Nav buttons */}
              <div className="flex gap-3 mt-6">
                {step > 0 && (
                  <button onClick={back}
                    className="flex items-center gap-2 px-6 py-3 rounded-2xl border-2 border-gray-200 text-gray-600 font-bold hover:border-gray-300 hover:bg-gray-50 transition-all">
                    <ArrowLeft className="w-4 h-4" /> {t.back}
                  </button>
                )}
                <button
                  onClick={next}
                  disabled={!canNext()}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl text-white font-bold transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
                  style={{ background: 'linear-gradient(135deg,#2563EB,#3B82F6)' }}
                >
                  {step === TOTAL - 1 ? (
                    <><Sparkles className="w-4 h-4" /> {t.findMySchemes}</>
                  ) : (
                    <>{t.next} <ArrowRight className="w-4 h-4" /></>
                  )}
                </button>
              </div>

              {/* Skip */}
              <button onClick={next}
                className="w-full mt-3 text-center text-xs text-gray-400 hover:text-gray-500 font-medium py-2 transition-colors">
                {t.skip}
              </button>
            </>
          ) : (
            /* ── RESULTS SCREEN ── */
            <div className="text-center">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#3B82F6] to-[#60A5FA] flex items-center justify-center mx-auto mb-6 shadow-lg shadow-blue-200">
                <Sparkles className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-3xl font-extrabold text-gray-900 mb-2 tracking-tight">{t.profileReady}</h2>
              <p className="text-gray-500 font-medium mb-8 max-w-sm mx-auto">
                {t.profileSub}
              </p>

              {/* Summary chips */}
              <div className="flex flex-wrap gap-2 justify-center mb-8">
                {answers.gender && <Chip>{getOptLabel('gender', answers.gender)}</Chip>}
                {answers.age && <Chip>{answers.age} {t.ageSuffix}</Chip>}
                {answers.state && <Chip>{answers.state}</Chip>}
                {answers.occupation && <Chip>{getOptLabel('occupation', answers.occupation)}</Chip>}
                {answers.caste && <Chip>{getOptLabel('caste', answers.caste)}</Chip>}
              </div>

              <div className="flex flex-col gap-4">
                <button
                  onClick={browseCat}
                  className="w-full flex items-center justify-center gap-3 px-6 py-4 rounded-2xl text-white font-bold text-lg shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all"
                  style={{ background: 'linear-gradient(135deg,#2563EB,#3B82F6)' }}
                >
                  <Search className="w-5 h-5" /> {t.browse}
                </button>
                <button
                  onClick={() => router.push(`/chat?msg=${buildChatMsg()}`)}
                  className="w-full flex items-center justify-center gap-3 px-6 py-4 rounded-2xl border-2 border-[#3B82F6]/30 text-[#2563EB] font-bold text-base bg-blue-50 hover:bg-blue-100 transition-all"
                >
                  <Sparkles className="w-5 h-5" /> {t.askAI}
                </button>
                <button
                  onClick={() => { setStep(0); setAnswers({}); setDone(false); }}
                  className="flex items-center justify-center gap-2 text-gray-400 text-sm font-medium hover:text-gray-500 transition-colors mt-1"
                >
                  <RefreshCw className="w-4 h-4" /> {t.startOver}
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer lang={lang} />
    </div>
  );
}

function Chip({ children }) {
  if (!children) return null;
  return (
    <span className="inline-flex items-center px-3 py-1.5 rounded-full bg-blue-50 text-[#2563EB] text-xs font-bold border border-blue-100">
      {children}
    </span>
  );
}
