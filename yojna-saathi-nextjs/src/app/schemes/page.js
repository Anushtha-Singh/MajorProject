import { Suspense } from "react";
import SchemesClient from "./SchemesClient";

export const metadata = {
  title: "Explore Schemes — Yojna Saathi",
  description: "Browse 5400+ Central and State government schemes. Filter by category, level, and benefit type.",
};

export default function SchemesPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[#faf7f2]">
        <div className="flex flex-col items-center gap-3 text-gray-500">
          <svg className="w-8 h-8 animate-spin text-[#3B82F6]" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
          </svg>
          <span className="text-sm font-medium">Loading schemes…</span>
        </div>
      </div>
    }>
      <SchemesClient />
    </Suspense>
  );
}
