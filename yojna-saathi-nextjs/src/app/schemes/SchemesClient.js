'use client';

import { useMemo, useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, SlidersHorizontal, ChevronDown, ChevronRight, Loader2, ArrowRight, Tag, X, Filter, Sparkles, Landmark, Globe, RefreshCw } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import YojnaSaathi from "@/components/YojnaSaathi";
import translations from "@/lib/translations";
import { CATEGORIES, CATS_EN } from "@/data/categoryData";
import Link from "next/link";

// Filter-panel section headings — one object per language
const filterLabels = {
  en: { cat: 'Category',    level: 'Level',  benefitType: 'Benefit Type' },
  hi: { cat: 'श्रेणी',       level: 'स्तर',   benefitType: 'लाभ का प्रकार' },
  bn: { cat: 'বিভাগ',       level: 'স্তর',   benefitType: 'সুবিধার ধরন' },
  ta: { cat: 'வகை',         level: 'நிலை',  benefitType: 'நன்மை வகை' },
  te: { cat: 'వర్గం',        level: 'స్థాయి', benefitType: 'ప్రయోజన రకం' },
  mr: { cat: 'श्रेणी',       level: 'स्तर',   benefitType: 'लाभाचा प्रकार' },
  gu: { cat: 'શ્રેણી',       level: 'સ્તર',   benefitType: 'લાભ પ્રકાર' },
  kn: { cat: 'ವರ್ಗ',        level: 'ಹಂತ',   benefitType: 'ಪ್ರಯೋಜನ ಪ್ರಕಾರ' },
  ml: { cat: 'വിഭാഗം',      level: 'തലം',   benefitType: 'ആനുകൂല്യ തരം' },
  pa: { cat: 'ਸ਼੍ਰੇਣੀ',       level: 'ਪੱਧਰ',  benefitType: 'ਲਾਭ ਦੀ ਕਿਸਮ' },
  ur: { cat: 'زمرہ',        level: 'سطح',   benefitType: 'فائدے کی قسم' },
};

const parseJson = (f) => {
  if (!f) return [];
  if (Array.isArray(f)) return f;
  try { return JSON.parse(f); }
  catch { const m = []; const p = /'([^']*(?:''[^']*)*)'/g; let x; while ((x = p.exec(f)) !== null) m.push(x[1].replace(/''/g, "'")); return m.length > 0 ? m : [f]; }
};

export default function SchemesClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [lang, setLang] = useState("en");
  const [isLangLoaded, setIsLangLoaded] = useState(false);
  const t = translations[lang]?.schemes || translations['en'].schemes;
  const fl = filterLabels[lang] || filterLabels.en;

  useEffect(() => {
    const saved = localStorage.getItem('yojna_lang');
    if (saved) setLang(saved);
    setIsLangLoaded(true);
  }, []);

  const handleLangChange = (newLang) => {
    setLang(newLang);
    localStorage.setItem('yojna_lang', newLang);
  };
  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState("");
  const [dq, setDq] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [selCat, setSelCat] = useState("");
  const [selLevel, setSelLevel] = useState("");
  const [selBenefit, setSelBenefit] = useState("");
  const [pagination, setPagination] = useState({ total: 0 });
  const [openSections, setOpenSections] = useState({ cat: true, level: true, benefit: true });
  const [page, setPage] = useState(1);

  useEffect(() => {
    const catFromUrl = searchParams.get('cat');
    const searchFromUrl = searchParams.get('search');
    if (catFromUrl && CATEGORIES.find(c => c.key === catFromUrl)) {
      setSelCat(catFromUrl); setSelLevel(""); setSelBenefit("");
    }
    if (searchFromUrl) {
      setQuery(searchFromUrl);
      setDq(searchFromUrl);
    } else if (catFromUrl) {
      setQuery("");
      setDq("");
    }
  }, [searchParams]);

  useEffect(() => { const t = setTimeout(() => { setDq(query); setPage(1); }, 400); return () => clearTimeout(t); }, [query]);

  const load = async (pageNum = page) => {
    try {
      setLoading(true); setError(null);
      const p = new URLSearchParams({ page: pageNum.toString(), limit: '20' });
      if (dq.trim()) p.set('search', dq.trim());
      if (selCat) { const found = CATEGORIES.find(x => x.key === selCat); if (found) p.set('category', CATS_EN[selCat] || found.names.en); }
      if (selLevel) p.set('level', selLevel);
      if (selBenefit) p.set('benefitType', selBenefit);
      p.set('lang', lang);
      const r = await fetch(`/api/schemes?${p}`);
      if (!r.ok) throw new Error(`Error ${r.status}`);
      const d = await r.json();
      setSchemes(d.data.map(s => ({
        id: s.id,
        title: s["Scheme Title"] || 'Untitled',
        ministry: s["Department/State"] || '',
        desc: s.Details ? (s.Details.length > 180 ? s.Details.substring(0, 180) + '…' : s.Details) : '',
        level: s.Level || '',
        benefitType: s["Benefit Type"] || '',
        tags: parseJson(s.Tags).slice(0, 3),
      })));
      setPagination({ total: d.total, totalPages: d.totalPages });
    } catch (e) { setError(e.message); } finally { setLoading(false); }
  };

  useEffect(() => { setPage(1); }, [selCat, selLevel, selBenefit]);
  useEffect(() => { if (isLangLoaded) load(page); }, [dq, selCat, selLevel, selBenefit, page, lang, isLangLoaded]);

  const reset = () => { setSelCat(""); setSelLevel(""); setSelBenefit(""); setQuery(""); setPage(1); };
  const anyF = dq || selCat || selLevel || selBenefit;

  const Section = ({ title, open, onToggle, children }) => (
    <div className="mb-1">
      <button onClick={onToggle}
        className="w-full text-left px-3 py-2.5 flex items-center justify-between text-sm font-bold text-gray-700 hover:text-[#0271BC] transition-colors rounded-xl hover:bg-blue-50/50">
        {title}
        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && <div className="px-1 pb-2 pt-0.5">{children}</div>}
    </div>
  );

  const Radio = ({ checked, label, onChange }) => (
    <label
      className={`flex items-center gap-2.5 px-3 py-2 rounded-xl cursor-pointer text-sm transition-all duration-150 ${checked ? 'text-[#0271BC] font-bold bg-blue-50 ring-1 ring-blue-100' : 'text-gray-600 hover:bg-gray-50 font-medium'}`}
      onClick={onChange}>
      <span className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${checked ? 'border-[#0271BC] bg-[#0271BC]' : 'border-gray-300 bg-white'}`}>
        {checked && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
      </span>
      <span className="truncate">{label}</span>
    </label>
  );

  const filterContent = (
    <div className="space-y-1">
      <Section title={fl.cat} open={openSections.cat} onToggle={() => setOpenSections(p => ({ ...p, cat: !p.cat }))}>
        <div className="max-h-64 overflow-y-auto space-y-0.5 pr-1 hide-scrollbar">
          {CATEGORIES.map(c => (
            <Radio
              key={c.key}
              label={c.names[lang] || c.names.en}
              checked={selCat === c.key}
              onChange={() => setSelCat(selCat === c.key ? '' : c.key)}
            />
          ))}
        </div>
      </Section>
      <div className="h-px bg-black/5 mx-3 my-2" />
      <Section title={fl.level} open={openSections.level} onToggle={() => setOpenSections(p => ({ ...p, level: !p.level }))}>
        <div className="space-y-0.5">
          <Radio label={t.state || 'State'} checked={selLevel === 'state'} onChange={() => setSelLevel(selLevel === 'state' ? '' : 'state')} />
          <Radio label={t.central || 'Central'} checked={selLevel === 'central'} onChange={() => setSelLevel(selLevel === 'central' ? '' : 'central')} />
        </div>
      </Section>
      <div className="h-px bg-black/5 mx-3 my-2" />
      <Section title={fl.benefitType} open={openSections.benefit} onToggle={() => setOpenSections(p => ({ ...p, benefit: !p.benefit }))}>
        <div className="space-y-0.5">
          {['cash', 'composite', 'other'].map(v => (
            <Radio key={v} label={v.charAt(0).toUpperCase() + v.slice(1)} checked={selBenefit === v} onChange={() => setSelBenefit(selBenefit === v ? '' : v)} />
          ))}
        </div>
      </Section>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-white relative">
      <div className="relative z-10 flex flex-col flex-1">
        <Navbar lang={lang} setLang={handleLangChange} />

        <div className="sticky top-16 z-30 pt-4 pb-2 px-4 sm:px-6 lg:px-8 bg-white/80 backdrop-blur-md">
          <div className="max-w-6xl mx-auto flex items-center gap-3">
            <div className="relative flex-1 flex items-center bg-white border border-black/10 rounded-2xl h-12 shadow-sm focus-within:ring-2 focus-within:ring-[#0271BC]/20">
              <Search className="absolute left-4 w-5 h-5 text-gray-400" />
              <input
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder={t.search}
                className="w-full h-full bg-transparent border-none outline-none pl-12 pr-4 text-sm font-medium placeholder:text-gray-400"
              />
            </div>
            <button
              onClick={() => setShowFilters(true)}
              className="lg:hidden flex items-center justify-center gap-2 px-5 py-3 bg-white border border-black/10 rounded-2xl font-bold text-gray-700 shadow-sm">
              <SlidersHorizontal className="w-5 h-5" />
            </button>
          </div>
        </div>

        {showFilters && (
          <div className="fixed inset-0 z-[60] lg:hidden">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowFilters(false)} />
            <div className="absolute top-0 bottom-0 left-0 w-[85%] max-w-[340px] bg-white overflow-y-auto shadow-2xl p-4">
               {filterContent}
            </div>
          </div>
        )}

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1 flex flex-col lg:flex-row gap-8">
          <aside className="hidden lg:block w-[260px] shrink-0 sticky top-[88px] max-h-[calc(100vh-110px)] overflow-y-auto">
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-black/6 shadow-sm p-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0271BC]/10 to-[#1E90FF]/10 flex items-center justify-center">
                  <SlidersHorizontal className="w-5 h-5 text-[#0271BC]" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900">{t.filters}</h2>
                  <button onClick={reset} className="text-sm text-gray-500 hover:text-[#0271BC] hover:underline font-medium transition-colors text-left flex items-center gap-1">
                    <RefreshCw className="w-3 h-3" /> {t.reset}
                  </button>
                </div>
              </div>
              {filterContent}
            </div>
          </aside>

          <section className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm text-gray-500 font-medium">
                <span className="text-xl font-extrabold text-gray-900">{schemes.length}</span> {t.found}
              </p>
            </div>

            {anyF && (
              <div className="flex flex-wrap gap-2 mb-5">
                {selCat && <Chip label={CATEGORIES.find(c => c.key === selCat)?.names[lang] || selCat} onRemove={() => setSelCat('')} />}
                {selLevel && <Chip label={selLevel.charAt(0).toUpperCase() + selLevel.slice(1)} onRemove={() => setSelLevel("")} />}
                {selBenefit && <Chip label={selBenefit.charAt(0).toUpperCase() + selBenefit.slice(1)} onRemove={() => setSelBenefit("")} />}
                {dq && <Chip label={`"${dq}"`} onRemove={() => { setQuery(""); setDq(""); }} />}
              </div>
            )}

            <div className="flex flex-col gap-4">
              {loading ? (
                 <div className="flex items-center justify-center py-20">
                   <Loader2 className="w-8 h-8 text-[#0271BC] animate-spin" />
                 </div>
              ) : schemes.map((s) => <SchemeCard key={s.id} scheme={s} t={t} lang={lang} />)}
            </div>

            {!loading && pagination.totalPages > 1 && (
              <div className="mt-10 flex items-center justify-center gap-3">
                <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="px-4 py-2 border rounded-xl font-bold">Prev</button>
                <span className="text-sm font-bold">{page} / {pagination.totalPages}</span>
                <button onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))} disabled={page >= pagination.totalPages} className="px-4 py-2 border rounded-xl font-bold">Next</button>
              </div>
            )}
          </section>
        </div>
        <Footer lang={lang} />
        <YojnaSaathi />
      </div>
    </div>
  );
}

function SchemeCard({ scheme: s, t, lang = 'en' }) {
  const levelColor = s.level?.toLowerCase().includes('central')
    ? "bg-blue-50 text-blue-700 border-blue-100"
    : "bg-emerald-50 text-emerald-700 border-emerald-100";
    
  const displayLevel = s.level ? (lang === 'hi' ? (s.level.toLowerCase().includes('central') ? 'केंद्र' : 'राज्य') : s.level) : '';

  return (
    <article className="group p-5 md:p-6 rounded-2xl bg-white border border-black/6 shadow-sm hover:shadow-[0_8px_30px_rgba(59,130,246,0.12)] hover:-translate-y-0.5 hover:border-[#3B82F6]/20 transition-all duration-300 relative overflow-hidden">
      {/* Shimmer on hover */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-50/40 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out" />

      <div className="relative flex flex-col gap-3">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h3 className="text-base md:text-lg font-extrabold text-gray-900 leading-snug group-hover:text-[#2563EB] transition-colors duration-200">
              {s.title}
            </h3>
            {s.ministry && (
              <p className="text-xs text-gray-400 mt-1 font-semibold uppercase tracking-wide">{s.ministry}</p>
            )}
          </div>
          {s.level && (
            <span className={`shrink-0 text-[11px] px-2.5 py-1 rounded-full border font-bold ${levelColor}`}>
              {displayLevel}
            </span>
          )}
        </div>

        {/* Description */}
        {s.desc && (
          <p className="text-sm text-gray-500 leading-relaxed">{s.desc}</p>
        )}

        {/* Footer: tags + button */}
        <div className="flex flex-wrap items-center justify-between gap-3 mt-1">
          <div className="flex flex-wrap gap-1.5">
            {s.tags.map(t => (
              <span key={t} className="inline-flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-full bg-blue-50/80 text-[#3B82F6] border border-blue-100/80 font-bold">
                <Tag className="w-2.5 h-2.5" />{t}
              </span>
            ))}
            {s.benefitType && (
              <span className="text-[11px] px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-100 font-bold">
                {s.benefitType}
              </span>
            )}
          </div>
          <Link href={`/schemes/${s.id}`}
            className="shrink-0 inline-flex items-center gap-1.5 bg-gradient-to-r from-[#3B82F6] to-[#60A5FA] text-white px-4 py-2 rounded-full text-xs font-bold shadow-sm hover:shadow-md hover:scale-105 transition-all duration-200">
            {t.viewBtn} <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </article>
  );
}

function Chip({ label, onRemove }) {
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-50 text-[#3B82F6] border border-blue-100 text-xs font-bold">
      {label}
      <button onClick={onRemove} className="hover:text-red-500 transition-colors">
        <X className="w-3 h-3" />
      </button>
    </span>
  );
}
