'use client';

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from 'next/link';
import {
  ChevronLeft, ArrowUpRight, Star, BookOpen, FileText,
  ClipboardList, Share2, Loader2, ExternalLink, Check,
  Bot, Calendar, Tag, ShieldCheck, ScrollText, Link2,
  ArrowLeft, Copy, CheckCircle2, ChevronRight, Bookmark, ShieldAlert
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import YojnaSaathi from "@/components/YojnaSaathi";
import translations from "@/lib/translations";

const parseJson = (f) => {
  if (!f) return [];
  if (Array.isArray(f)) return f;
  try { return JSON.parse(f); }
  catch {
    const m = []; const p = /'([^']*(?:''[^']*)*)'/g; let x;
    while ((x = p.exec(f)) !== null) m.push(x[1].replace(/''/g, "'"));
    return m.length > 0 ? m : [f];
  }
};

const parseListContent = (f) => {
  const parsed = parseJson(f);
  const finalItems = [];
  parsed.forEach(item => {
    if (typeof item === 'string') {
      item.split('\n').map(l => l.trim()).filter(Boolean).forEach(line => {
        const clean = line.replace(/^[-•*]\s*/, '').replace(/^(?:Step\s*\d+\s*[:\.]?|\d+[\.)])\s*/i, '').trim();
        if (clean) finalItems.push(clean);
      });
    } else { finalItems.push(item); }
  });
  return finalItems;
};

const FormattedDetails = ({ text }) => {
  if (!text) return <p className="text-sm text-gray-500 leading-relaxed">No details available.</p>;
  const lines = text.split('\n').filter(l => l.trim());
  return (
    <div className="space-y-3">
      {lines.map((line, i) => {
        const trimmed = line.trim();
        const isList = /^(?:[-•*]|\d+[\.)])/.test(trimmed);
        if (isList) return (
          <div key={i} className="flex items-start gap-3">
            <span className="w-1.5 h-1.5 rounded-full bg-[#3B82F6] shrink-0 mt-2" />
            <span className="text-sm text-gray-600 leading-relaxed">{trimmed.replace(/^[-•*]\s*|^\d+[\.)] /, '')}</span>
          </div>
        );
        return <p key={i} className="text-sm text-gray-600 leading-relaxed">{trimmed}</p>;
      })}
    </div>
  );
};

const SECTION_STYLES = {
  details:     { icon: BookOpen,     accent: 'bg-blue-50 text-blue-600',    border: 'border-blue-100' },
  benefits:    { icon: Star,         accent: 'bg-amber-50 text-amber-600',  border: 'border-amber-100' },
  eligibility: { icon: ShieldCheck,  accent: 'bg-emerald-50 text-emerald-600', border: 'border-emerald-100' },
  application: { icon: ClipboardList,accent: 'bg-purple-50 text-purple-600', border: 'border-purple-100' },
  documents:   { icon: ScrollText,   accent: 'bg-rose-50 text-rose-600',    border: 'border-rose-100' },
  sources:     { icon: Link2,        accent: 'bg-gray-50 text-gray-500',    border: 'border-gray-100' },
};

export default function SchemeDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [scheme, setScheme] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);
  const [activeSection, setActiveSection] = useState('details');
  const [lang, setLang] = useState('en');
  const [isLangLoaded, setIsLangLoaded] = useState(false);

  const t = translations[lang]?.details || translations['en'].details;

  const SECTIONS = [
    { id: 'details', label: t.secDetails, icon: Bookmark },
    { id: 'benefits', label: t.secBenefits, icon: CheckCircle2 },
    { id: 'eligibility', label: t.secElig, icon: ShieldAlert },
    { id: 'application', label: t.secApp, icon: ChevronRight },
    { id: 'documents', label: t.secDocs, icon: Copy },
  ];

  useEffect(() => {
    const saved = localStorage.getItem('yojna_lang');
    if (saved) setLang(saved);
    setIsLangLoaded(true);
  }, []);

  const handleLangChange = (newLang) => {
    setLang(newLang);
    localStorage.setItem('yojna_lang', newLang);
  };

  useEffect(() => {
    if (!id || !isLangLoaded) return;
    let isMounted = true;
    (async () => {
      try { setLoading(true); const r = await fetch(`/api/schemes/${id}?lang=${lang}`); if (!r.ok) throw new Error(`${r.status}`); const data = await r.json(); if (isMounted) setScheme(data); }
      catch (e) { if (isMounted) setError(e.message); } finally { if (isMounted) setLoading(false); }
    })();
    return () => { isMounted = false; };
  }, [id, lang, isLangLoaded]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => { entries.forEach(e => { if (e.isIntersecting) setActiveSection(e.target.id); }); },
      { rootMargin: '-20% 0px -70% 0px' }
    );
    SECTIONS.forEach(s => { const el = document.getElementById(s.id); if (el) observer.observe(el); });
    return () => observer.disconnect();
  }, [scheme, lang]);

  const handleCopyLink = async () => {
    await navigator.clipboard.writeText(window.location.href);
    setCopied(true); setTimeout(() => setCopied(false), 2000);
  };

  if (loading) return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar lang={lang} setLang={handleLangChange} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col items-center justify-center min-h-[50vh]">
          <div className="w-16 h-16 border-4 border-[#0271BC]/20 border-t-[#0271BC] rounded-full animate-spin mb-4" />
          <p className="text-gray-500 font-medium">Loading scheme details...</p>
      </div>
    </div>
  );

  if (error || !scheme) return (
    <div className="min-h-screen bg-white flex flex-col"><Navbar lang={lang} setLang={handleLangChange} />
      <div className="flex-1 flex flex-col items-center justify-center gap-4 px-4">
        <div className="text-5xl">😕</div>
        <p className="text-xl font-extrabold text-gray-900">{error ? 'Something went wrong' : 'Scheme not found'}</p>
        <p className="text-sm text-gray-500">{error || 'This scheme could not be found.'}</p>
        <button onClick={() => router.push('/schemes')}
          className="mt-2 inline-flex items-center gap-2 bg-[#3B82F6] text-white px-6 py-3 rounded-full text-sm font-bold hover:bg-[#2563EB] transition-colors">
          <ChevronLeft className="w-4 h-4" /> Back to Schemes
        </button>
      </div>
    </div>
  );

  const tags = parseJson(scheme.Tags);
  const benefits = parseListContent(scheme.Benefits);
  const eligibility = parseListContent(scheme.Eligibility);
  const steps = parseListContent(scheme["Application Process (Steps)"]);
  const docs = parseListContent(scheme["Documents Required"]);
  const sources = parseListContent(scheme["Sources & References"]);
  const officialUrl = sources.find(s => /^https?:\/\//.test(s) && !s.includes('myscheme.gov.in')) || scheme.URL;

  const levelColor = scheme.Level?.toLowerCase().includes('central')
    ? 'bg-blue-100 text-blue-700'
    : 'bg-emerald-100 text-emerald-700';

  return (
    <div className="min-h-screen bg-[#EFF6FF] flex flex-col pb-[72px] lg:pb-0 relative overflow-hidden">
      <div className="pointer-events-none select-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full bg-[#3B82F6]/15 blur-[110px]" />
        <div className="absolute top-[40%] -right-40 w-[400px] h-[400px] rounded-full bg-[#60A5FA]/12 blur-[120px]" />
        <div className="absolute bottom-0 left-[20%] w-[400px] h-[400px] rounded-full bg-[#93C5FD]/12 blur-[100px]" />
      </div>

      <div className="relative z-10 flex flex-col flex-1">
        <Navbar lang={lang} setLang={handleLangChange} />

        <div className="max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-6 pb-2">
          <Link href="/schemes" className="inline-flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-[#0271BC] transition-colors mb-8">
            <ArrowLeft className="w-4 h-4" /> {t.back}
          </Link>
        </div>

        <div className="max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 pb-12 flex flex-col lg:flex-row gap-6 lg:gap-8">
          <div className="flex-1 min-w-0 space-y-4">
            <div className="bg-white rounded-3xl border border-blue-100 shadow-[0_4px_24px_rgba(59,130,246,0.10)] overflow-hidden">
              <div className="p-6 md:p-8">
                <div className="flex flex-wrap gap-2 mb-4">
                  {scheme.Level && <span className={`text-xs px-3 py-1 rounded-full font-bold ${levelColor}`}>{scheme.Level}</span>}
                  {scheme["Benefit Type"] && <span className="text-xs px-3 py-1 rounded-full bg-amber-100 text-amber-700 font-bold">{scheme["Benefit Type"]}</span>}
                  {scheme["Scheme Category"] && <span className="text-xs px-3 py-1 rounded-full bg-purple-100 text-purple-700 font-bold">{scheme["Scheme Category"]}</span>}
                </div>
                <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 leading-snug">
                  {scheme["Scheme Title"] || "Untitled"}
                </h1>
                <p className="text-sm font-semibold text-gray-500 mt-2 uppercase tracking-wide">
                  {scheme["Department/State"] || ""}
                </p>
                {scheme["Date of Launch"] && (
                  <p className="flex items-center gap-1.5 text-xs font-semibold text-gray-400 mt-2">
                    <Calendar className="w-3.5 h-3.5" /> Launched: {scheme["Date of Launch"]}
                  </p>
                )}
                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-5">
                    {tags.slice(0, 7).map((t, i) => (
                      <span key={i} className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-blue-50 text-[#3B82F6] border border-blue-100 font-bold">
                        <Tag className="w-3 h-3" />{t}
                      </span>
                    ))}
                  </div>
                )}
                <div className="flex flex-wrap gap-3 mt-6">
                  <button
                    onClick={() => window.dispatchEvent(new CustomEvent('openChatWithScheme', { detail: id }))}
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-[#3B82F6] to-[#60A5FA] text-white px-6 py-3 rounded-full text-sm font-bold shadow-md hover:shadow-lg hover:scale-105 transition-all">
                    <Bot className="w-4 h-4" /> {t.checkElig}
                  </button>
                  {officialUrl && (
                    <a href={officialUrl} target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 bg-white text-[#3B82F6] border-2 border-blue-100 px-6 py-3 rounded-full text-sm font-bold hover:border-[#3B82F6]/50 hover:bg-blue-50 transition-all">
                      <ExternalLink className="w-4 h-4" /> {t.offSite}
                    </a>
                  )}
                </div>
              </div>
            </div>

            {[
              { key: 'details',     content: <FormattedDetails text={scheme.Details} />, show: true },
              { key: 'benefits',    content: <BulletList items={benefits} numbered accent="from-[#3B82F6] to-[#60A5FA]" />, show: benefits.length > 0 },
              { key: 'eligibility', content: <BulletList items={eligibility} dot />, show: eligibility.length > 0 },
              { key: 'application', content: <BulletList items={steps} numbered accent="from-purple-500 to-purple-400" />, show: steps.length > 0 },
              { key: 'documents',   content: <DocGrid items={docs} />, show: docs.length > 0 },
            ].filter(s => s.show).map(({ key, content }) => {
              const style = SECTION_STYLES[key];
              const Icon = style.icon;
              const sectionLabel = SECTIONS.find(s => s.id === key)?.label;
              return (
                <div key={key} id={key}
                  className={`bg-white rounded-2xl border ${style.border} shadow-[0_2px_12px_rgba(59,130,246,0.07)] p-5 md:p-7 scroll-mt-28`}>
                  <div className="flex items-center gap-3 mb-5">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${style.accent}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <h2 className="text-base font-extrabold text-gray-900">{sectionLabel}</h2>
                  </div>
                  {content}
                </div>
              );
            })}
          </div>

          <aside className="hidden lg:flex flex-col w-[260px] shrink-0 sticky top-[88px] self-start gap-4">
            <div className="hidden lg:block w-72 shrink-0">
              <div className="sticky top-28 bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                <h3 className="text-sm font-extrabold text-gray-900 uppercase tracking-wider mb-4">{t.onPage}</h3>
                <nav className="space-y-1">
                  {SECTIONS.map((s) => {
                    const Icon = s.icon;
                    const isActive = activeSection === s.id;
                    return (
                      <a key={s.id} href={`#${s.id}`}
                        className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-bold transition-all ${isActive ? 'bg-blue-50 text-[#3B82F6]' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'}`}>
                        <Icon className={`w-4 h-4 ${isActive ? 'text-[#3B82F6]' : 'text-gray-400'}`} />
                        {s.label}
                      </a>
                    );
                  })}
                </nav>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-blue-100 shadow-[0_2px_12px_rgba(59,130,246,0.07)] p-4">
              <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">{t.shareTitle}</h3>
              <div className="flex gap-2">
                <button onClick={handleCopyLink} className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm font-bold text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm">
                  {copied ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                  {copied ? t.copied : t.copy}
                </button>
                <button className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm font-bold text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm">
                  <Share2 className="w-4 h-4" /> {t.share}
                </button>
              </div>
            </div>

            <div className="bg-gradient-to-br from-[#3B82F6] to-[#2563EB] rounded-2xl p-5 text-white shadow-lg">
              <Bot className="w-6 h-6 mb-3 opacity-90" />
              <p className="text-sm font-extrabold leading-snug mb-1">{t.eligTitle}</p>
              <p className="text-xs text-white/75 mb-4 leading-relaxed">{t.eligDesc}</p>
              <button
                onClick={() => window.dispatchEvent(new CustomEvent('openChatWithScheme', { detail: id }))}
                className="w-full py-2.5 rounded-xl bg-white text-[#2563EB] text-sm font-bold hover:bg-blue-50 transition-colors">
                {t.askAi}
              </button>
            </div>
          </aside>
        </div>

        {/* Mobile Bottom Bar */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/90 backdrop-blur-xl border-t border-blue-100 px-4 py-3 flex items-center gap-3 shadow-[0_-4px_20px_rgba(59,130,246,0.1)]">
          <button onClick={handleCopyLink}
            className="w-11 h-11 shrink-0 rounded-full bg-blue-50 flex items-center justify-center text-[#3B82F6] hover:bg-blue-100 transition-colors">
            {copied ? <Check className="w-5 h-5 text-emerald-500" /> : <Share2 className="w-5 h-5" />}
          </button>
          <button
            onClick={() => window.dispatchEvent(new CustomEvent('openChatWithScheme', { detail: id }))}
            className="flex-1 h-11 flex items-center justify-center gap-2 bg-gradient-to-r from-[#3B82F6] to-[#60A5FA] text-white rounded-full text-sm font-bold shadow-md hover:shadow-lg transition-all">
            <Bot className="w-4 h-4" /> {t.checkEligMobile} <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>

        <div className="hidden lg:block mt-auto"><Footer /></div>
        <YojnaSaathi />
      </div>
    </div>
  );
}

function BulletList({ items, numbered, dot, accent = "from-[#3B82F6] to-[#60A5FA]" }) {
  return (
    <div className="space-y-3">
      {items.map((item, i) => (
        <div key={i} className="flex items-start gap-3.5">
          {numbered ? (
            <span className={`w-6 h-6 rounded-full bg-gradient-to-br ${accent} text-white flex items-center justify-center text-[11px] font-bold shrink-0 mt-0.5`}>
              {i + 1}
            </span>
          ) : (
            <span className="w-2 h-2 rounded-full bg-[#3B82F6]/40 shrink-0 mt-2" />
          )}
          <span className="text-sm text-gray-600 leading-relaxed">{item}</span>
        </div>
      ))}
    </div>
  );
}

function DocGrid({ items }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
      {items.map((d, i) => (
        <div key={i} className="flex items-center gap-2.5 p-3 rounded-xl bg-rose-50/60 border border-rose-100 text-sm font-semibold text-gray-700">
          <FileText className="w-4 h-4 text-rose-400 shrink-0" />{d}
        </div>
      ))}
    </div>
  );
}

function SourcesList({ items }) {
  return (
    <div className="space-y-2.5">
      {items.map((s, i) => {
        const isUrl = /^https?:\/\//.test(s);
        return isUrl ? (
          <a key={i} href={s} target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm font-bold text-[#3B82F6] hover:underline truncate">
            <ExternalLink className="w-4 h-4 shrink-0" /><span className="truncate">{s}</span>
          </a>
        ) : (
          <p key={i} className="flex items-center gap-2 text-sm text-gray-500">
            <FileText className="w-4 h-4 shrink-0 text-gray-400" />{s}
          </p>
        );
      })}
    </div>
  );
}
