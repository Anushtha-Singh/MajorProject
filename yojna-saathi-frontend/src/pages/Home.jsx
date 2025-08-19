// src/pages/HomePage.jsx
import Navbar from "../components/Navbar";
import { useState, useRef, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { 
  Globe, 
  Search, 
  BookOpen, 
  Users, 
  HelpCircle, 
  ChevronDown,
  ChevronRight,
  ArrowUpRight,
  LogIn,
  Star,
  Sparkles,
  Check,
  Filter,
  Tag
} from "lucide-react";

export default function Home() {
  const [lang, setLang] = useState("en"); // 'en' | 'hi'
  const [langOpen, setLangOpen] = useState(false);
  const langRef = useRef(null);

  // Minimal i18n
  const t = useMemo(() => {
    const copy = {
      en: {
        brand: "Yojna Saathi",
        signIn: "Sign In",
        language: "English",
        searchPlaceholder: "Search schemes…",
        searchHint: 'For an exact match, put words in quotes — e.g. "Scholarship".',
        chatbot: "Chat with Saathi",
        search: "Search",
      },
      hi: {
        brand: "योजना साथी",
        signIn: "साइन इन",
        language: "हिंदी",
        searchPlaceholder: "योजनाएँ खोजें…",
        searchHint: 'सटीक परिणाम हेतु शब्दों को उद्धरण में लिखें — जैसे "स्कॉलरशिप".',
        chatbot: "साथी से चैट करें",
        search: "खोजें",
      },
    };
    return copy[lang];
  }, [lang]);

  // Click away handler for language dropdown
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (langRef.current && !langRef.current.contains(e.target)) {
        setLangOpen(false);
      }
    };
    const handleEsc = (e) => {
      if (e.key === "Escape") setLangOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEsc);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEsc);
    };
  }, []);

  const PrettyTag = ({ children }) => (
    <span className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-100">
      <Tag className="w-3 h-3" />
      {children}
    </span>
  );

  return (
    <div className="min-h-screen bg-[#faf7f2] text-gray-900">
      {/* NAVBAR */}
      <Navbar/>

      {/* HERO SECTION */}
      <section className="max-w-7xl mx-auto px-4 py-12 md:py-16">
        <div className="bg-white rounded-2xl p-8 md:p-12 shadow-sm border">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-bold text-[#0271BC]">
              {lang === 'en' ? 'Empowering Citizens with Government Schemes' : 'सरकारी योजनाओं के साथ नागरिकों को सशक्त बनाना'}
            </h1>
            <p className="mt-4 text-gray-700">
              {lang === 'en' 
                ? 'Discover, understand, and apply for government schemes in your own language.'
                : 'अपनी भाषा में सरकारी योजनाओं को खोजें, समझें और आवेदन करें।'}
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link
                to="/Schemes"
                className="inline-flex items-center gap-2 rounded-full bg-[#0271BC] text-white px-6 py-3 font-medium"
              >
                {lang === 'en' ? 'Browse Schemes' : 'योजनाएँ देखें'}
                <ArrowUpRight className="w-4 h-4" />
              </Link>
              <button className="inline-flex items-center gap-2 rounded-full bg-[#1E90FF] text-white px-6 py-3 font-medium">
                <HelpCircle className="w-4 h-4" />
                {t.chatbot}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* STATS SECTION */}
      <section className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { 
              value: "3500+", 
              label: lang === 'en' ? "Total Schemes" : "कुल योजनाएँ",
              bg: "bg-blue-50",
              border: "border-blue-100"
            },
            { 
              value: "1200+", 
              label: lang === 'en' ? "Central Schemes" : "केंद्रीय योजनाएँ",
              bg: "bg-green-50",
              border: "border-green-100"
            },
            { 
              value: "2300+", 
              label: lang === 'en' ? "State Schemes" : "राज्य योजनाएँ",
              bg: "bg-orange-50",
              border: "border-orange-100"
            },
          ].map((stat, idx) => (
            <div 
              key={idx} 
              className={`${stat.bg} ${stat.border} border rounded-2xl p-6 text-center`}
            >
              <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
              <p className="text-gray-600 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CATEGORIES SECTION */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold text-[#0271BC]">
            {lang === 'en' ? 'Explore by Category' : 'श्रेणी के अनुसार खोजें'}
          </h2>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {[
            { name: "Agriculture", count: 611, icon: "🌾" },
            { name: "Banking & Insurance", count: 273, icon: "🏦" },
            { name: "Business", count: 585, icon: "💼" },
            { name: "Education", count: 937, icon: "📚" },
            { name: "Health", count: 219, icon: "🏥" },
            { name: "Housing", count: 100, icon: "🏠" },
            { name: "Science & IT", count: 71, icon: "💻" },
            { name: "Skills & Employment", count: 313, icon: "🔧" },
          ].map((cat, idx) => (
            <div
              key={idx}
              className="bg-white rounded-xl border p-5 hover:shadow-md transition-all"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{cat.icon}</span>
                <div>
                  <h3 className="font-medium">{cat.name}</h3>
                  <p className="text-sm text-gray-500">{cat.count} {lang === 'en' ? 'Schemes' : 'योजनाएँ'}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="max-w-7xl mx-auto px-4 py-12 bg-white border-y">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold text-[#0271BC]">
            {lang === 'en' ? 'How Yojna Saathi Works' : 'योजना साथी कैसे काम करता है'}
          </h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { 
              title: lang === 'en' ? "Fill Details" : "विवरण भरें", 
              desc: lang === 'en' ? "Start with your basic details." : "अपने बुनियादी विवरणों के साथ शुरू करें।",
              icon: <BookOpen className="w-8 h-8 text-[#0271BC] mx-auto" />
            },
            { 
              title: lang === 'en' ? "Discover Schemes" : "योजनाएँ खोजें", 
              desc: lang === 'en' ? "Find matches instantly." : "तुरंत मिलान ढूंढें।",
              icon: <Search className="w-8 h-8 text-[#0271BC] mx-auto" />
            },
            { 
              title: lang === 'en' ? "Apply Easily" : "आसानी से आवेदन करें", 
              desc: lang === 'en' ? "Connect to official portals." : "आधिकारिक पोर्टल से जुड़ें।",
              icon: <Check className="w-8 h-8 text-[#0271BC] mx-auto" />
            },
          ].map((step, idx) => (
            <div
              key={idx}
              className="bg-[#faf7f2] rounded-xl p-6 text-center"
            >
              {step.icon}
              <h3 className="font-semibold mt-3">{step.title}</h3>
              <p className="text-sm text-gray-600 mt-1">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold text-[#0271BC]">
            {lang === 'en' ? 'Frequently Asked Questions' : 'अक्सर पूछे जाने वाले प्रश्न'}
          </h2>
        </div>
        
        <div className="max-w-3xl mx-auto space-y-3">
          {[
            lang === 'en' ? "What is Yojna Saathi?" : "योजना साथी क्या है?",
            lang === 'en' ? "How can Yojna Saathi help me?" : "योजना साथी मेरी कैसे मदद कर सकता है?",
            lang === 'en' ? "Can I apply directly through Yojna Saathi?" : "क्या मैं सीधे योजना साथी के माध्यम से आवेदन कर सकता हूँ?",
            lang === 'en' ? "How does it suggest schemes?" : "यह योजनाओं का सुझाव कैसे देता है?",
            lang === 'en' ? "What details do I need to provide?" : "मुझे कौन से विवरण प्रदान करने की आवश्यकता है?",
          ].map((q, idx) => (
            <div
              key={idx}
              className="bg-white border rounded-xl p-4 flex items-center justify-between hover:shadow-sm transition"
            >
              <p className="font-medium">{q}</p>
              <ChevronRight className="w-5 h-5 text-gray-500" />
            </div>
          ))}
          
          <button className="mt-6 mx-auto block text-[#0271BC] font-medium">
            {lang === 'en' ? 'View more questions' : 'और प्रश्न देखें'} →
          </button>
        </div>
      </section>

      {/* CHATBOT CTA */}
      <section className="max-w-7xl mx-auto px-4 py-8">
        <div className="rounded-2xl p-6 md:p-8 bg-[#1E90FF] text-white">
          <div className="max-w-2xl mx-auto text-center">
            <h3 className="text-xl font-bold">
              {lang === 'en' 
                ? 'Need help finding the right scheme?' 
                : 'सही योजना खोजने में सहायता चाहिए?'}
            </h3>
            <p className="mt-2 opacity-90">
              {lang === 'en' 
                ? 'Our multilingual assistant can guide you in your preferred language.'
                : 'हमारा बहुभाषी सहायक आपकी पसंदीदा भाषा में आपका मार्गदर्शन कर सकता है।'}
            </p>
            <button className="mt-4 inline-flex items-center gap-2 rounded-full bg-white text-[#1E90FF] px-6 py-2 font-medium">
              <HelpCircle className="w-4 h-4" />
              {t.chatbot}
            </button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t bg-white">
        <div className="max-w-7xl mx-auto px-4 py-6 text-sm flex flex-col md:flex-row items-center justify-between gap-2">
          <p className="text-gray-600">
            © {new Date().getFullYear()} {t.brand}. {lang === 'en' 
              ? 'Made for citizens—multilingual and accessible.' 
              : 'नागरिकों के लिए बनाया गया - बहुभाषी और सुलभ।'}
          </p>
          <div className="flex items-center gap-3 text-gray-600">
            <a className="hover:text-[#0271BC]" href="#">
              {lang === 'en' ? 'Privacy' : 'गोपनीयता'}
            </a>
            <a className="hover:text-[#0271BC]" href="#">
              {lang === 'en' ? 'Terms' : 'शर्तें'}
            </a>
            <a className="hover:text-[#0271BC]" href="#">
              {lang === 'en' ? 'Support' : 'सहायता'}
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

