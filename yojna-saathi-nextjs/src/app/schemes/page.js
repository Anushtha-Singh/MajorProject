'use client';

import { useMemo, useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, SlidersHorizontal, ChevronDown, ChevronRight, Loader2, ArrowRight, Tag, X } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import YojnaSaathi from "@/components/YojnaSaathi";

const CATS = [
  { key: "social", name: "Social Welfare & Empowerment" },
  { key: "education", name: "Education & Learning" },
  { key: "women", name: "Women & Child" },
  { key: "health", name: "Health & Wellness" },
  { key: "agri", name: "Agriculture" },
  { key: "business", name: "Business & Entrepreneurship" },
  { key: "skills", name: "Skills & Employment" },
  { key: "housing", name: "Housing" },
  { key: "bfsi", name: "Banking & Finance" },
  { key: "science", name: "Science & IT" },
];

const parseJson = (f) => { if (!f) return []; if (Array.isArray(f)) return f; try { return JSON.parse(f); } catch { const m = []; const p = /'([^']*(?:''[^']*)*)'/g; let x; while ((x = p.exec(f)) !== null) m.push(x[1].replace(/''/g, "'")); return m.length > 0 ? m : [f]; } };

function SchemesContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [lang, setLang] = useState("en");
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
  const [openSections, setOpenSections] = useState({ cat: true, level: false, benefit: false });

  const [page, setPage] = useState(1);

  // Read category from URL query params (from homepage category cards)
  useEffect(() => {
    const catFromUrl = searchParams.get('cat');
    if (catFromUrl && CATS.find(c => c.key === catFromUrl)) {
      setSelCat(catFromUrl);
      setQuery(""); 
      setSelLevel("");
      setSelBenefit("");
    }
  }, [searchParams]);

  useEffect(() => { const t = setTimeout(() => { setDq(query); setPage(1); }, 400); return () => clearTimeout(t); }, [query]);

  const load = async (pageNum = page) => {
    try { setLoading(true); setError(null);
      const p = new URLSearchParams({ page: pageNum.toString(), limit: '20' });
      if (dq.trim()) p.set('search', dq.trim());
      if (selCat) { const c = CATS.find(x => x.key === selCat); if (c) p.set('category', c.name); }
      if (selLevel) p.set('level', selLevel);
      if (selBenefit) p.set('benefitType', selBenefit);
      const r = await fetch(`/api/schemes?${p}`); if (!r.ok) throw new Error(`Error ${r.status}`);
      const d = await r.json();
      setSchemes(d.data.map(s => ({ id: s.id, title: s["Scheme Title"] || 'Untitled', ministry: s["Department/State"] || '', desc: s.Details ? (s.Details.length > 160 ? s.Details.substring(0, 160) + '…' : s.Details) : '', level: s.Level || '', benefitType: s["Benefit Type"] || '', tags: parseJson(s.Tags).slice(0, 3) })));
      setPagination({ total: d.total, totalPages: d.totalPages });
    } catch (e) { setError(e.message); } finally { setLoading(false); }
  };

  useEffect(() => { setPage(1); }, [selCat, selLevel, selBenefit]);
  useEffect(() => { load(page); }, [dq, selCat, selLevel, selBenefit, page]);

  const reset = () => { setSelCat(""); setSelLevel(""); setSelBenefit(""); setQuery(""); setPage(1); };
  const anyF = dq || selCat || selLevel || selBenefit;

  const Section = ({ title, open, onToggle, children }) => (
    <div className="rounded-xl border border-black/5 bg-white/60 overflow-hidden mb-2">
      <button onClick={onToggle} className="w-full text-left px-4 py-3 bg-transparent flex items-center justify-between text-sm font-bold text-gray-700">
        {title}
        {open ? <ChevronDown className="w-4 h-4 text-gray-400" /> : <ChevronRight className="w-4 h-4 text-gray-400" />}
      </button>
      {open && <div className="px-3 pb-3 pt-1">{children}</div>}
    </div>
  );

  const Radio = ({ checked, label, onChange }) => (
    <label className={`flex items-center gap-3 px-2 py-2 rounded-lg cursor-pointer text-sm transition-colors ${checked ? 'text-[#0271BC] font-bold bg-blue-50/50' : 'text-gray-600 hover:bg-gray-50 font-medium'}`} onClick={onChange}>
      <span className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${checked ? 'border-[#0271BC] bg-[#0271BC]' : 'border-gray-300 bg-white'}`}>
        {checked && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
      </span>
      {label}
    </label>
  );

  const filterContent = (
    <div>
      {anyF && <button onClick={() => { reset(); setShowFilters(false); }} className="text-sm font-bold text-[#0271BC] mb-3 hover:underline">Reset filters</button>}
      <Section title={lang === 'en' ? 'Category' : 'श्रेणी'} open={openSections.cat} onToggle={() => setOpenSections(p => ({ ...p, cat: !p.cat }))}>
        <div className="max-h-56 overflow-y-auto">
          {CATS.map(c => <Radio key={c.key} label={c.name} checked={selCat === c.key} onChange={() => setSelCat(selCat === c.key ? "" : c.key)} />)}
        </div>
      </Section>
      <Section title={lang === 'en' ? 'Level' : 'स्तर'} open={openSections.level} onToggle={() => setOpenSections(p => ({ ...p, level: !p.level }))}>
        <Radio label={lang === 'en' ? 'State' : 'राज्य'} checked={selLevel === 'state'} onChange={() => setSelLevel(selLevel === 'state' ? '' : 'state')} />
        <Radio label={lang === 'en' ? 'Central' : 'केंद्र'} checked={selLevel === 'central'} onChange={() => setSelLevel(selLevel === 'central' ? '' : 'central')} />
      </Section>
      <Section title={lang === 'en' ? 'Benefit Type' : 'लाभ'} open={openSections.benefit} onToggle={() => setOpenSections(p => ({ ...p, benefit: !p.benefit }))}>
        {['cash', 'composite', 'other'].map(v => <Radio key={v} label={v.charAt(0).toUpperCase() + v.slice(1)} checked={selBenefit === v} onChange={() => setSelBenefit(selBenefit === v ? '' : v)} />)}
      </Section>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-[#faf7f2]">
      <Navbar lang={lang} setLang={setLang} />

      {/* Search Bar */}
      <div className="border-b border-black/5 bg-white/60 sticky top-16 z-30 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3 md:py-4 flex items-center gap-3">
          <div className="flex-1 flex items-center gap-2.5 bg-white border border-black/10 rounded-xl px-4 h-11 md:h-12 shadow-sm">
            <Search className="w-5 h-5 text-gray-400 shrink-0" />
            <input value={query} onChange={e => setQuery(e.target.value)} placeholder={lang === 'en' ? 'Search schemes by name or keyword…' : 'योजनाएँ खोजें…'}
              className="flex-1 bg-transparent border-none outline-none text-sm md:text-base font-medium placeholder:text-gray-400 placeholder:font-normal" />
            {query && <button onClick={() => setQuery("")} className="p-1 hover:bg-gray-100 rounded-full"><X className="w-4 h-4 text-gray-400" /></button>}
          </div>
          <button onClick={() => setShowFilters(true)} className="lg:hidden flex items-center justify-center gap-2 px-4 h-11 md:h-12 rounded-xl border border-black/10 bg-white text-gray-700 font-bold text-sm shadow-sm hover:bg-gray-50">
            <SlidersHorizontal className="w-4 h-4" />
            <span className="hidden sm:inline">Filters</span>
          </button>
        </div>
      </div>

      {/* Mobile Filter Overlay */}
      {showFilters && (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowFilters(false)} />
          <div className="absolute top-0 bottom-0 left-0 w-[85%] max-w-[360px] bg-[#faf7f2] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between p-4 sm:p-5 border-b border-black/5 bg-white sticky top-0 z-10">
              <span className="font-extrabold text-lg text-gray-900">Filters</span>
              <button onClick={() => setShowFilters(false)} className="p-2 hover:bg-gray-100 rounded-full"><X className="w-5 h-5 text-gray-500" /></button>
            </div>
            <div className="p-4 sm:p-5">{filterContent}</div>
          </div>
        </div>
      )}

      {/* Layout */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8 w-full flex-1 flex flex-col lg:flex-row gap-6 lg:gap-8">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:block w-[280px] shrink-0 sticky top-[120px] max-h-[calc(100vh-140px)] overflow-y-auto pr-2">
          <div className="flex items-center justify-between mb-4">
            <span className="font-extrabold text-lg text-gray-900">Filters</span>
            {anyF && <button onClick={reset} className="text-sm font-bold text-[#0271BC] hover:underline">Reset</button>}
          </div>
          {filterContent}
        </aside>

        {/* Results */}
        <section className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-4 md:mb-6">
            <p className="text-sm md:text-base text-gray-500 font-medium"><span className="font-extrabold text-gray-900">Found {pagination.total}</span> schemes{anyF ? ' · filtered' : ''}</p>
          </div>
          
          <div className="flex flex-col gap-4">
            {loading && <div className="flex items-center justify-center p-12 gap-3 text-gray-500"><Loader2 className="w-5 h-5 text-[#0271BC] animate-spin" /><span className="font-medium text-sm">Loading schemes…</span></div>}
            {error && <div className="p-6 text-center bg-red-50 border border-red-200 rounded-2xl text-red-600 text-sm font-medium">{error}<br/><button onClick={load} className="mt-3 text-red-700 font-bold underline">Retry</button></div>}
            {!loading && !error && schemes.map((s) => (
              <article key={s.id} className="p-5 md:p-6 rounded-2xl bg-white/80 border border-black/5 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex flex-col gap-3">
                  <div>
                    <h3 className="text-lg md:text-xl font-extrabold text-gray-900 leading-tight">{s.title}</h3>
                    <p className="text-sm text-gray-500 mt-1 font-semibold">{s.ministry}</p>
                  </div>
                  {s.desc && <p className="text-sm md:text-[15px] text-gray-600 leading-relaxed font-medium">{s.desc}</p>}
                  <div className="flex flex-wrap gap-2 items-center mt-1">
                    {s.tags.map(t => (
                      <span key={t} className="inline-flex items-center gap-1.5 text-xs px-3 py-1 rounded-full bg-blue-50 text-[#0271BC] border border-blue-100 font-bold">
                        <Tag className="w-3 h-3" />{t}
                      </span>
                    ))}
                    {s.level && <span className="text-xs px-3 py-1 rounded-full bg-gray-100 border border-black/5 text-gray-600 font-bold">{s.level}</span>}
                  </div>
                  <button onClick={() => router.push(`/schemes/${s.id}`)} 
                    className="self-start mt-2 inline-flex items-center gap-2 bg-gradient-to-r from-[#0271BC] to-[#1E90FF] text-white px-5 py-2.5 rounded-full text-sm font-bold shadow-sm hover:shadow-md transition-all">
                    View details<ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </article>
            ))}
            {!loading && !error && schemes.length === 0 && (
              <div className="p-12 text-center text-gray-500">
                <p className="font-bold">No schemes found.</p>
                <button onClick={reset} className="mt-3 text-[#0271BC] font-bold hover:underline">Clear all filters</button>
              </div>
            )}
          </div>

          {/* Pagination Controls */}
          {!loading && !error && pagination.totalPages > 1 && (
            <div className="mt-8 flex items-center justify-center gap-2">
              <button 
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 rounded-xl border border-black/10 bg-white text-sm font-bold text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors shadow-sm"
              >
                Previous
              </button>
              <span className="text-sm font-bold text-gray-500 px-4">
                Page {page} of {pagination.totalPages}
              </span>
              <button 
                onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))}
                disabled={page >= pagination.totalPages}
                className="px-4 py-2 rounded-xl border border-black/10 bg-white text-sm font-bold text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors shadow-sm"
              >
                Next
              </button>
            </div>
          )}
        </section>
      </div>

      <Footer lang={lang} />
      <YojnaSaathi />
    </div>
  );
}

export default function SchemesPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-[#faf7f2]"><Loader2 className="w-8 h-8 text-[#0271BC] animate-spin" /></div>}>
      <SchemesContent />
    </Suspense>
  );
}

