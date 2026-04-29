'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import YojnaSaathi from '@/components/YojnaSaathi';
import Navbar from '@/components/Navbar';
import { Bot, Globe, Zap, Sparkles } from 'lucide-react';
import translations from "@/lib/translations";

export default function ChatPage() {
  const router = useRouter();
  const [lang, setLang] = useState("en");

  useEffect(() => {
    const saved = localStorage.getItem('yojna_lang');
    if (saved) setLang(saved);
  }, []);

  const t = translations[lang]?.chat || translations['en'].chat;

  const features = [
    { icon: <Globe className="w-5 h-5" />, t: t.f1t, d: t.f1d },
    { icon: <Zap className="w-5 h-5" />, t: t.f2t, d: t.f2d },
    { icon: <Sparkles className="w-5 h-5" />, t: t.f3t, d: t.f3d },
  ];

  return (
    <div className="min-h-screen bg-[#faf7f2] flex flex-col">
      <Navbar lang={lang} setLang={setLang} />

      <div className="flex-1 flex flex-col lg:flex-row h-[calc(100vh-64px)] overflow-hidden">
        {/* Left info panel — desktop only */}
        <div className="hidden lg:flex w-[400px] shrink-0 flex-col justify-center px-10 py-12 border-r border-black/5 bg-white/40">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#0271BC] to-[#1E90FF] flex items-center justify-center mb-6 shadow-sm">
            <Bot className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900 leading-tight">
            {t.title}
            <span className="gradient-text">YojnaSaathi</span>
          </h1>
          <p className="mt-4 text-[15px] font-medium text-gray-500 leading-relaxed">
            {t.subtitle}
          </p>
          <div className="mt-10 flex flex-col gap-6">
            {features.map((f, i) => (
              <div key={i} className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0271BC] flex items-center justify-center shrink-0 border border-blue-100/50">
                  {f.icon}
                </div>
                <div className="pt-0.5">
                  <div className="text-[15px] font-bold text-gray-900">{f.t}</div>
                  <div className="text-sm font-medium text-gray-500 mt-0.5">{f.d}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chat area */}
        <div className="flex-1 relative bg-white">
          <YojnaSaathi isFullPage={true} onToggleFullPage={() => router.push('/')} />
        </div>
      </div>
    </div>
  );
}
