import React, { useMemo, useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Filter,
  Check,
  Tag,
  HelpCircle,
  ArrowUpRight,
  Languages,
  SlidersHorizontal,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import Navbar from "../components/Navbar";
// API functions - using backend directly
const API_BASE_URL = 'https://yojana-saathi-backend.onrender.com/api';

const fetchSchemes = async (page = 1, limit = 20, filters = {}) => {
  try {
    let url;
    
    // If there's a search query, use the dedicated search endpoint
    if (filters.search && filters.search.trim()) {
      const params = new URLSearchParams({
        q: filters.search.trim(),
        page: page.toString(),
        limit: limit.toString()
      });
      url = `${API_BASE_URL}/search?${params}`;
    } else {
      // For filtering without search, use the main endpoint
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...filters
      });
      url = `${API_BASE_URL}/?${params}`;
    }
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching schemes:', error);
    throw error;
  }
};

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
  const navigate = useNavigate();
  
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

  /* ------------------------------ API Data Management --------------------------- */
  // Categories with real counts from database
  const [categoryCounts, setCategoryCounts] = useState({});
  
  // Default category definitions (will be updated with real counts)
  const CATEGORY_DEFS = [
    { key: "agri", name: "Agriculture, Rural & Environment", count: categoryCounts["Agriculture, Rural & Environment"] || 0 },
    { key: "bfsi", name: "Banking, Financial Services & Insurance", count: categoryCounts["Banking, Financial Services & Insurance"] || 0 },
    { key: "business", name: "Business & Entrepreneurship", count: categoryCounts["Business & Entrepreneurship"] || 0 },
    { key: "education", name: "Education & Learning", count: categoryCounts["Education & Learning"] || 0 },
    { key: "health", name: "Health & Wellness", count: categoryCounts["Health & Wellness"] || 0 },
    { key: "housing", name: "Housing & Shelter", count: categoryCounts["Housing & Shelter"] || 0 },
    { key: "safety", name: "Public Safety, Law & Justice", count: categoryCounts["Public Safety, Law & Justice"] || 0 },
    { key: "science", name: "Science, IT & Communications", count: categoryCounts["Science, IT & Communications"] || 0 },
    { key: "skills", name: "Skills & Employment", count: categoryCounts["Skills & Employment"] || 0 },
    { key: "social", name: "Social Welfare & Empowerment", count: categoryCounts["Social Welfare & Empowerment"] || 0 },
    { key: "culture", name: "Sports & Culture", count: categoryCounts["Sports & Culture"] || 0 },
    { key: "transport", name: "Transport & Infrastructure", count: categoryCounts["Transport & Infrastructure"] || 0 },
    { key: "tourism", name: "Travel & Tourism", count: categoryCounts["Travel & Tourism"] || 0 },
    { key: "utility", name: "Utility & Sanitation", count: categoryCounts["Utility & Sanitation"] || 0 },
    { key: "women", name: "Women & Child", count: categoryCounts["Women & Child"] || 0 },
  ];

  // State for API data
  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
    results: 0
  });

  // Parse JSON strings from the API (same logic as SchemeDetails)
  const parseJsonField = (field) => {
    if (!field) return [];
    if (Array.isArray(field)) return field;
    
    // Handle string format where items are wrapped in single quotes and separated by commas
    if (typeof field === 'string') {
      try {
        // First try standard JSON parsing
        return JSON.parse(field);
      } catch (e) {
        // If JSON parsing fails, try to parse the single-quoted format
        // This handles cases like: "['item1', 'item2, with comma', 'item3']"
        const singleQuotePattern = /'([^']*(?:''[^']*)*)'/g;
        const matches = [];
        let match;
        
        while ((match = singleQuotePattern.exec(field)) !== null) {
          // Replace double single quotes with single quotes (unescape)
          matches.push(match[1].replace(/''/g, "'"));
        }
        
        if (matches.length > 0) {
          return matches;
        }
        
        // If no single-quoted items found, return the field as a single item
        return [field];
      }
    }
    
    return [field];
  };

  // Transform API data to frontend format
  const transformSchemeData = (apiScheme) => {
    // Parse tags from string to array using the improved parsing logic
    const tags = parseJsonField(apiScheme.Tags);

    // Truncate description to 2 lines (approximately 150 characters)
    const truncatedDescription = apiScheme.Details 
      ? apiScheme.Details.length > 150 
        ? apiScheme.Details.substring(0, 150) + '...'
        : apiScheme.Details
      : '';

    return {
      id: apiScheme.id,
      title: apiScheme["Scheme Title"] || 'Untitled Scheme',
      ministry: apiScheme["Department/State"] || 'Unknown Department',
      description: truncatedDescription,
      category: mapCategoryToKey(apiScheme["Scheme Category"]),
      level: apiScheme.Level?.toLowerCase() || 'central',
      benefitType: apiScheme["Benefit Type"]?.toLowerCase() || 'other',
      tags: tags.slice(0, 3), // Limit to 3 tags for display
    };
  };

  // Map category names to keys
  const mapCategoryToKey = (categoryName) => {
    const categoryMap = {
      'Agriculture, Rural & Environment': 'agri',
      'Banking, Financial Services & Insurance': 'bfsi',
      'Business & Entrepreneurship': 'business',
      'Education & Learning': 'education',
      'Health & Wellness': 'health',
      'Housing & Shelter': 'housing',
      'Public Safety, Law & Justice': 'safety',
      'Science, IT & Communications': 'science',
      'Skills & Employment': 'skills',
      'Social Welfare & Empowerment': 'social',
      'Sports & Culture': 'culture',
      'Transport & Infrastructure': 'transport',
      'Travel & Tourism': 'tourism',
      'Utility & Sanitation': 'utility',
      'Women & Child': 'women',
    };
    return categoryMap[categoryName] || 'social';
  };

  /* ------------------------------ UI state ------------------------------- */
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState({
    category: false,
    level: false,
    benefit: false,
  });
  const [showFilters, setShowFilters] = useState(false); // For mobile filter panel
  const [selCategories, setSelCategories] = useState(new Set()); // keys from CATEGORY_DEFS
  const [selLevels, setSelLevels] = useState(new Set()); // 'state' | 'central'
  const [selBenefitTypes, setSelBenefitTypes] = useState(new Set()); // 'cash'|'composite'|'other'
  const [sort, setSort] = useState("relevance"); // relevance|newest|oldest (demo only)

  // Load schemes with current filters
  const loadSchemes = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Build filters object
      const filters = {};
      if (query.trim()) filters.search = query.trim();
      if (selCategories.size > 0) {
        // Get the first selected category (you can modify this to support multiple)
        const selectedCategory = Array.from(selCategories)[0];
        const categoryName = CATEGORY_DEFS.find(c => c.key === selectedCategory)?.name;
        if (categoryName) filters.category = categoryName;
      }
      if (selLevels.size > 0) {
        const selectedLevel = Array.from(selLevels)[0];
        filters.level = selectedLevel;
      }
      if (selBenefitTypes.size > 0) {
        const selectedBenefitType = Array.from(selBenefitTypes)[0];
        filters.benefitType = selectedBenefitType;
      }
      
      const response = await fetchSchemes(1, 20, filters);
      const transformedSchemes = response.data.map(transformSchemeData);
      setSchemes(transformedSchemes);
      setPagination({
        page: response.page,
        limit: response.limit,
        total: response.total,
        totalPages: response.totalPages,
        results: response.results
      });
    } catch (err) {
      setError(err.message);
      console.error('Error loading schemes:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch category counts
  const fetchCategoryCounts = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/summary`);
      if (response.ok) {
        const data = await response.json();
        if (data.categoryCounts) {
          const counts = {};
          data.categoryCounts.forEach(item => {
            counts[item.category] = item.count;
          });
          setCategoryCounts(counts);
        }
      }
    } catch (err) {
      console.error('Error fetching category counts:', err);
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    loadSchemes();
    fetchCategoryCounts();
  }, []);

  // Reload data when filters change
  useEffect(() => {
    loadSchemes();
  }, [selCategories, selLevels, selBenefitTypes, query]);

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
    // The useEffect will automatically reload data when these states change
  };

  const toggleSet = (set, value) => {
    const next = new Set(set);
    if (next.has(value)) next.delete(value);
    else next.add(value);
    return next;
  };

  /* ------------------------------ Results ------------------------------ */
  // Since we're doing server-side filtering, we just use the schemes directly
  const results = schemes;

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
      <Navbar lang={lang} setLang={setLang} />

      {/* Mobile Filter Button */}
      <div className="lg:hidden sticky top-0 z-30 bg-[#faf7f2] border-b px-4 py-2">
        <button
          onClick={() => setShowFilters(true)}
          className="w-full flex items-center justify-center gap-2 rounded-full bg-[#0271BC] text-white px-4 py-2"
        >
          <SlidersHorizontal className="w-4 h-4" />
          <span>{t.sidebarTitle}</span>
          {anyFiltersApplied && (
            <span className="flex items-center justify-center w-5 h-5 text-xs bg-white text-[#0271BC] rounded-full">
              {(selCategories.size + selLevels.size + selBenefitTypes.size)}
            </span>
          )}
        </button>
      </div>

      {/* Mobile Filter Panel */}
      <div className={`fixed inset-0 bg-black/50 z-50 transition-opacity lg:hidden ${showFilters ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <div className={`absolute inset-y-0 left-0 w-[85%] max-w-md bg-[#faf7f2] transform transition-transform ${showFilters ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="h-full overflow-auto">
            <div className="sticky top-0 bg-[#faf7f2] border-b p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-[#0271BC]" />
                <h2 className="font-semibold">{t.sidebarTitle}</h2>
              </div>
              <button
                onClick={() => setShowFilters(false)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                ✕
              </button>
            </div>
            <div className="p-4 space-y-4">
              {/* Filter content */}
              <button
                className="text-sm text-[#0271BC] hover:underline"
                onClick={() => {
                  resetFilters();
                  setShowFilters(false);
                }}
              >
                {t.reset}
              </button>
              {/* Rest of the filter content */}
              <div className="space-y-4">
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
                        onChange={() => setSelCategories((s) => toggleSet(s, c.key))}
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
                        onChange={() => setSelBenefitTypes((s) => toggleSet(s, opt.key))}
                      />
                    ))}
                  </div>
                </Section>

                {/* Mobile Chatbot CTA */}
                <div className="rounded-2xl p-4 bg-[#1E90FF] text-white space-y-2 shadow">
                  <div className="flex items-center gap-2">
                    <Languages className="w-5 h-5" />
                    <h3 className="font-semibold">Multilingual Assistant</h3>
                  </div>
                  <p className="text-sm opacity-90">
                    Get guidance in your regional language. Ask anything about
                    eligibility, documents, or how to apply.
                  </p>
                  <button 
                    onClick={() => setShowFilters(false)}
                    className="w-full mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-white text-[#1E90FF] px-4 py-2">
                    <HelpCircle className="w-4 h-4" />
                    {t.chatbot}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* PAGE CONTENT */}
      <main className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT SIDEBAR: FILTERS - Desktop */}
        <aside className="hidden lg:block lg:col-span-4 xl:col-span-3 space-y-4">
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
            {loading && (
              <div className="rounded-2xl bg-white p-6 border text-center text-gray-600">
                <div className="flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#0271BC]"></div>
                  Loading schemes...
                </div>
              </div>
            )}

            {error && (
              <div className="rounded-2xl bg-red-50 p-6 border border-red-200 text-center text-red-600">
                <p className="font-medium">Error loading schemes</p>
                <p className="text-sm mt-1">{error}</p>
                <button 
                  onClick={() => window.location.reload()} 
                  className="mt-2 text-sm text-red-700 hover:underline"
                >
                  Try again
                </button>
              </div>
            )}

            {!loading && !error && results.map((s) => (
              <article
                key={s.id}
                className="rounded-2xl bg-white p-4 md:p-5 border shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg md:text-xl font-semibold break-words">
                      {s.title}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      <span className="font-medium">{t.source}:</span>{" "}
                      {s.ministry}
                    </p>
                  </div>
                  <button 
                    onClick={() => navigate(`/Schemes/${s.id}`)}
                    className="flex-shrink-0 inline-flex items-center gap-1 rounded-full bg-[#0271BC] text-white text-sm px-3 py-1.5 hover:bg-[#025a9a] transition-colors"
                  >
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

            {!loading && !error && results.length === 0 && (
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
