'use client';

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ChevronLeft, ArrowUpRight, Star, BookOpen, FileText,
  ClipboardList, Share2, Loader2, ExternalLink, Check,
  Bot, Calendar, Tag, ShieldCheck, ScrollText, Link2
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import YojnaSaathi from "@/components/YojnaSaathi";

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

const SECTIONS = [
  { id: 'details',     label: 'Details',             icon: BookOpen },
  { id: 'benefits',    label: 'Benefits',             icon: Star },
  { id: 'eligibility', label: 'Eligibility',          icon: ShieldCheck },
  { id: 'application', label: 'How to Apply',         icon: ClipboardList },
  { id: 'documents',   label: 'Documents Required',   icon: ScrollText },
  { id: 'sources',     label: 'Sources',              icon: Link2 },
];

const SECTION_STYLES = {
  details:     { icon: BookOpen,     accent: 'bg-blue-50 text-blue-600',    border: 'border-blue-100',    title: 'Details' },
  benefits:    { icon: Star,         accent: 'bg-amber-50 text-amber-600',  border: 'border-amber-100',   title: 'Benefits' },
  eligibility: { icon: ShieldCheck,  accent: 'bg-emerald-50 text-emerald-600', border: 'border-emerald-100', title: 'Eligibility' },
  application: { icon: ClipboardList,accent: 'bg-purple-50 text-purple-600', border: 'border-purple-100', title: 'How to Apply' },
  documents:   { icon: ScrollText,   accent: 'bg-rose-50 text-rose-600',    border: 'border-rose-100',    title: 'Documents Required' },
  sources:     { icon: Link2,        accent: 'bg-gray-50 text-gray-500',    border: 'border-gray-100',    title: 'Sources' },
};

export default function SchemeDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [scheme, setScheme] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);
  const [activeSection, setActiveSection] = useState('details');

  useEffect(() => {
    if (!id) return;
    (async () => {
      try { setLoading(true); const r = await fetch(`/api/schemes/${id}`); if (!r.ok) throw new Error(`${r.status}`); setScheme(await r.json()); }
      catch (e) { setError(e.message); } finally { setLoading(false); }
    })();
  }, [id]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => { entries.forEach(e => { if (e.isIntersecting) setActiveSection(e.target.id); }); },
      { rootMargin: '-20% 0px -70% 0px' }
    );
    SECTIONS.forEach(s => { const el = document.getElementById(s.id); if (el) observer.observe(el); });
    return () => observer.disconnect();
  }, [scheme]);

  const shareScheme = async () => {
    const url = window.location.href;
    const title = scheme?.["Scheme Title"] || 'Government Scheme';
    if (navigator.share) { try { await navigator.share({ title, url }); } catch {} }
    else { await navigator.clipboard.writeText(`${title}\n${url}`); setCopied(true); setTimeout(() => setCopied(false), 2000); }
  };

  if (loading) return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />
      <div className="flex-1 flex flex-col items-center justify-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center">
          <Loader2 className="w-7 h-7 text-[#3B82F6] animate-spin" />
        </div>
        <span className="text-sm font-semibold text-gray-500">Loading scheme…</span>
      </div>
    </div>
  );

  if (error || !scheme) return (
    <div className="min-h-screen bg-white flex flex-col"><Navbar />
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
      {/* Blurry blue blobs */}
      <div className="pointer-events-none select-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full bg-[#3B82F6]/15 blur-[110px]" />
        <div className="absolute top-[40%] -right-40 w-[400px] h-[400px] rounded-full bg-[#60A5FA]/12 blur-[120px]" />
        <div className="absolute bottom-0 left-[20%] w-[400px] h-[400px] rounded-full bg-[#93C5FD]/12 blur-[100px]" />
      </div>

      <div className="relative z-10 flex flex-col flex-1">
        <Navbar />

        {/* Back button */}
        <div className="max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-6 pb-2">
          <button onClick={() => router.push('/schemes')}
            className="inline-flex items-center gap-1.5 text-sm font-bold text-gray-500 hover:text-[#3B82F6] transition-colors group">
            <ChevronLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" /> Back to schemes
          </button>
        </div>

        <div className="max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 pb-12 flex flex-col lg:flex-row gap-6 lg:gap-8">

          {/* ── Main Content ── */}
          <div className="flex-1 min-w-0 space-y-4">

            {/* Hero Header Card */}
            <div className="bg-white rounded-3xl border border-blue-100 shadow-[0_4px_24px_rgba(59,130,246,0.10)] overflow-hidden">
              <div className="p-6 md:p-8">
                {/* Level + category badges */}
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

                {/* Tags */}
                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-5">
                    {tags.slice(0, 7).map((t, i) => (
                      <span key={i} className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-blue-50 text-[#3B82F6] border border-blue-100 font-bold">
                        <Tag className="w-3 h-3" />{t}
                      </span>
                    ))}
                  </div>
                )}

                {/* CTA Buttons */}
                <div className="flex flex-wrap gap-3 mt-6">
                  <button
                    onClick={() => window.dispatchEvent(new CustomEvent('openChatWithScheme', { detail: id }))}
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-[#3B82F6] to-[#60A5FA] text-white px-6 py-3 rounded-full text-sm font-bold shadow-md hover:shadow-lg hover:scale-105 transition-all">
                    <Bot className="w-4 h-4" /> Check Eligibility with AI
                  </button>
                  {officialUrl && (
                    <a href={officialUrl} target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 bg-white text-[#3B82F6] border-2 border-blue-100 px-6 py-3 rounded-full text-sm font-bold hover:border-[#3B82F6]/50 hover:bg-blue-50 transition-all">
                      <ExternalLink className="w-4 h-4" /> Official Site
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Section Cards */}
            {[
              { key: 'details',     content: <FormattedDetails text={scheme.Details} />, show: true },
              { key: 'benefits',    content: <BulletList items={benefits} numbered accent="from-[#3B82F6] to-[#60A5FA]" />, show: benefits.length > 0 },
              { key: 'eligibility', content: <BulletList items={eligibility} dot />, show: eligibility.length > 0 },
              { key: 'application', content: <BulletList items={steps} numbered accent="from-purple-500 to-purple-400" />, show: steps.length > 0 },
              { key: 'documents',   content: <DocGrid items={docs} />, show: docs.length > 0 },
              { key: 'sources',     content: <SourcesList items={sources} />, show: sources.length > 0 },
            ].filter(s => s.show).map(({ key, content }) => {
              const style = SECTION_STYLES[key];
              const Icon = style.icon;
              return (
                <div key={key} id={key}
                  className={`bg-white rounded-2xl border ${style.border} shadow-[0_2px_12px_rgba(59,130,246,0.07)] p-5 md:p-7 scroll-mt-28`}>
                  <div className="flex items-center gap-3 mb-5">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${style.accent}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <h2 className="text-base font-extrabold text-gray-900">{style.title}</h2>
                  </div>
                  {content}
                </div>
              );
            })}
          </div>

          {/* ── Desktop Sidebar ── */}
          <aside className="hidden lg:flex flex-col w-[260px] shrink-0 sticky top-[88px] self-start gap-4">
            {/* Sections nav */}
            <div className="bg-white rounded-2xl border border-blue-100 shadow-[0_2px_12px_rgba(59,130,246,0.07)] p-4">
              <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3 px-2">On this page</h3>
              <div className="space-y-0.5">
                {SECTIONS.map(s => {
                  const Icon = s.icon;
                  const isActive = activeSection === s.id;
                  return (
                    <a key={s.id} href={`#${s.id}`}
                      className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-bold transition-all ${isActive ? 'bg-blue-50 text-[#3B82F6]' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'}`}>
                      <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#3B82F6]' : 'text-gray-400'}`} />
                      {s.label}
                    </a>
                  );
                })}
              </div>
            </div>

            {/* Share */}
            <div className="bg-white rounded-2xl border border-blue-100 shadow-[0_2px_12px_rgba(59,130,246,0.07)] p-4">
              <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Share</h3>
              <button onClick={shareScheme}
                className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-bold text-gray-600 hover:text-[#3B82F6] hover:bg-blue-50 transition-all">
                {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Share2 className="w-4 h-4" />}
                {copied ? 'Copied!' : 'Copy link'}
              </button>
            </div>

            {/* AI CTA */}
            <div className="bg-gradient-to-br from-[#3B82F6] to-[#2563EB] rounded-2xl p-5 text-white shadow-lg">
              <Bot className="w-6 h-6 mb-3 opacity-90" />
              <p className="text-sm font-extrabold leading-snug mb-1">Check your eligibility</p>
              <p className="text-xs text-white/75 mb-4 leading-relaxed">Chat with our AI in your language</p>
              <button
                onClick={() => window.dispatchEvent(new CustomEvent('openChatWithScheme', { detail: id }))}
                className="w-full py-2.5 rounded-xl bg-white text-[#2563EB] text-sm font-bold hover:bg-blue-50 transition-colors">
                Ask AI →
              </button>
            </div>
          </aside>
        </div>

        {/* Mobile Bottom Bar */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/90 backdrop-blur-xl border-t border-blue-100 px-4 py-3 flex items-center gap-3 shadow-[0_-4px_20px_rgba(59,130,246,0.1)]">
          <button onClick={shareScheme}
            className="w-11 h-11 shrink-0 rounded-full bg-blue-50 flex items-center justify-center text-[#3B82F6] hover:bg-blue-100 transition-colors">
            {copied ? <Check className="w-5 h-5 text-emerald-500" /> : <Share2 className="w-5 h-5" />}
          </button>
          <button
            onClick={() => window.dispatchEvent(new CustomEvent('openChatWithScheme', { detail: id }))}
            className="flex-1 h-11 flex items-center justify-center gap-2 bg-gradient-to-r from-[#3B82F6] to-[#60A5FA] text-white rounded-full text-sm font-bold shadow-md hover:shadow-lg transition-all">
            <Bot className="w-4 h-4" /> Check Eligibility <ArrowUpRight className="w-4 h-4" />
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
