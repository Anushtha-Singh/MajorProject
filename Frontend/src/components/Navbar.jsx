// src/components/Navbar.jsx
import { useState, useRef, useEffect } from "react";
import {
  Search,
  ChevronDown,
  ChevronRight,
  Globe,
  LogIn,
  Star,
  Sparkles,
  ArrowUpRight,
} from "lucide-react";

export default function Navbar({ lang = "en", setLang = () => {} }) {
  const [langOpen, setLangOpen] = useState(false);
  const langRef = useRef(null);

  // Minimal i18n
  const t = {
    en: {
      brand: "Yojna Saathi",
      signIn: "Sign In",
      language: "English",
      searchPlaceholder: "Search schemes…",
      search: "Search",
    },
    hi: {
      brand: "योजना साथी",
      signIn: "साइन इन",
      language: "हिंदी",
      searchPlaceholder: "योजनाएँ खोजें…",
      search: "खोजें",
    },
  }[lang];

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

  return (
    <header className="bg-white/90 backdrop-blur sticky top-0 z-40 border-b">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-4">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-[#0271BC]" />
          <span className="text-xl md:text-2xl font-bold text-[#0271BC]">
            {t.brand}
          </span>
        </div>

        {/* Desktop Search */}
        <div className="flex-1 hidden md:flex">
          <form
            className="w-full max-w-xl ml-6 flex items-center rounded-full bg-gray-100 px-3 py-2"
            onSubmit={(e) => e.preventDefault()}
          >
            <Search className="w-5 h-5 text-gray-500" />
            <input
              placeholder={t.searchPlaceholder}
              className="bg-transparent px-3 py-1 outline-none w-full"
            />
            <button
              type="submit"
              className="ml-2 rounded-full bg-[#0271BC] text-white text-sm px-4 py-1.5"
            >
              {t.search}
            </button>
          </form>
        </div>

        {/* Actions */}
        <div className="ml-auto flex items-center gap-2">
          {/* Sign In */}
          <button className="hidden sm:inline-flex items-center gap-2 rounded-full bg-[#0271BC] text-white text-sm px-4 py-2">
            <LogIn className="w-4 h-4" />
            {t.signIn}
            <ArrowUpRight className="w-4 h-4" />
          </button>

          {/* Language Switcher */}
          <div className="relative" ref={langRef}>
            <button
              className="inline-flex items-center gap-2 rounded-full bg-gray-100 px-3 py-2"
              onClick={() => setLangOpen((v) => !v)}
              aria-haspopup="listbox"
              aria-expanded={langOpen}
            >
              <Globe className="w-4 h-4" />
              <span className="text-sm">{t.language}</span>
              <ChevronDown className="w-4 h-4" />
            </button>
            {langOpen && (
              <div
                className="absolute right-0 mt-2 w-36 bg-white border rounded-xl shadow-sm overflow-hidden"
                role="listbox"
              >
                {[
                  { key: "en", label: "English" },
                  { key: "hi", label: "हिंदी" },
                ].map((opt) => (
                  <button
                    key={opt.key}
                    className={[
                      "w-full text-left px-3 py-2 text-sm hover:bg-gray-50",
                      lang === opt.key ? "text-[#0271BC]" : "",
                    ].join(" ")}
                    onClick={() => {
                      setLang(opt.key);
                      setLangOpen(false);
                    }}
                    role="option"
                    aria-selected={lang === opt.key}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Saved */}
          <button className="hidden sm:inline-flex items-center gap-2 rounded-full bg-gray-100 px-3 py-2">
            <Star className="w-4 h-4" />
            <span className="text-sm">Saved</span>
          </button>
        </div>
      </div>

      {/* Mobile Search */}
      <div className="px-4 pb-3 md:hidden">
        <form
          className="flex items-center rounded-full bg-gray-100 px-3 py-2"
          onSubmit={(e) => e.preventDefault()}
        >
          <Search className="w-5 h-5 text-gray-500" />
          <input
            placeholder={t.searchPlaceholder}
            className="bg-transparent px-3 py-1 outline-none w-full"
          />
          <button
            type="submit"
            className="ml-2 rounded-full bg-[#0271BC] text-white text-sm px-4 py-1.5"
          >
            {t.search}
          </button>
        </form>
      </div>
    </header>
  );
}