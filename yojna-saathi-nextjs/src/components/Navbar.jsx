'use client';

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Globe, ChevronDown, Menu, X } from "lucide-react";
import Image from "next/image";
import translations from "@/lib/translations";

const LANGUAGES = [
  { k: 'en', l: 'English',    short: 'EN' },
  { k: 'hi', l: 'हिंदी',      short: 'HI' },
  { k: 'bn', l: 'বাংলা',      short: 'BN' },
  { k: 'ta', l: 'தமிழ்',      short: 'TA' },
  { k: 'te', l: 'తెలుగు',     short: 'TE' },
  { k: 'mr', l: 'मराठी',      short: 'MR' },
  { k: 'gu', l: 'ગુજરાતી',    short: 'GU' },
  { k: 'kn', l: 'ಕನ್ನಡ',      short: 'KN' },
  { k: 'ml', l: 'മലയാളം',    short: 'ML' },
  { k: 'pa', l: 'ਪੰਜਾਬੀ',     short: 'PA' },
  { k: 'ur', l: 'اردو',       short: 'UR' },
];

const TRANSLATED_LANGS = ['hi', 'bn', 'ta', 'te', 'mr', 'gu', 'kn', 'ml', 'pa', 'ur'];

export default function Navbar({ lang: langProp, setLang: setLangProp }) {
  const [internalLang, setInternalLang] = useState("en");
  const [langOpen, setLangOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const langRef = useRef(null);
  const pathname = usePathname();

  // Read from localStorage on mount — single source of truth
  useEffect(() => {
    const saved = typeof window !== 'undefined' ? localStorage.getItem('yojna_lang') : null;
    const resolved = saved || 'en';
    setInternalLang(resolved);
    if (setLangProp) setLangProp(resolved);
  }, []);

  // The actual lang to use: prop (from parent) or internal
  const lang = langProp ?? internalLang;

  const handleLangChange = (k) => {
    if (typeof window !== 'undefined') localStorage.setItem('yojna_lang', k);
    setInternalLang(k);
    if (setLangProp) setLangProp(k);
    setLangOpen(false);
  };

  const t = translations[lang]?.navbar || translations['en'].navbar;

  const links = [
    { href: "/", label: t.home },
    { href: "/schemes", label: t.schemes },
    { href: "/chat", label: t.chat },
  ];

  useEffect(() => {
    const h = (e) => {
      if (langRef.current && !langRef.current.contains(e.target)) setLangOpen(false);
      if (e.key === "Escape") { setLangOpen(false); setMobileOpen(false); }
    };
    document.addEventListener("mousedown", h);
    document.addEventListener("keydown", h);
    return () => { document.removeEventListener("mousedown", h); document.removeEventListener("keydown", h); };
  }, []);

  useEffect(() => { setMobileOpen(false); }, [pathname]);

  const currentLangLabel = LANGUAGES.find(l => l.k === lang)?.short || 'EN';

  return (
    <header className="sticky top-0 z-50 bg-white/70 backdrop-blur-xl border-b border-white/50 shadow-[0_4px_30px_rgba(0,0,0,0.03)] transition-all duration-300">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 md:gap-3 shrink-0 group">
          <Image
            src="/logo.png"
            alt="Yojna Saathi Logo"
            width={56}
            height={56}
            priority={true}
            className="object-contain group-hover:scale-105 transition-all duration-300"
          />
          <span className="text-lg md:text-xl font-extrabold gradient-text tracking-tight">
            {t.brand}
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2">
          {links.map(l => (
            <Link key={l.href} href={l.href}
              className={`px-3 lg:px-4 py-2 rounded-xl text-sm font-bold transition-all duration-300 hover:-translate-y-0.5
                ${pathname === l.href
                  ? "text-[#3B82F6] bg-blue-50 shadow-sm ring-1 ring-blue-100"
                  : "text-gray-600 hover:text-[#3B82F6] hover:bg-blue-50/50"}`}>
              {l.label}
            </Link>
          ))}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Language Switcher */}
          <div ref={langRef} className="relative">
            <button onClick={() => setLangOpen(!langOpen)}
              className="flex items-center gap-1.5 px-2.5 py-2 rounded-xl text-sm font-bold text-gray-600 hover:text-[#3B82F6] hover:bg-blue-50/50 transition-all duration-300 hover:-translate-y-0.5">
              <Globe className="w-4 h-4 text-[#3B82F6]" />
              <span className="hidden xs:inline-block">{currentLangLabel}</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${langOpen ? 'rotate-180' : ''}`} />
            </button>

            {langOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white rounded-2xl shadow-xl shadow-black/5 border border-black/5 overflow-hidden z-50">
                {LANGUAGES.map(o => (
                  <button key={o.k} onClick={() => handleLangChange(o.k)}
                    className={`w-full text-left px-4 py-3 text-sm transition-colors flex items-center justify-between gap-2
                      ${lang === o.k ? 'bg-blue-50 text-[#3B82F6] font-bold' : 'bg-white text-gray-700 hover:bg-gray-50 font-medium'}`}>
                    <span>{o.l}</span>
                    {!TRANSLATED_LANGS.includes(o.k) && o.k !== 'en' && (
                      <span className="text-[10px] text-gray-400 font-normal">soon</span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Desktop CTA */}
          <Link href="/schemes"
            className="hidden sm:flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-[#3B82F6] to-[#60A5FA] text-white text-sm font-bold shadow-[0_4px_14px_rgba(59,130,246,0.39)] hover:shadow-[0_6px_20px_rgba(59,130,246,0.5)] hover:-translate-y-1 transition-all duration-300">
            {t.cta}
          </Link>

          {/* Mobile Toggle */}
          <button onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-xl text-gray-600 hover:bg-gray-100 transition-colors">
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-xl border-t border-black/5 px-4 py-4 space-y-2 shadow-xl absolute w-full left-0">
          {links.map(l => (
            <Link key={l.href} href={l.href}
              className={`block px-4 py-3.5 rounded-2xl text-base font-semibold transition-colors
                ${pathname === l.href ? "text-[#3B82F6] bg-blue-50" : "text-gray-700 hover:bg-gray-50"}`}>
              {l.label}
            </Link>
          ))}
          <Link href="/schemes"
            className="flex items-center justify-center gap-2 mt-4 px-4 py-3.5 rounded-2xl bg-gradient-to-r from-[#3B82F6] to-[#60A5FA] text-white text-base font-bold shadow-md">
            {t.cta}
          </Link>
        </div>
      )}
    </header>
  );
}
