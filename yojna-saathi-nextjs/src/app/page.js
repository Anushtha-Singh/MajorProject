'use client';

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import YojnaSaathi from "@/components/YojnaSaathi";
import PWAInstallPrompt from "@/components/PWAInstallPrompt";
import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search, HelpCircle, ChevronDown, ArrowRight,
  Sparkles, CheckCircle2, Shield, Landmark, Users, FileText
} from "lucide-react";
import translations from "@/lib/translations";
import { CATEGORIES } from "@/data/categoryData";

export default function Home() {
  const [lang, setLang] = useState("en");
  const [openFaq, setOpenFaq] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const saved = localStorage.getItem('yojna_lang');
    if (saved) setLang(saved);
  }, []);

  const t = useMemo(() => {
    return translations[lang]?.home || translations['en'].home;
  }, [lang]);

  const stats = [
    { v: "5400+", l: t.stat1, icon: <Shield className="w-5 h-5 md:w-6 md:h-6" />, c: "text-[#0271BC]", bg: "bg-blue-50" },
    { v: "0", l: t.stat2, icon: <Landmark className="w-5 h-5 md:w-6 md:h-6" />, c: "text-emerald-600", bg: "bg-emerald-50" },
    { v: "5400+", l: t.stat3, icon: <Users className="w-5 h-5 md:w-6 md:h-6" />, c: "text-amber-600", bg: "bg-amber-50" },
  ];

  const cats = CATEGORIES.map(c => ({
    n: c.names[lang] || c.names.en,
    c: c.count,
    i: c.icon,
    s: c.subs[lang] || c.subs.en,
    k: c.key,
  }));

  const faqs = [
    { q: lang === 'en' ? "What is Yojna Saathi?" : "योजना साथी क्या है?", a: lang === 'en' ? "A free AI platform to help every Indian find eligible government schemes in their own language." : "एक मुफ्त AI मंच जो हर भारतीय को पात्र सरकारी योजनाएं खोजने में मदद करता है।" },
    { q: lang === 'en' ? "Can I apply directly?" : "क्या मैं सीधे आवेदन कर सकता हूँ?", a: lang === 'en' ? "We guide you step-by-step to official government portals where you can apply." : "हम आपको आधिकारिक पोर्टल पर मार्गदर्शन करते हैं।" },
    { q: lang === 'en' ? "Which languages are supported?" : "कौन सी भाषाएं हैं?", a: lang === 'en' ? "Hindi, English, Tamil, Telugu, Bengali, Gujarati, Punjabi, Kannada, Malayalam, Odia, and Marathi." : "हिंदी, अंग्रेजी, तमिल, तेलुगु, बंगाली, गुजराती, पंजाबी, कन्नड़, मलयालम, ओड़िया, मराठी।" },
    { q: lang === 'en' ? "Is my data safe?" : "क्या डेटा सुरक्षित है?", a: lang === 'en' ? "We don't store personal data. Conversations are processed securely." : "हम व्यक्तिगत डेटा नहीं रखते।" },
  ];

  const steps = [
    { title: t.s1, desc: t.s1d, icon: <FileText className="w-5 h-5 md:w-6 md:h-6" /> },
    { title: t.s2, desc: t.s2d, icon: <Search className="w-5 h-5 md:w-6 md:h-6" /> },
    { title: t.s3, desc: t.s3d, icon: <CheckCircle2 className="w-5 h-5 md:w-6 md:h-6" /> },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar lang={lang} setLang={setLang} />

      <main className="flex-1 bg-white relative overflow-hidden">
        {/* Blurry blue ambient blobs */}
        <div className="pointer-events-none select-none absolute inset-0 z-0 overflow-hidden">
          <div className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full bg-[#3B82F6]/15 blur-[100px]" />
          <div className="absolute top-[30%] -right-40 w-[420px] h-[420px] rounded-full bg-[#60A5FA]/12 blur-[120px]" />
          <div className="absolute bottom-[10%] left-[20%] w-[380px] h-[380px] rounded-full bg-[#93C5FD]/10 blur-[100px]" />
        </div>
        {/* ── HERO ── */}
        <section className="relative w-full px-4 sm:px-6 lg:px-8 pt-12 pb-32 md:pt-16 md:pb-48 min-h-[75vh] flex flex-col justify-start overflow-hidden">
          {/* Full Background Image */}
          <div className="absolute inset-0 z-0">
            <img src="/banner5.png" alt="Hero Background" fetchPriority="high" className="w-full h-full object-cover object-bottom" />
          </div>

          <div className="relative z-10 text-center max-w-4xl mx-auto animate-fade-in-up">
            <span className="inline-flex items-center gap-1.5 px-5 py-2 rounded-full bg-white/90 backdrop-blur-xl text-sm font-bold text-[#0271BC] mb-8 shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-white/50 hover:scale-105 transition-transform cursor-pointer animate-float">
              <Sparkles className="w-4 h-4 text-[#0271BC]" />{t.badge}
            </span>
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold tracking-tighter text-[#111827] leading-[1.15] drop-shadow-md">
              {t.h1a}{' '}
              <span className="text-[#0271BC]">{t.h1b}</span>
            </h1>
            <p className="mt-6 text-base sm:text-lg md:text-xl text-gray-800 max-w-2xl mx-auto font-medium leading-relaxed font-semibold drop-shadow-sm">
              {t.desc}
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 px-4 sm:px-0">
              {/* Primary CTA: Find Schemes for You */}
              <Link href="/find-schemes"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#0271BC] text-white px-8 py-3.5 rounded-full font-bold shadow-md hover:shadow-xl hover:-translate-y-0.5 transition-all text-[15px] group">
                <Sparkles className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                {({
                  en: "Find Schemes For You", hi: "अपने लिए योजनाएं खोजें", ta: "உங்களுக்கான திட்டங்கள்", te: "మీ కోసం పథకాలు",
                  bn: "আপনার জন্য প্রকল্প খুঁজুন", gu: "તમારા માટે યોજનાઓ શોધો", mr: "तुमच्यासाठी योजना शोधा", pa: "ਆਪਣੇ ਲਈ ਸਕੀਮਾਂ ਲੱਭੋ",
                  kn: "ನಿಮಗಾಗಿ ಯೋಜನೆಗಳನ್ನು ಹುಡುಕಿ", ml: "നിങ്ങൾക്കുള്ള പദ്ധതികൾ കണ്ടെത്തുക", or: "ଆପଣଙ୍କ ପାଇଁ ଯୋଜନା ଖୋଜନ୍ତୁ", ur: "اپنے لیے اسکیمیں تلاش کریں"
                })[lang] || "Find Schemes For You"}
              </Link>
              <Link href="/schemes"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white/60 backdrop-blur-md text-[#0271BC] border border-white px-8 py-3.5 rounded-full font-bold shadow-sm hover:bg-white/80 transition-all text-[15px]">
                {t.cta1}<ArrowRight className="w-4 h-4" />
              </Link>
              <button onClick={() => router.push('/chat')}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white/60 backdrop-blur-md text-[#0271BC] border border-white px-8 py-3.5 rounded-full font-bold shadow-sm hover:bg-white/80 transition-all text-[15px]">
                <HelpCircle className="w-4 h-4" />{t.cta2}
              </button>
            </div>
          </div>
        </section>

        {/* ── STATS ── */}
        <section className="px-4 sm:px-6 lg:px-8 pt-16 pb-16 max-w-6xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
            {stats.map((s, i) => (
              <div key={i} className="flex items-center gap-4 md:gap-5 p-5 md:p-6 rounded-2xl glass border border-white/50 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-[150%] group-hover:animate-[shimmer_1.5s_infinite] skew-x-12"></div>
                <div className={`w-12 h-12 md:w-14 md:h-14 rounded-xl flex items-center justify-center shrink-0 ${s.bg} ${s.c}`}>
                  {s.icon}
                </div>
                <div>
                  <div className={`text-2xl md:text-3xl font-extrabold tracking-tight ${s.c}`}>{s.v}</div>
                  <div className="text-sm font-semibold text-gray-500 mt-0.5">{s.l}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── CATEGORIES ── */}
        <section className="px-4 sm:px-6 lg:px-8 pb-16 md:pb-24 max-w-6xl mx-auto">
          <div className="text-center mb-10 md:mb-12">
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">{t.catTitle}</h2>
            <p className="text-gray-500 mt-3 font-medium">{t.catSub}</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
            {cats.map((c, i) => (
              <Link key={i} href={`/schemes?cat=${c.k}`} className="p-5 rounded-2xl glass border border-white/50 cursor-pointer shadow-sm hover:shadow-[0_8px_30px_rgba(2,113,188,0.15)] hover:-translate-y-1 hover:border-[#0271BC]/30 transition-all duration-300 group block relative overflow-hidden">
                <span className="text-3xl md:text-4xl block mb-3 md:mb-4 group-hover:scale-110 origin-left transition-transform duration-300">{c.i}</span>
                <div className="text-base font-bold text-gray-900">{c.n}</div>
                <div className="text-xs text-gray-400 font-medium mt-1">{c.s}</div>
                <div className="text-xs font-bold text-[#0271BC] mt-4 flex items-center gap-1">
                  {c.c} {translations[lang]?.schemes?.found?.split(' ')[0] || 'Schemes'} <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* ── HOW IT WORKS ── */}
        <section className="px-4 sm:px-6 lg:px-8 pb-16 md:pb-24 max-w-6xl mx-auto">
          <div className="rounded-[2.5rem] p-6 md:p-12 lg:p-16 glass border border-white/60 shadow-xl relative overflow-hidden">
            {/* Background glowing blob */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#1E90FF]/20 rounded-full blur-[80px] animate-glow mix-blend-multiply"></div>
            <div className="text-center mb-10 md:mb-14">
              <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">{t.howTitle}</h2>
              <p className="text-gray-500 mt-3 font-medium">{t.howSub}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8 relative">
              {/* Connector line for desktop */}
              <div className="hidden md:block absolute top-[44px] left-[16%] right-[16%] h-0.5 bg-gray-200" />

              {steps.map((s, i) => (
                <div key={i} className="text-center relative z-10">
                  <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-br from-[#0271BC] to-[#1e40af] text-white flex items-center justify-center mx-auto mb-4 text-sm font-bold shadow-lg ring-4 ring-white/50">{i + 1}</div>
                  <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-white text-[#0271BC] flex items-center justify-center mx-auto mb-4 shadow-md border border-gray-100 group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-300">{s.icon}</div>
                  <div className="text-lg font-bold text-gray-900">{s.title}</div>
                  <div className="text-sm text-gray-500 mt-2 max-w-[250px] mx-auto font-medium leading-relaxed">{s.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── FAQ ── */}
        <section className="px-4 sm:px-6 lg:px-8 pb-16 md:pb-24 max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">{t.faqTitle}</h2>
          </div>
          <div className="max-w-3xl mx-auto space-y-3">
            {faqs.map((f, i) => (
              <div key={i} className="rounded-2xl glass border border-white/50 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 hover:border-[#0271BC]/20">
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full text-left px-5 md:px-6 py-4 md:py-5 flex items-center justify-between gap-4 text-[15px] font-bold text-gray-900 focus:outline-none">
                  <span>{f.q}</span>
                  <ChevronDown className={`w-5 h-5 text-gray-400 shrink-0 transition-transform duration-300 ${openFaq === i ? 'rotate-180 text-[#0271BC]' : ''}`} />
                </button>
                <div className={`overflow-hidden transition-all duration-300 ease-in-out ${openFaq === i ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}`}>
                  <div className="px-5 md:px-6 pb-5 text-sm md:text-[15px] text-gray-500 font-medium leading-relaxed border-t border-black/5 pt-4">
                    {f.a}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="px-4 sm:px-6 lg:px-8 pb-12 md:pb-16 max-w-6xl mx-auto">
          <div className="rounded-[2rem] p-8 md:p-14 lg:p-20 text-center text-white bg-gradient-to-br from-[#3B82F6] via-[#2563EB] to-[#1D4ED8] relative overflow-hidden shadow-xl">
            {/* Pattern overlay */}
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")" }} />

            <div className="relative z-10 max-w-2xl mx-auto">
              <h3 className="text-2xl md:text-3xl lg:text-4xl font-extrabold tracking-tight">{t.ctaT}</h3>
              <p className="mt-4 text-white/90 text-sm md:text-base font-medium leading-relaxed">{t.ctaD}</p>
              <button onClick={() => router.push('/chat')}
                className="mt-8 inline-flex items-center gap-2 bg-white text-[#2563EB] px-8 py-3.5 rounded-full text-[15px] font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all">
                <HelpCircle className="w-5 h-5" />{t.ctaBtn}
              </button>
            </div>
          </div>
        </section>
      </main>

      <Footer lang={lang} />
      <YojnaSaathi />
      <PWAInstallPrompt />
    </div>
  );
}
