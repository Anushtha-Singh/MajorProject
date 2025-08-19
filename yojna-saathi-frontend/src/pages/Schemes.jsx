import React, { useMemo, useState, useEffect, useRef } from "react";
import {
  Search,
  ChevronDown,
  ChevronRight,
  Globe,
  LogIn,
  Star,
  Filter,
  Check,
  Tag,
  HelpCircle,
  Sparkles,
  ArrowUpRight,
  Languages,
  SlidersHorizontal,
} from "lucide-react";

/**
 * Yojna Saathi – Browse Schemes
 * --------------------------------------------------------------------------
 * Single-file React App that renders a full "Browse Schemes" experience:
 * - Navbar with logo, language selector, and inline search
 * - Multilingual copy (English/Hindi) via a tiny in-file i18n object
 * - Left sidebar with collapsible filter sections (category, level, benefit type)
 * - Main area with result-summary, sort dropdown, and scheme cards
 * - Fully responsive, Tailwind-only styling with rounded UI
 * - Hardcoded demo data; replace with API integration later
 *
 * NOTE: Tailwind must already be configured in your project.
 *       Install icons:  npm i lucide-react
 */

export default function App() {
  /* ----------------------------- Minimal i18n ----------------------------- */
  const [lang, setLang] = useState("en"); // 'en' | 'hi'

  const t = useMemo(() => {
    const copy = {
      en: {
        brand: "Yojna Saathi",
        signIn: "Sign In",
        language: "English",
        searchPlaceholder: "Search schemes…",
        searchHint:
          'For an exact match, put words in quotes — e.g. "Scholarship".',
        resultPrefix: "We found",
        resultAvailable: "available schemes",
        resultFiltered: "matching your filters",
        edit: "Edit",
        saveProfile: "Save profile",
        sort: "Sort",
        sortRelevance: "Relevance",
        sortNewest: "Newest",
        sortOldest: "Oldest",
        sidebarTitle: "Filter By",
        reset: "Reset Filters",
        schemeCategory: "Scheme Category",
        level: "Level",
        benefitType: "Benefit Type",
        state: "State",
        central: "Central",
        cash: "Cash",
        composite: "Composite",
        other: "Other",
        chatbot: "Chat with Saathi",
        search: "Search",
        subline:
          "Discover, understand, and take the next step—right from your language.",
        source: "Ministry / Department",
        viewMore: "View details",
        tags: "Tags",
      },
      hi: {
        brand: "योजना साथी",
        signIn: "साइन इन",
        language: "हिंदी",
        searchPlaceholder: "योजनाएँ खोजें…",
        searchHint:
          'सटीक परिणाम हेतु शब्दों को उद्धरण में लिखें — जैसे "स्कॉलरशिप".',
        resultPrefix: "हमें मिले",
        resultAvailable: "उपलब्ध योजनाएँ",
        resultFiltered: "आपके फ़िल्टर से मेल",
        edit: "बदलें",
        saveProfile: "प्रोफ़ाइल सेव करें",
        sort: "क्रम",
        sortRelevance: "प्रासंगिक",
        sortNewest: "नवीनतम",
        sortOldest: "सबसे पुराने",
        sidebarTitle: "फ़िल्टर",
        reset: "रीसेट",
        schemeCategory: "योजना श्रेणी",
        level: "स्तर",
        benefitType: "लाभ का प्रकार",
        state: "राज्य",
        central: "केंद्र",
        cash: "नकद",
        composite: "समग्र",
        other: "अन्य",
        chatbot: "साथी से चैट करें",
        search: "खोजें",
        subline:
          "अपनी भाषा में योजना खोजें, समझें और आगे बढ़ें—सरल व सहज।",
        source: "मंत्रालय / विभाग",
        viewMore: "विस्तार देखें",
        tags: "टैग",
      },
    };
    return copy[lang];
  }, [lang]);

  /* ------------------------------ Demo dataset --------------------------- */
  // Categories with counts (from your message; trimmed to keep UI focused)
  const CATEGORY_DEFS = [
    { key: "agri", name: "Agriculture, Rural & Environment", count: 611 },
    { key: "bfsi", name: "Banking, Financial Services & Insurance", count: 273 },
    { key: "business", name: "Business & Entrepreneurship", count: 585 },
    { key: "education", name: "Education & Learning", count: 937 },
    { key: "health", name: "Health & Wellness", count: 219 },
    { key: "housing", name: "Housing & Shelter", count: 100 },
    { key: "safety", name: "Public Safety, Law & Justice", count: 11 },
    { key: "science", name: "Science, IT & Communications", count: 71 },
    { key: "skills", name: "Skills & Employment", count: 313 },
    { key: "social", name: "Social Welfare & Empowerment", count: 1377 },
    { key: "culture", name: "Sports & Culture", count: 187 },
    { key: "transport", name: "Transport & Infrastructure", count: 61 },
    { key: "tourism", name: "Travel & Tourism", count: 49 },
    { key: "utility", name: "Utility & Sanitation", count: 37 },
    { key: "women", name: "Women & Child", count: 397 },
  ];

  // Minimal hardcoded schemes to illustrate UI/filters.
  const ALL_SCHEMES = [
    {
      id: "1",
      title: "National Agriculture Support Program",
      ministry: "Ministry of Agriculture & Farmers Welfare",
      description:
        "Financial assistance and advisory for improving crop yield, irrigation support, and market linkages.",
      category: "agri",
      level: "central",
      benefitType: "cash",
      tags: ["Farmers", "Irrigation", "Subsidy"],
    },
    {
      id: "2",
      title: "Women Education Scholarship",
      ministry: "Department of Higher Education",
      description:
        "Merit-based scholarships to support higher studies for women students across accredited institutions.",
      category: "education",
      level: "state",
      benefitType: "cash",
      tags: ["Scholarship", "Women", "Merit"],
    },
    {
      id: "3",
      title: "Start-Up Capital Assistance",
      ministry: "Ministry of Commerce & Industry",
      description:
        "Seed funding and mentorship for early-stage startups, including subsidized incubation support.",
      category: "business",
      level: "central",
      benefitType: "composite",
      tags: ["Startup", "MSME", "Seed"],
    },
    {
      id: "4",
      title: "Rural Health Outreach",
      ministry: "Ministry of Health & Family Welfare",
      description:
        "Mobile health units and preventive checkups for rural households with referral services.",
      category: "health",
      level: "state",
      benefitType: "other",
      tags: ["Primary Care", "Rural", "Prevention"],
    },
    {
      id: "5",
      title: "Skill Boost Fellowship",
      ministry: "Ministry of Skill Development & Entrepreneurship",
      description:
        "Monthly stipend and placement guidance for youth enrolled in recognized skilling programs.",
      category: "skills",
      level: "central",
      benefitType: "cash",
      tags: ["Youth", "Skilling", "Fellowship"],
    },
    {
      id: "6",
      title: "Women & Child Nutrition Mission",
      ministry: "Ministry of Women & Child Development",
      description:
        "Nutritional kits and counseling to improve maternal and child health outcomes.",
      category: "women",
      level: "state",
      benefitType: "composite",
      tags: ["Nutrition", "Maternal", "Child"],
    },
  ];

  /* ------------------------------ UI state ------------------------------- */
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState({
    category: true,
    level: true,
    benefit: true,
  });
  const [selCategories, setSelCategories] = useState(new Set()); // keys from CATEGORY_DEFS
  const [selLevels, setSelLevels] = useState(new Set()); // 'state' | 'central'
  const [selBenefitTypes, setSelBenefitTypes] = useState(new Set()); // 'cash'|'composite'|'other'
  const [sort, setSort] = useState("relevance"); // relevance|newest|oldest (demo only)

  // NEW: language dropdown toggle + click-away/ESC close
  const [langOpen, setLangOpen] = useState(false);
  const langRef = useRef(null);
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

  const resetFilters = () => {
    setSelCategories(new Set());
    setSelLevels(new Set());
    setSelBenefitTypes(new Set());
    setQuery("");
    setSort("relevance");
  };

  const toggleSet = (set, value) => {
    const next = new Set(set);
    if (next.has(value)) next.delete(value);
    else next.add(value);
    return next;
  };

  /* ------------------------------ Filtering ------------------------------ */
  const results = useMemo(() => {
    let arr = [...ALL_SCHEMES];

    // search filter
    const q = query.trim().toLowerCase();
    if (q) {
      arr = arr.filter((s) => {
        const hay =
          `${s.title} ${s.ministry} ${s.description} ${s.tags.join(" ")}`.toLowerCase();
        return hay.includes(q);
      });
    }

    // category filter
    if (selCategories.size) {
      arr = arr.filter((s) => selCategories.has(s.category));
    }

    // level filter
    if (selLevels.size) {
      arr = arr.filter((s) => selLevels.has(s.level));
    }

    // benefit type filter
    if (selBenefitTypes.size) {
      arr = arr.filter((s) => selBenefitTypes.has(s.benefitType));
    }

    // sort (mock)
    if (sort === "newest") arr = arr.slice().reverse();
    if (sort === "oldest") arr = arr.slice(); // already "oldest" for demo

    return arr;
  }, [query, selCategories, selLevels, selBenefitTypes, sort]);

  const anyFiltersApplied =
    query.trim().length > 0 ||
    selCategories.size > 0 ||
    selLevels.size > 0 ||
    selBenefitTypes.size > 0;

  /* ------------------------------ Components ----------------------------- */
  const Section = ({ title, isOpen, onToggle, children }) => (
    <div className="border rounded-xl bg-white">
      <button
        className="w-full flex items-center justify-between px-4 py-3"
        onClick={onToggle}
      >
        <span className="font-medium">{title}</span>
        {isOpen ? (
          <ChevronDown className="w-4 h-4 opacity-70" />
        ) : (
          <ChevronRight className="w-4 h-4 opacity-70" />
        )}
      </button>
      {isOpen && <div className="px-3 pb-3">{children}</div>}
    </div>
  );

  const CheckboxRow = ({ checked, onChange, label, count }) => (
    <label className="flex items-center justify-between gap-3 px-2 py-2 rounded-lg hover:bg-gray-50 cursor-pointer">
      <div className="flex items-center gap-3">
        <span
          className={[
            "w-5 h-5 inline-flex items-center justify-center rounded border",
            checked ? "bg-blue-600 border-blue-600 text-white" : "bg-white",
          ].join(" ")}
        >
          {checked ? <Check className="w-4 h-4" /> : null}
        </span>
        <span className="text-sm">{label}</span>
      </div>
      {typeof count === "number" && (
        <span className="text-xs text-gray-500">{count}</span>
      )}
      <input
        type="checkbox"
        className="hidden"
        checked={checked}
        onChange={onChange}
      />
    </label>
  );

  const PrettyTag = ({ children }) => (
    <span className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-100">
      <Tag className="w-3 h-3" />
      {children}
    </span>
  );

  /* --------------------------------- UI ---------------------------------- */
  return (
    <div className="min-h-screen bg-[#faf7f2] text-gray-900">
      {/* NAVBAR */}
      <header className="bg-white/90 backdrop-blur sticky top-0 z-40 border-b">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-[#0271BC]" />
            <span className="text-xl md:text-2xl font-bold text-[#0271BC]">
              {t.brand}
            </span>
          </div>

          {/* inline search in navbar */}
          <div className="flex-1 hidden md:flex">
            <form
              className="w-full max-w-xl ml-6 flex items-center rounded-full bg-gray-100 px-3 py-2"
              onSubmit={(e) => e.preventDefault()}
            >
              <Search className="w-5 h-5 text-gray-500" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
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

          {/* actions */}
          <div className="ml-auto flex items-center gap-2">
            <button className="hidden sm:inline-flex items-center gap-2 rounded-full bg-[#0271BC] text-white text-sm px-4 py-2">
              <LogIn className="w-4 h-4" />
              {t.signIn}
              <ArrowUpRight className="w-4 h-4" />
            </button>

            {/* language switcher (toggle + click-away) */}
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

            <button className="hidden sm:inline-flex items-center gap-2 rounded-full bg-gray-100 px-3 py-2">
              <Star className="w-4 h-4" />
              <span className="text-sm">Saved</span>
            </button>
          </div>
        </div>

        {/* mobile search */}
        <div className="px-4 pb-3 md:hidden">
          <form
            className="flex items-center rounded-full bg-gray-100 px-3 py-2"
            onSubmit={(e) => e.preventDefault()}
          >
            <Search className="w-5 h-5 text-gray-500" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
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

      {/* PAGE CONTENT */}
      <main className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT SIDEBAR: FILTERS */}
        <aside className="lg:col-span-4 xl:col-span-3 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-[#0271BC]" />
              <h2 className="font-semibold">{t.sidebarTitle}</h2>
            </div>
            <button
              className="text-sm text-[#0271BC] hover:underline"
              onClick={resetFilters}
            >
              {t.reset}
            </button>
          </div>

          {/* Category */}
          <Section
            title={t.schemeCategory}
            isOpen={open.category}
            onToggle={() => setOpen((o) => ({ ...o, category: !o.category }))}
          >
            <div className="max-h-64 overflow-auto pr-1">
              {CATEGORY_DEFS.map((c) => (
                <CheckboxRow
                  key={c.key}
                  label={c.name}
                  count={c.count}
                  checked={selCategories.has(c.key)}
                  onChange={() =>
                    setSelCategories((s) => toggleSet(s, c.key))
                  }
                />
              ))}
            </div>
          </Section>

          {/* Level */}
          <Section
            title={t.level}
            isOpen={open.level}
            onToggle={() => setOpen((o) => ({ ...o, level: !o.level }))}
          >
            <div className="space-y-1">
              {[
                { key: "state", label: t.state },
                { key: "central", label: t.central },
              ].map((opt) => (
                <CheckboxRow
                  key={opt.key}
                  label={opt.label}
                  checked={selLevels.has(opt.key)}
                  onChange={() => setSelLevels((s) => toggleSet(s, opt.key))}
                />
              ))}
            </div>
          </Section>

          {/* Benefit Type */}
          <Section
            title={t.benefitType}
            isOpen={open.benefit}
            onToggle={() => setOpen((o) => ({ ...o, benefit: !o.benefit }))}
          >
            <div className="space-y-1">
              {[
                { key: "cash", label: t.cash },
                { key: "composite", label: t.composite },
                { key: "other", label: t.other },
              ].map((opt) => (
                <CheckboxRow
                  key={opt.key}
                  label={opt.label}
                  checked={selBenefitTypes.has(opt.key)}
                  onChange={() =>
                    setSelBenefitTypes((s) => toggleSet(s, opt.key))
                  }
                />
              ))}
            </div>
          </Section>

          {/* Chatbot CTA */}
          <div className="rounded-2xl p-4 bg-[#1E90FF] text-white space-y-2 shadow">
            <div className="flex items-center gap-2">
              <Languages className="w-5 h-5" />
              <h3 className="font-semibold">Multilingual Assistant</h3>
            </div>
            <p className="text-sm opacity-90">
              Get guidance in your regional language. Ask anything about
              eligibility, documents, or how to apply.
            </p>
            <button className="w-full mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-white text-[#1E90FF] px-4 py-2">
              <HelpCircle className="w-4 h-4" />
              {t.chatbot}
            </button>
          </div>
        </aside>

        {/* RIGHT: RESULTS */}
        <section className="lg:col-span-8 xl:col-span-9 space-y-4">
          {/* search hint */}
          <p className="text-xs text-gray-500">{t.searchHint}</p>

          {/* summary + sort */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
            <div className="text-sm">
              <span className="font-medium">
                {t.resultPrefix} {results.length}
              </span>{" "}
              {anyFiltersApplied ? t.resultFiltered : t.resultAvailable}
              <button className="ml-3 text-[#0271BC] hover:underline cursor-pointer">
                {t.edit}
              </button>
              <button className="ml-3 text-[#0271BC] hover:underline cursor-pointer">
                {t.saveProfile}
              </button>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">{t.sort}:</span>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="text-sm border rounded-lg px-2 py-1 bg-white"
              >
                <option value="relevance">{t.sortRelevance}</option>
                <option value="newest">{t.sortNewest}</option>
                <option value="oldest">{t.sortOldest}</option>
              </select>
            </div>
          </div>

          {/* scheme cards */}
          <div className="space-y-3" id="scheme-results">
            {results.map((s) => (
              <article
                key={s.id}
                className="rounded-2xl bg-white p-4 md:p-5 border shadow-sm"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h3 className="text-lg md:text-xl font-semibold">
                      {s.title}
                    </h3>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">{t.source}:</span>{" "}
                      {s.ministry}
                    </p>
                  </div>
                  <button className="inline-flex items-center gap-1 rounded-full bg-[#0271BC] text-white text-sm px-3 py-1.5">
                    {t.viewMore}
                    <ArrowUpRight className="w-4 h-4" />
                  </button>
                </div>

                <p className="mt-3 text-gray-700">{s.description}</p>

                <div className="mt-3 flex flex-wrap items-center gap-2">
                  {s.tags.map((tg) => (
                    <PrettyTag key={tg}>{tg}</PrettyTag>
                  ))}
                </div>

                <div className="mt-4 flex flex-wrap gap-2 text-xs text-gray-600">
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-gray-100">
                    <Filter className="w-3 h-3" />
                    {
                      CATEGORY_DEFS.find((c) => c.key === s.category)?.name ??
                      "Category"
                    }
                  </span>
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-gray-100 capitalize">
                    <Filter className="w-3 h-3" />
                    {s.level}
                  </span>
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-gray-100 capitalize">
                    <Filter className="w-3 h-3" />
                    {s.benefitType}
                  </span>
                </div>
              </article>
            ))}

            {results.length === 0 && (
              <div className="rounded-2xl bg-white p-6 border text-center text-gray-600">
                No schemes match your current filters.
              </div>
            )}
          </div>
        </section>
      </main>

      {/* FOOTER (simple) */}
      <footer className="border-t bg-white">
        <div className="max-w-7xl mx-auto px-4 py-6 text-sm flex flex-col md:flex-row items-center justify-between gap-2">
          <p className="text-gray-600">
            © {new Date().getFullYear()} {t.brand}. Made for citizens—multilingual and accessible.
          </p>
          <div className="flex items-center gap-3 text-gray-600">
            <a className="hover:text-[#0271BC]" href="#">Privacy</a>
            <a className="hover:text-[#0271BC]" href="#">Terms</a>
            <a className="hover:text-[#0271BC]" href="#">Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
