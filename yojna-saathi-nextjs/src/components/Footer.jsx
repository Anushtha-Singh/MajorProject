'use client';

import Link from "next/link";
import { Sparkles, Heart } from "lucide-react";

export default function Footer({ lang = "en" }) {
  const t = {
    en: { brand: "Yojna Saathi", tagline: "Empowering every citizen with accessible government scheme assistance.", privacy: "Privacy", terms: "Terms", support: "Support", home: "Home", schemes: "Schemes", chat: "Chat" },
    hi: { brand: "योजना साथी", tagline: "हर नागरिक को सुलभ सरकारी योजना सहायता से सशक्त बनाना।", privacy: "गोपनीयता", terms: "शर्तें", support: "सहायता", home: "होम", schemes: "योजनाएँ", chat: "चैट" },
  }[lang];

  return (
    <footer className="bg-white/60 border-t border-black/5 mt-auto">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 pb-12 border-b border-black/5">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#0271BC] to-[#1E90FF] flex items-center justify-center shadow-sm">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="text-xl font-extrabold gradient-text tracking-tight">{t.brand}</span>
            </div>
            <p className="text-sm text-gray-500 leading-relaxed max-w-sm">{t.tagline}</p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-5">{lang === 'en' ? 'Navigation' : 'नेविगेशन'}</h4>
            <div className="space-y-3">
              <Link href="/" className="block text-sm text-gray-600 hover:text-[#0271BC] font-medium transition-colors">{t.home}</Link>
              <Link href="/schemes" className="block text-sm text-gray-600 hover:text-[#0271BC] font-medium transition-colors">{t.schemes}</Link>
              <Link href="/chat" className="block text-sm text-gray-600 hover:text-[#0271BC] font-medium transition-colors">{t.chat}</Link>
            </div>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-5">{lang === 'en' ? 'Legal' : 'कानूनी'}</h4>
            <div className="space-y-3">
              <a href="#" className="block text-sm text-gray-600 hover:text-[#0271BC] font-medium transition-colors">{t.privacy}</a>
              <a href="#" className="block text-sm text-gray-600 hover:text-[#0271BC] font-medium transition-colors">{t.terms}</a>
              <a href="#" className="block text-sm text-gray-600 hover:text-[#0271BC] font-medium transition-colors">{t.support}</a>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-sm text-gray-400 font-medium text-center sm:text-left">
            © {new Date().getFullYear()} {t.brand}. All rights reserved.
          </span>
          <span className="flex items-center gap-1.5 text-sm text-gray-400 font-medium">
            Made with <Heart className="w-4 h-4 text-red-500 fill-red-500" /> in India 🇮🇳
          </span>
        </div>
      </div>
    </footer>
  );
}
