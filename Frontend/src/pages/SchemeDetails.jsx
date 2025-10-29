import { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    ChevronLeft,
    ChevronDown,
    ChevronRight,
    ArrowUpRight,
    Mail,
    Facebook,
    Twitter,
    Linkedin,
    Share2,
    Star,
    HelpCircle,
    BookOpen,
    FileText,
    ClipboardList,
    MessageSquare,
    Link as LinkIcon
} from "lucide-react";
import Navbar from "../components/Navbar"; // Import the Navbar component

export default function SchemeDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [activeSection, setActiveSection] = useState("details");
    const [expandedFaq, setExpandedFaq] = useState(null);
    const [scheme, setScheme] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const contentRef = useRef(null);

    // Fetch scheme data
    useEffect(() => {
        const fetchScheme = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await fetch(`https://yojana-saathi-backend.onrender.com/api/${id}`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setScheme(data);
            } catch (err) {
                setError(err.message);
                console.error('Error fetching scheme:', err);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchScheme();
        }
    }, [id]);

    // Parse JSON strings from the API
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

    // FAQ data
    const faqs = [
        {
            question: "What is the duration of this scheme?",
            answer: "The scheme duration is typically 3-5 years depending on the research area."
        },
        {
            question: "Can international students apply?",
            answer: "No, this scheme is only available for Indian nationals."
        },
        {
            question: "Is there any age limit?",
            answer: "Applicants should be below 32 years of age at the time of application."
        }
    ];

    // Scroll to section
    const scrollToSection = (sectionId) => {
        const section = document.getElementById(sectionId);
        if (section) {
            section.scrollIntoView({ behavior: "smooth" });
            setActiveSection(sectionId);
        }
    };

    // Track active section on scroll
    useEffect(() => {
        const handleScroll = () => {
            const sections = [
                "details", "benefits", "eligibility",
                "application", "documents", "faq",
                "sources", "feedback"
            ];

            for (const section of sections) {
                const element = document.getElementById(section);
                if (element) {
                    const rect = element.getBoundingClientRect();
                    if (rect.top <= 100 && rect.bottom >= 100) {
                        setActiveSection(section);
                        break;
                    }
                }
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Loading state
    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Navbar />
                <main className="max-w-7xl mx-auto px-4 py-6">
                    <div className="flex items-center justify-center h-64">
                        <div className="flex items-center gap-2">
                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#0271BC]"></div>
                            Loading scheme details...
                        </div>
                    </div>
                </main>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Navbar />
                <main className="max-w-7xl mx-auto px-4 py-6">
                    <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
                        <h2 className="text-xl font-semibold text-red-800 mb-2">Error Loading Scheme</h2>
                        <p className="text-red-600 mb-4">{error}</p>
                        <button 
                            onClick={() => navigate('/Schemes')}
                            className="inline-flex items-center gap-2 rounded-full bg-[#0271BC] text-white px-4 py-2"
                        >
                            <ChevronLeft className="w-4 h-4" />
                            Back to Schemes
                        </button>
                    </div>
                </main>
            </div>
        );
    }

    // No scheme found
    if (!scheme) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Navbar />
                <main className="max-w-7xl mx-auto px-4 py-6">
                    <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 text-center">
                        <h2 className="text-xl font-semibold text-yellow-800 mb-2">Scheme Not Found</h2>
                        <p className="text-yellow-600 mb-4">The requested scheme could not be found.</p>
                        <button 
                            onClick={() => navigate('/Schemes')}
                            className="inline-flex items-center gap-2 rounded-full bg-[#0271BC] text-white px-4 py-2"
                        >
                            <ChevronLeft className="w-4 h-4" />
                            Back to Schemes
                        </button>
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Use the Navbar component */}
            <Navbar />

            {/* Mobile Back Button */}
            <div className="lg:hidden px-4 py-2 border-b bg-white sticky top-0 z-30">
                <button 
                    onClick={() => navigate('/Schemes')}
                    className="flex items-center gap-2 text-[#0271BC] hover:underline"
                >
                    <ChevronLeft className="w-5 h-5" />
                    Back to schemes
                </button>
            </div>

            {/* Mobile Section Navigation */}
            <div className="lg:hidden px-4 overflow-x-auto sticky top-12 z-30 bg-white border-b">
                <div className="flex space-x-4 py-2">
                    {[
                        { id: "details", label: "Details" },
                        { id: "benefits", label: "Benefits" },
                        { id: "eligibility", label: "Eligibility" },
                        { id: "application", label: "Application" },
                        { id: "documents", label: "Documents" },
                        { id: "faq", label: "FAQ" },
                    ].map((item) => (
                        <button
                            key={item.id}
                            onClick={() => scrollToSection(item.id)}
                            className={`whitespace-nowrap px-3 py-1 rounded-full text-sm ${
                                activeSection === item.id 
                                ? "bg-[#0271BC] text-white" 
                                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            }`}
                        >
                            {item.label}
                        </button>
                    ))}
                </div>
            </div>

            <main className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left Navigation Sidebar - Desktop Only */}
                <aside className="hidden lg:block lg:col-span-3 xl:col-span-2 space-y-4 sticky top-20 self-start h-[calc(100vh-5rem)] overflow-y-auto">
                    <button 
                        onClick={() => navigate('/Schemes')}
                        className="flex items-center gap-2 text-[#0271BC] hover:underline"
                    >
                        <ChevronLeft className="w-5 h-5" />
                        Back to schemes
                    </button>

                    <nav className="space-y-1">
                        {[
                            { id: "details", label: "Details", icon: <BookOpen className="w-4 h-4" /> },
                            { id: "benefits", label: "Benefits", icon: <Star className="w-4 h-4" /> },
                            { id: "eligibility", label: "Eligibility", icon: <HelpCircle className="w-4 h-4" /> },
                            { id: "application", label: "Application Process", icon: <ClipboardList className="w-4 h-4" /> },
                            { id: "documents", label: "Documents Required", icon: <FileText className="w-4 h-4" /> },
                            { id: "faq", label: "FAQ", icon: <MessageSquare className="w-4 h-4" /> },
                            { id: "sources", label: "Sources & References", icon: <LinkIcon className="w-4 h-4" /> },
                            { id: "feedback", label: "Feedback", icon: <HelpCircle className="w-4 h-4" /> }
                        ].map((item) => (
                            <button
                                key={item.id}
                                onClick={() => scrollToSection(item.id)}
                                className={`w-full text-left flex items-center gap-3 px-4 py-3 rounded-lg ${activeSection === item.id ? "bg-gray-100" : "hover:bg-gray-50"}`}
                            >
                                {item.icon}
                                <span>{item.label}</span>
                            </button>
                        ))}
                    </nav>
                </aside>

                {/* Main Content */}
                <section className="lg:col-span-6 xl:col-span-8 space-y-8 pb-20 lg:pb-0" ref={contentRef}>
                    {/* Scheme Header */}
                    <div className="bg-white rounded-xl p-6 shadow-sm border">
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                            {scheme["Scheme Title"] || "Untitled Scheme"}
                        </h1>
                        <p className="text-gray-600 mt-1">
                            {scheme["Department/State"] || "Unknown Department"}
                        </p>

                        <div className="mt-4 flex flex-wrap gap-2">
                            {parseJsonField(scheme.Tags).slice(0, 6).map((tag, index) => (
                                <span key={index} className="inline-flex items-center gap-1 text-xs px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-100">
                                    {tag}
                                </span>
                            ))}
                        </div>

                        <div className="mt-4 flex flex-wrap gap-2 text-sm text-gray-600">
                            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-gray-100">
                                Level: {scheme.Level || "Unknown"}
                            </span>
                            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-gray-100">
                                Type: {scheme["Benefit Type"] || "Unknown"}
                            </span>
                            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-gray-100">
                                Category: {scheme["Scheme Category"] || "Unknown"}
                            </span>
                        </div>

                        <button className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#0271BC] text-white px-6 py-2 font-medium">
                            Check Eligibility
                            <ArrowUpRight className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Details Section */}
                    <div id="details" className="bg-white rounded-xl p-6 shadow-sm border">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">Details</h2>
                        <p className="text-gray-700 mb-4">
                            {scheme.Details || "No details available for this scheme."}
                        </p>
                        {scheme.URL && (
                            <div className="mt-4">
                                <a 
                                    href={scheme.URL} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 text-[#0271BC] hover:underline"
                                >
                                    <ArrowUpRight className="w-4 h-4" />
                                    Visit Official Website
                                </a>
                            </div>
                        )}
                    </div>

                    {/* Benefits Section */}
                    <div id="benefits" className="bg-white rounded-xl p-6 shadow-sm border">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">Benefits</h2>
                        {scheme.Benefits ? (
                            <ul className="space-y-3">
                                {parseJsonField(scheme.Benefits).map((benefit, index) => (
                                    <li key={index} className="flex items-start gap-3">
                                        <div className="bg-blue-100 p-1 rounded-full mt-0.5">
                                            <Star className="w-4 h-4 text-blue-600" />
                                        </div>
                                        <div>
                                            <p className="text-gray-700">{benefit}</p>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-gray-500">No benefits information available.</p>
                        )}
                    </div>

                    {/* Eligibility Section */}
                    <div id="eligibility" className="bg-white rounded-xl p-6 shadow-sm border">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">Eligibility</h2>
                        {scheme.Eligibility ? (
                            <ol className="list-decimal pl-5 space-y-3 text-gray-700">
                                {parseJsonField(scheme.Eligibility).map((requirement, index) => (
                                    <li key={index}>{requirement}</li>
                                ))}
                            </ol>
                        ) : (
                            <p className="text-gray-500">No eligibility information available.</p>
                        )}
                    </div>

                    {/* Application Process Section */}
                    <div id="application" className="bg-white rounded-xl p-6 shadow-sm border">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">Application Process</h2>
                        {scheme["Application Process (Steps)"] ? (
                            <div className="space-y-4">
                                {parseJsonField(scheme["Application Process (Steps)"]).map((step, index) => (
                                    <div key={index}>
                                        <h3 className="font-medium text-gray-900">Step {index + 1}</h3>
                                        <p className="text-gray-700">{step}</p>
                                    </div>
                                ))}
                                <button className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#0271BC] text-white px-6 py-2 font-medium">
                                    Apply Now
                                    <ArrowUpRight className="w-4 h-4" />
                                </button>
                            </div>
                        ) : (
                            <p className="text-gray-500">No application process information available.</p>
                        )}
                    </div>

                    {/* Documents Required Section */}
                    <div id="documents" className="bg-white rounded-xl p-6 shadow-sm border">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">Documents Required</h2>
                        {scheme["Documents Required"] ? (
                            <ol className="list-decimal pl-5 space-y-3 text-gray-700">
                                {parseJsonField(scheme["Documents Required"]).map((document, index) => (
                                    <li key={index}>{document}</li>
                                ))}
                            </ol>
                        ) : (
                            <p className="text-gray-500">No document requirements available.</p>
                        )}
                    </div>

                    {/* FAQ Section */}
                    <div id="faq" className="bg-white rounded-xl p-6 shadow-sm border">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">Frequently Asked Questions</h2>
                        <div className="space-y-3">
                            {faqs.map((faq, index) => (
                                <div key={index} className="border rounded-lg overflow-hidden">
                                    <button
                                        className="w-full flex items-center justify-between p-4 text-left"
                                        onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                                    >
                                        <span className="font-medium">{faq.question}</span>
                                        <ChevronDown className={`w-5 h-5 transition-transform ${expandedFaq === index ? 'transform rotate-180' : ''}`} />
                                    </button>
                                    {expandedFaq === index && (
                                        <div className="p-4 pt-0 text-gray-700 border-t">
                                            {faq.answer}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Sources & References Section */}
                    <div id="sources" className="bg-white rounded-xl p-6 shadow-sm border">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">Sources & References</h2>
                        {scheme["Sources & References"] ? (
                            <div className="space-y-3">
                                {parseJsonField(scheme["Sources & References"]).map((source, index) => (
                                    <a 
                                        key={index}
                                        href={source} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 text-[#0271BC] hover:underline"
                                    >
                                        <ArrowUpRight className="w-4 h-4" />
                                        {source}
                                    </a>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-500">No sources and references available.</p>
                        )}
                    </div>

                    {/* Feedback Section */}
                    <div id="feedback" className="bg-white rounded-xl p-6 shadow-sm border">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">Was this helpful?</h2>
                        <div className="flex items-center gap-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button key={star} className="text-gray-400 hover:text-yellow-400">
                                    <Star className="w-6 h-6" />
                                </button>
                            ))}
                        </div>
                        <button className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#0271BC] text-white px-6 py-2 font-medium">
                            Submit Feedback
                        </button>
                    </div>
                </section>

                {/* Mobile Share Bar - Fixed at bottom */}
                <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t px-4 py-3 z-40">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <button className="p-2 rounded-full bg-gray-100 text-gray-700 hover:bg-blue-100 hover:text-blue-600">
                                <Share2 className="w-5 h-5" />
                            </button>
                            <button className="p-2 rounded-full bg-gray-100 text-gray-700 hover:bg-blue-100 hover:text-blue-600">
                                <Star className="w-5 h-5" />
                            </button>
                        </div>
                        <button className="px-6 py-2 bg-[#0271BC] text-white rounded-full font-medium">
                            Apply Now
                        </button>
                    </div>
                </div>

                {/* Right Sidebar - Desktop Only */}
                <aside className="hidden lg:block lg:col-span-3 space-y-6">
                    <div className="sticky top-20">
                        {/* News & Updates */}
                        <div className="bg-white rounded-xl p-5 shadow-sm border mb-6">
                            <h3 className="font-semibold text-gray-900 mb-3">News & Updates</h3>
                            <div className="space-y-4">
                                <div className="p-3 bg-blue-50 rounded-lg">
                                    <p className="text-sm font-medium text-blue-800">Application deadline extended</p>
                                    <p className="text-xs text-gray-500 mt-1">New deadline: 30 November 2023</p>
                                </div>
                                <div className="p-3 bg-blue-50 rounded-lg">
                                    <p className="text-sm font-medium text-blue-800">New participating institutions added</p>
                                    <p className="text-xs text-gray-500 mt-1">5 more IITs included in the program</p>
                                </div>
                                <div className="p-3 bg-blue-50 rounded-lg">
                                    <p className="text-sm font-medium text-blue-800">Webinar announcement</p>
                                    <p className="text-xs text-gray-500 mt-1">Join our Q&A session on 15 October</p>
                                </div>
                            </div>
                        </div>

                        {/* Share Section - Desktop */}
                        <div className="bg-white rounded-xl p-5 shadow-sm border">
                            <h3 className="font-semibold text-gray-900 mb-3">Share</h3>
                            <div className="flex items-center gap-3">
                                <button className="p-2 rounded-full bg-gray-100 text-gray-700 hover:bg-blue-100 hover:text-blue-600">
                                    <Mail className="w-5 h-5" />
                                </button>
                                <button className="p-2 rounded-full bg-gray-100 text-gray-700 hover:bg-blue-100 hover:text-blue-600">
                                    <Facebook className="w-5 h-5" />
                                </button>
                                <button className="p-2 rounded-full bg-gray-100 text-gray-700 hover:bg-blue-100 hover:text-blue-600">
                                    <Twitter className="w-5 h-5" />
                                </button>
                                <button className="p-2 rounded-full bg-gray-100 text-gray-700 hover:bg-blue-100 hover:text-blue-600">
                                    <Linkedin className="w-5 h-5" />
                                </button>
                                <button className="p-2 rounded-full bg-gray-100 text-gray-700 hover:bg-blue-100 hover:text-blue-600">
                                    <Share2 className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </div>
                </aside>
            </main>
        </div>
    );
}