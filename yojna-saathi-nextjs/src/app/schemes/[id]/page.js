'use client';

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ChevronLeft, ChevronDown, ArrowUpRight, Star, BookOpen, FileText, ClipboardList, Share2, Loader2, ExternalLink, Check, Bot } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import YojnaSaathi from "@/components/YojnaSaathi";

const parseJson = (f) => { if (!f) return []; if (Array.isArray(f)) return f; try { return JSON.parse(f); } catch { const m = []; const p = /'([^']*(?:''[^']*)*)'/g; let x; while ((x = p.exec(f)) !== null) m.push(x[1].replace(/''/g, "'")); return m.length > 0 ? m : [f]; } };

const parseListContent = (f) => {
  const parsed = parseJson(f);
  let finalItems = [];
  parsed.forEach(item => {
    if (typeof item === 'string') {
      const lines = item.split('\n').map(line => line.trim()).filter(line => line !== '');
      lines.forEach(line => {
        const cleanLine = line
          .replace(/^[-•*]\s*/, '')
          .replace(/^(?:Step\s*\d+\s*[:\.]?|\d+[\.)])\s*/i, '')
          .trim();
        if (cleanLine) finalItems.push(cleanLine);
      });
    } else {
      finalItems.push(item);
    }
  });
  return finalItems;
};

const FormattedDetails = ({ text }) => {
  if (!text) return <p className="text-[14px] md:text-[15px] font-medium text-gray-600 leading-relaxed">No details available.</p>;
  
  const lines = text.split('\n').filter(line => line.trim() !== '');
  
  return (
    <div className="space-y-3">
      {lines.map((line, index) => {
        const trimmed = line.trim();
        const isListItem = /^(?:[-•*]|\d+[\.)])/.test(trimmed);
        
        if (isListItem) {
          return (
             <div key={index} className="flex items-start gap-3">
                <span className="text-[#0271BC] text-lg font-black shrink-0 leading-none mt-0.5">•</span>
                <span className="text-[14px] md:text-[15px] font-medium text-gray-600 leading-relaxed">{trimmed.replace(/^[-•*]\s*|^\d+[\.)]\s*/, '')}</span>
             </div>
          );
        }

        return (
          <p key={index} className="text-[14px] md:text-[15px] font-medium text-gray-600 leading-relaxed text-justify">
            {trimmed}
          </p>
        );
      })}
    </div>
  );
};

export default function SchemeDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [scheme, setScheme] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!id) return;
    (async () => { try { setLoading(true); const r = await fetch(`/api/schemes/${id}`); if (!r.ok) throw new Error(`${r.status}`); setScheme(await r.json()); } catch (e) { setError(e.message); } finally { setLoading(false); } })();
  }, [id]);

  if (loading) return (
    <div className="min-h-screen bg-[#faf7f2] flex flex-col"><Navbar />
      <div className="flex-1 flex items-center justify-center gap-3 text-gray-500">
        <Loader2 className="w-5 h-5 text-[#0271BC] animate-spin" /><span className="text-sm font-bold">Loading…</span>
      </div>
    </div>
  );

  if (error || !scheme) return (
    <div className="min-h-screen bg-[#faf7f2] flex flex-col"><Navbar />
      <div className="flex-1 max-w-6xl w-full mx-auto px-4 py-20 text-center">
        <p className="text-xl font-extrabold text-gray-900 mb-2">{error ? 'Error' : 'Not Found'}</p>
        <p className="text-sm text-gray-500 font-medium mb-6">{error || 'Scheme not found.'}</p>
        <button onClick={() => router.push('/schemes')} className="inline-flex items-center gap-2 bg-gradient-to-r from-[#0271BC] to-[#1E90FF] text-white px-6 py-3 rounded-full text-sm font-bold shadow-sm hover:shadow-md transition-all">
          <ChevronLeft className="w-4 h-4" />Back
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

  const shareScheme = async () => {
    const url = window.location.href;
    const title = scheme["Scheme Title"] || 'Government Scheme';
    if (navigator.share) {
      try { await navigator.share({ title, url }); } catch {}
    } else {
      await navigator.clipboard.writeText(`${title}\n${url}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-[#faf7f2] flex flex-col pb-[72px] lg:pb-0">
      <Navbar />

      {/* Back button */}
      <div className="max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-4 md:py-6">
        <button onClick={() => router.push('/schemes')} className="inline-flex items-center gap-1.5 text-sm font-bold text-gray-500 hover:text-[#0271BC] transition-colors">
          <ChevronLeft className="w-4 h-4" />Back to schemes
        </button>
      </div>

      <div className="max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 pb-10 flex flex-col lg:flex-row gap-6 lg:gap-8">
        {/* Main Content */}
        <div className="flex-1 min-w-0 space-y-4 md:space-y-6">
          {/* Header */}
          <div className="bg-white/80 border border-black/5 rounded-2xl p-5 md:p-8 shadow-sm">
            <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 leading-tight md:leading-[1.2]">{scheme["Scheme Title"] || "Untitled"}</h1>
            <p className="text-sm md:text-base font-bold text-gray-500 mt-2">{scheme["Department/State"] || ""}</p>
            <div className="flex flex-wrap gap-2 mt-4 md:mt-5">
              {tags.slice(0, 6).map((t, i) => <span key={i} className="inline-flex items-center text-xs px-3 py-1 rounded-full bg-blue-50 text-[#0271BC] border border-blue-100 font-bold">{t}</span>)}
            </div>
            <div className="flex flex-wrap gap-2.5 mt-3 md:mt-4">
              {[scheme.Level, scheme["Benefit Type"], scheme["Scheme Category"]].filter(Boolean).map((v, i) => (
                <span key={i} className="text-xs px-3 py-1.5 rounded-full bg-gray-100 border border-black/5 text-gray-600 font-bold">{v}</span>
              ))}
            </div>
            <div className="flex flex-wrap gap-3 mt-6">
              <button onClick={() => window.dispatchEvent(new CustomEvent('openChatWithScheme', { detail: id }))} 
                className="inline-flex items-center gap-2 bg-gradient-to-r from-[#0271BC] to-[#1E90FF] text-white px-6 py-3 rounded-full text-sm font-bold shadow-sm hover:shadow-md transition-all">
                <Bot className="w-4 h-4" /> Check Eligibility with AI
              </button>
              {scheme.URL && (
                <a href={scheme.URL} target="_blank" rel="noopener noreferrer" 
                  className="inline-flex items-center gap-2 bg-white text-[#0271BC] border-2 border-gray-100 px-6 py-3 rounded-full text-sm font-bold shadow-sm hover:border-[#0271BC]/30 hover:bg-blue-50/50 transition-all">
                  <ExternalLink className="w-4 h-4" />Official Site
                </a>
              )}
            </div>
          </div>

          {/* Details */}
          <div id="details" className="bg-white/80 border border-black/5 rounded-2xl p-5 md:p-6 shadow-sm">
            <div className="flex items-center gap-3 text-lg font-extrabold text-gray-900 mb-4 md:mb-5">
              <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#0271BC] flex items-center justify-center shrink-0"><BookOpen className="w-4 h-4" /></div>
              Details
            </div>
            <FormattedDetails text={scheme.Details} />
          </div>

          {/* Benefits */}
          {benefits.length > 0 && <div id="benefits" className="bg-white/80 border border-black/5 rounded-2xl p-5 md:p-6 shadow-sm">
            <div className="flex items-center gap-3 text-lg font-extrabold text-gray-900 mb-4 md:mb-5">
              <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#0271BC] flex items-center justify-center shrink-0"><Star className="w-4 h-4" /></div>
              Benefits
            </div>
            <div className="space-y-3">
              {benefits.map((b, i) => (
                <div key={i} className="flex items-start gap-3.5">
                  <span className="w-6 h-6 rounded-full bg-gradient-to-br from-[#0271BC] to-[#1E90FF] text-white flex items-center justify-center text-[11px] font-bold shrink-0 mt-0.5">{i + 1}</span>
                  <span className="text-[14px] md:text-[15px] font-medium text-gray-600 leading-relaxed">{b}</span>
                </div>
              ))}
            </div>
          </div>}

          {/* Eligibility */}
          {eligibility.length > 0 && <div id="eligibility" className="bg-white/80 border border-black/5 rounded-2xl p-5 md:p-6 shadow-sm">
            <div className="flex items-center gap-3 text-lg font-extrabold text-gray-900 mb-4 md:mb-5">
              <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#0271BC] flex items-center justify-center shrink-0"><FileText className="w-4 h-4" /></div>
              Eligibility
            </div>
            <div className="space-y-2.5">
              {eligibility.map((e, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span className="text-[#0271BC] text-lg font-black shrink-0 leading-none mt-0.5">•</span>
                  <span className="text-[14px] md:text-[15px] font-medium text-gray-600 leading-relaxed">{e}</span>
                </div>
              ))}
            </div>
          </div>}

          {/* Application */}
          {steps.length > 0 && <div id="application" className="bg-white/80 border border-black/5 rounded-2xl p-5 md:p-6 shadow-sm">
            <div className="flex items-center gap-3 text-lg font-extrabold text-gray-900 mb-4 md:mb-5">
              <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#0271BC] flex items-center justify-center shrink-0"><ClipboardList className="w-4 h-4" /></div>
              Application Process
            </div>
            <div className="space-y-4">
              {steps.map((s, i) => (
                <div key={i} className="flex items-start gap-3.5">
                  <span className="w-7 h-7 rounded-full bg-gradient-to-br from-[#0271BC] to-[#1E90FF] text-white flex items-center justify-center text-[11px] font-bold shrink-0">{i + 1}</span>
                  <span className="text-[14px] md:text-[15px] font-medium text-gray-600 leading-relaxed pt-0.5">{s}</span>
                </div>
              ))}
            </div>
          </div>}

          {/* Documents */}
          {docs.length > 0 && <div id="documents" className="bg-white/80 border border-black/5 rounded-2xl p-5 md:p-6 shadow-sm">
            <div className="flex items-center gap-3 text-lg font-extrabold text-gray-900 mb-4 md:mb-5">
              <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#0271BC] flex items-center justify-center shrink-0"><FileText className="w-4 h-4" /></div>
              Documents Required
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {docs.map((d, i) => (
                <div key={i} className="flex items-center gap-2.5 text-[14px] font-bold text-gray-600 p-3 rounded-xl bg-gray-50/80 border border-black/5">
                  <FileText className="w-4 h-4 text-[#0271BC] shrink-0" />{d}
                </div>
              ))}
            </div>
          </div>}



          {/* Sources */}
          {sources.length > 0 && <div id="sources" className="bg-white/80 border border-black/5 rounded-2xl p-5 md:p-6 shadow-sm">
            <div className="flex items-center gap-3 text-lg font-extrabold text-gray-900 mb-4 md:mb-5">
              <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#0271BC] flex items-center justify-center shrink-0"><ExternalLink className="w-4 h-4" /></div>
              Sources
            </div>
            <div className="space-y-3">
              {sources.map((s, i) => {
                const isUrl = /^https?:\/\//.test(s);
                return isUrl ? (
                  <a key={i} href={s} target="_blank" rel="noopener noreferrer" 
                    className="flex items-center gap-2 text-[14px] font-bold text-[#0271BC] hover:underline truncate">
                    <ExternalLink className="w-4 h-4 shrink-0" /><span className="truncate">{s}</span>
                  </a>
                ) : (
                  <p key={i} className="flex items-center gap-2 text-[14px] font-medium text-gray-600">
                    <FileText className="w-4 h-4 shrink-0 text-gray-400" />{s}
                  </p>
                );
              })}
            </div>
          </div>}
        </div>

        {/* Desktop Sidebar */}
        <aside className="hidden lg:block w-[280px] shrink-0 sticky top-[90px] self-start space-y-4">
          <div className="bg-white/80 border border-black/5 rounded-2xl p-5 shadow-sm">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Sections</h3>
            <div className="space-y-1">
              {['details', 'benefits', 'eligibility', 'application', 'documents', 'sources'].map(s => (
                <a key={s} href={`#${s}`} className="block px-3 py-2.5 rounded-xl text-[14px] font-bold text-gray-500 hover:text-[#0271BC] hover:bg-blue-50/50 transition-colors capitalize">
                  {s}
                </a>
              ))}
            </div>
          </div>
          <div className="bg-white/80 border border-black/5 rounded-2xl p-5 shadow-sm">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Share</h3>
            <button onClick={shareScheme} className="w-10 h-10 rounded-xl bg-gray-50 border border-black/5 flex items-center justify-center text-gray-500 hover:text-[#0271BC] hover:bg-blue-50 transition-colors">
              {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Share2 className="w-4 h-4" />}
            </button>
          </div>
        </aside>
      </div>

      {/* Mobile Bottom Action Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/90 backdrop-blur-xl border-t border-black/5 px-4 py-3 sm:px-6 sm:py-4 flex items-center gap-3 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
        <button onClick={shareScheme} className="w-11 h-11 sm:w-12 sm:h-12 shrink-0 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-200 transition-colors">
          {copied ? <Check className="w-5 h-5 text-emerald-500" /> : <Share2 className="w-5 h-5" />}
        </button>
        <button onClick={() => window.dispatchEvent(new CustomEvent('openChatWithScheme', { detail: id }))} className="flex-1 h-11 sm:h-12 flex items-center justify-center gap-2 bg-gradient-to-r from-[#0271BC] to-[#1E90FF] text-white rounded-full text-sm sm:text-[15px] font-bold shadow-md hover:shadow-lg transition-all">
          <Bot className="w-4 h-4" /> Check Eligibility <ArrowUpRight className="w-4 h-4" />
        </button>
      </div>

      <div className="hidden lg:block mt-auto"><Footer /></div>
      <YojnaSaathi />
    </div>
  );
}
