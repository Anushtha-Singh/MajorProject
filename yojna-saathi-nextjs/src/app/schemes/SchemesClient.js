'use client';

import { useMemo, useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, SlidersHorizontal, ChevronDown, ChevronRight, Loader2, ArrowRight, Tag, X, Filter, Sparkles } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import YojnaSaathi from "@/components/YojnaSaathi";

const CATS = [
  { key: "social",    name: "Social Welfare & Empowerment" },
  { key: "education", name: "Education & Learning" },
  { key: "women",     name: "Women & Child" },
  { key: "health",    name: "Health & Wellness" },
  { key: "agri",      name: "Agriculture" },
  { key: "business",  name: "Business & Entrepreneurship" },
  { key: "skills",    name: "Skills & Employment" },
  { key: "housing",   name: "Housing" },
  { key: "bfsi",      name: "Banking & Finance" },
  { key: "science",   name: "Science & IT" },
];

const LEVEL_COLORS = {
  central: "bg-blue-50 text-blue-700 border-blue-100",
  state: "bg-emerald-50 text-emerald-700 border-emerald-100",
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
    if (catFromUrl && CATS.find(c => c.key === catFromUrl)) {
      setSelCat(catFromUrl); setQuery(""); setSelLevel(""); setSelBenefit("");
    }
  }, [searchParams]);

  useEffect(() => { const t = setTimeout(() => { setDq(query); setPage(1); }, 400); return () => clearTimeout(t); }, [query]);

  const load = async (pageNum = page) => {
    try {
      setLoading(true); setError(null);
      const p = new URLSearchParams({ page: pageNum.toString(), limit: '20' });
      if (dq.trim()) p.set('search', dq.trim());
      if (selCat) { const c = CATS.find(x => x.key === selCat); if (c) p.set('category', c.name); }
      if (selLevel) p.set('level', selLevel);
      if (selBenefit) p.set('benefitType', selBenefit);
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
  useEffect(() => { load(page); }, [dq, selCat, selLevel, selBenefit, page]);

  const reset = () => { setSelCat(""); setSelLevel(""); setSelBenefit(""); setQuery(""); setPage(1); };
  const anyF = dq || selCat || selLevel || selBenefit;
  const activeFilterCount = [selCat, selLevel, selBenefit, dq].filter(Boolean).length;

  const Section = ({ title, open, onToggle, children }) => (
    <div className="mb-1">
      <button onClick={onToggle}
        className="w-full text-left px-3 py-2.5 flex items-center justify-between text-sm font-bold text-gray-700 hover:text-[#3B82F6] transition-colors rounded-xl hover:bg-blue-50/50">
        {title}
        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && <div className="px-1 pb-2 pt-0.5">{children}</div>}
    </div>
  );

  const Radio = ({ checked, label, onChange }) => (
    <label
      className={`flex items-center gap-2.5 px-3 py-2 rounded-xl cursor-pointer text-sm transition-all duration-150 ${checked ? 'text-[#3B82F6] font-bold bg-blue-50 ring-1 ring-blue-100' : 'text-gray-600 hover:bg-gray-50 font-medium'}`}
      onClick={onChange}>
      <span className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${checked ? 'border-[#3B82F6] bg-[#3B82F6]' : 'border-gray-300 bg-white'}`}>
        {checked && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
      </span>
      <span className="truncate">{label}</span>
    </label>
  );

  const filterContent = (
    <div className="space-y-1">
      {anyF && (
        <button onClick={reset}
          className="w-full text-sm font-bold text-[#3B82F6] mb-3 px-3 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 transition-colors flex items-center gap-2">
          <X className="w-3.5 h-3.5" /> Clear all filters
        </button>
      )}
      <Section title="Category" open={openSections.cat} onToggle={() => setOpenSections(p => ({ ...p, cat: !p.cat }))}>
        <div className="max-h-64 overflow-y-auto space-y-0.5 pr-1 hide-scrollbar">
          {CATS.map(c => <Radio key={c.key} label={c.name} checked={selCat === c.key} onChange={() => setSelCat(selCat === c.key ? "" : c.key)} />)}
        </div>
      </Section>
      <div className="h-px bg-black/5 mx-3 my-2" />
      <Section title="Level" open={openSections.level} onToggle={() => setOpenSections(p => ({ ...p, level: !p.level }))}>
        <div className="space-y-0.5">
          <Radio label="State" checked={selLevel === 'state'} onChange={() => setSelLevel(selLevel === 'state' ? '' : 'state')} />
          <Radio label="Central" checked={selLevel === 'central'} onChange={() => setSelLevel(selLevel === 'central' ? '' : 'central')} />
        </div>
      </Section>
      <div className="h-px bg-black/5 mx-3 my-2" />
      <Section title="Benefit Type" open={openSections.benefit} onToggle={() => setOpenSections(p => ({ ...p, benefit: !p.benefit }))}>
        <div className="space-y-0.5">
          {['cash', 'composite', 'other'].map(v => (
            <Radio key={v} label={v.charAt(0).toUpperCase() + v.slice(1)} checked={selBenefit === v} onChange={() => setSelBenefit(selBenefit === v ? '' : v)} />
          ))}
        </div>
      </Section>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-white relative overflow-hidden">
      {/* Blurry blue ambient blobs */}
      <div className="pointer-events-none select-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full bg-[#3B82F6]/12 blur-[110px]" />
        <div className="absolute top-[40%] -right-40 w-[400px] h-[400px] rounded-full bg-[#60A5FA]/10 blur-[120px]" />
        <div className="absolute bottom-0 left-[25%] w-[350px] h-[350px] rounded-full bg-[#93C5FD]/10 blur-[100px]" />
      </div>

      <div className="relative z-10 flex flex-col flex-1">
        <Navbar lang={lang} setLang={setLang} />

        {/* ── Search Bar ── */}
        <div className="sticky top-16 z-30 pt-4 pb-2 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto flex items-center gap-3">
            <div className="flex-1 flex items-center gap-3 bg-white border border-black/8 rounded-2xl px-4 h-12 shadow-sm hover:shadow-md hover:border-[#3B82F6]/30 transition-all duration-200">
              <Search className="w-4 h-4 text-gray-400 shrink-0" />
              <input
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder={lang === 'en' ? 'Search schemes by name or keyword…' : 'योजनाएँ खोजें…'}
                className="flex-1 bg-transparent border-none outline-none text-sm font-medium placeholder:text-gray-400 placeholder:font-normal"
              />
              {query && (
                <button onClick={() => setQuery("")} className="p-1 hover:bg-gray-100 rounded-full transition-colors">
                  <X className="w-3.5 h-3.5 text-gray-400" />
                </button>
              )}
            </div>
            <button
              onClick={() => setShowFilters(true)}
              className="lg:hidden relative flex items-center justify-center gap-2 px-4 h-12 rounded-2xl border border-black/8 bg-white text-gray-700 font-bold text-sm shadow-sm hover:bg-gray-50 transition-all">
              <Filter className="w-4 h-4" />
              <span className="hidden sm:inline">Filters</span>
              {activeFilterCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-[#3B82F6] text-white text-[10px] font-bold flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* ── Mobile Filter Overlay ── */}
        {showFilters && (
          <div className="fixed inset-0 z-[60] lg:hidden">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowFilters(false)} />
            <div className="absolute top-0 bottom-0 left-0 w-[85%] max-w-[340px] bg-white overflow-y-auto shadow-2xl">
              <div className="flex items-center justify-between p-5 border-b border-black/5 bg-white sticky top-0 z-10">
                <span className="font-extrabold text-lg text-gray-900 flex items-center gap-2">
                  <Filter className="w-4 h-4 text-[#3B82F6]" /> Filters
                </span>
                <button onClick={() => setShowFilters(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
              <div className="p-4">{filterContent}</div>
            </div>
          </div>
        )}

        {/* ── Layout ── */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1 flex flex-col lg:flex-row gap-8">

          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-[260px] shrink-0 sticky top-[88px] max-h-[calc(100vh-110px)] overflow-y-auto hide-scrollbar">
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-black/6 shadow-sm p-4">
              <div className="flex items-center justify-between mb-4 px-1">
                <span className="font-extrabold text-base text-gray-900 flex items-center gap-2">
                  <Filter className="w-4 h-4 text-[#3B82F6]" /> Filters
                </span>
                {anyF && (
                  <button onClick={reset} className="text-xs font-bold text-[#3B82F6] hover:underline">
                    Reset all
                  </button>
                )}
              </div>
              {filterContent}
            </div>
          </aside>

          {/* Results */}
          <section className="flex-1 min-w-0">
            {/* Results header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-sm text-gray-500 font-medium">
                  <span className="text-xl font-extrabold text-gray-900">{pagination.total?.toLocaleString()}</span>
                  {' '}schemes found{anyF ? <span className="text-[#3B82F6] font-semibold"> · filtered</span> : ''}
                </p>
              </div>
              {anyF && (
                <button onClick={reset} className="hidden sm:flex items-center gap-1.5 text-sm font-bold text-gray-500 hover:text-red-500 transition-colors">
                  <X className="w-3.5 h-3.5" /> Clear filters
                </button>
              )}
            </div>

            {/* Active filter chips */}
            {anyF && (
              <div className="flex flex-wrap gap-2 mb-5">
                {selCat && <Chip label={CATS.find(c => c.key === selCat)?.name} onRemove={() => setSelCat("")} />}
                {selLevel && <Chip label={selLevel.charAt(0).toUpperCase() + selLevel.slice(1)} onRemove={() => setSelLevel("")} />}
                {selBenefit && <Chip label={selBenefit.charAt(0).toUpperCase() + selBenefit.slice(1)} onRemove={() => setSelBenefit("")} />}
                {dq && <Chip label={`"${dq}"`} onRemove={() => { setQuery(""); setDq(""); }} />}
              </div>
            )}

            <div className="flex flex-col gap-4">
              {loading && (
                <div className="flex flex-col items-center justify-center py-20 gap-4 text-gray-400">
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center">
                    <Loader2 className="w-6 h-6 text-[#3B82F6] animate-spin" />
                  </div>
                  <span className="text-sm font-medium">Loading schemes…</span>
                </div>
              )}
              {error && (
                <div className="p-6 text-center bg-red-50 border border-red-100 rounded-2xl text-red-600 text-sm font-medium">
                  {error}
                  <br />
                  <button onClick={load} className="mt-3 text-red-700 font-bold underline">Retry</button>
                </div>
              )}

              {!loading && !error && schemes.map((s) => (
                <SchemeCard key={s.id} scheme={s} onClick={() => router.push(`/schemes/${s.id}`)} />
              ))}

              {!loading && !error && schemes.length === 0 && (
                <div className="flex flex-col items-center py-20 gap-4 text-gray-400">
                  <div className="text-5xl">🔍</div>
                  <p className="font-bold text-gray-600 text-lg">No schemes found</p>
                  <p className="text-sm text-center max-w-xs">Try adjusting your filters or search query</p>
                  <button onClick={reset} className="mt-2 px-6 py-2.5 rounded-full bg-[#3B82F6] text-white text-sm font-bold hover:bg-[#2563EB] transition-colors">
                    Clear all filters
                  </button>
                </div>
              )}
            </div>

            {/* Pagination */}
            {!loading && !error && pagination.totalPages > 1 && (
              <div className="mt-10 flex items-center justify-center gap-3">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-5 py-2.5 rounded-xl border border-black/8 bg-white text-sm font-bold text-gray-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 hover:shadow-sm transition-all shadow-sm">
                  ← Previous
                </button>
                <span className="text-sm font-bold text-gray-500 px-2">
                  Page <span className="text-gray-900">{page}</span> of <span className="text-gray-900">{pagination.totalPages}</span>
                </span>
                <button
                  onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))}
                  disabled={page >= pagination.totalPages}
                  className="px-5 py-2.5 rounded-xl border border-black/8 bg-white text-sm font-bold text-gray-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 hover:shadow-sm transition-all shadow-sm">
                  Next →
                </button>
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

function SchemeCard({ scheme: s, onClick }) {
  const levelColor = s.level?.toLowerCase().includes('central')
    ? "bg-blue-50 text-blue-700 border-blue-100"
    : "bg-emerald-50 text-emerald-700 border-emerald-100";

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
              {s.level}
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
          <button
            onClick={onClick}
            className="shrink-0 inline-flex items-center gap-1.5 bg-gradient-to-r from-[#3B82F6] to-[#60A5FA] text-white px-4 py-2 rounded-full text-xs font-bold shadow-sm hover:shadow-md hover:scale-105 transition-all duration-200">
            View details <ArrowRight className="w-3.5 h-3.5" />
          </button>
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
