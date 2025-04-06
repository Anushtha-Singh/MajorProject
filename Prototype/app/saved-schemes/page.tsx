"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Save } from "lucide-react"
import Link from "next/link"
import Footer from "@/components/footer"
import { ScrollArea } from "@/components/ui/scroll-area"
import SchemeCard from "@/components/scheme-card"

export default function SavedSchemesPage() {
  // In a real app, you would fetch saved schemes from a database or local storage
  // For this prototype, we'll use hardcoded data
  const [savedSchemes, setSavedSchemes] = useState([
    {
      id: 1,
      name: "प्रधानमंत्री किसान सम्मान निधि",
      nameEn: "PM Kisan Samman Nidhi",
      category: "farming",
      summary: "किसानों को हर 4 महीने में ₹2,000 की आर्थिक सहायता",
    },
    {
      id: 6,
      name: "छात्रवृत्ति योजना",
      nameEn: "Scholarship Scheme",
      category: "education",
      summary: "विद्यार्थियों के लिए छात्रवृत्ति",
    },
  ])

  // Function to remove a scheme from saved schemes
  const removeScheme = (id: number) => {
    setSavedSchemes(savedSchemes.filter((scheme) => scheme.id !== id))
  }

  return (
    <div className="flex flex-col min-h-screen bg-orange-50">
      {/* Header */}
      <header className="bg-orange-500 text-white p-4 shadow-md">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <Link href="/" className="text-white">
              <ArrowLeft className="w-6 h-6" />
            </Link>
            <h1 className="text-xl font-bold">सहेजी गई योजनाएं</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      {savedSchemes.length > 0 ? (
        <ScrollArea className="flex-1 p-4 pb-24">
          <div className="flex flex-col gap-4 max-w-3xl mx-auto">
            {savedSchemes.map((scheme) => (
              <SchemeCard key={scheme.id} scheme={scheme} />
            ))}
          </div>
        </ScrollArea>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center p-6">
          <div className="bg-white p-8 rounded-lg shadow-md text-center max-w-md">
            <Save className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2">कोई सहेजी गई योजना नहीं</h2>
            <p className="text-gray-600 mb-4">आप अभी तक कोई योजना नहीं सहेजी है। योजनाओं को खोजें और उन्हें यहां सहेजें।</p>
            <Link href="/explore">
              <Button className="bg-green-600 hover:bg-green-700">योजनाएं खोजें</Button>
            </Link>
          </div>
        </div>
      )}

      <Footer />
    </div>
  )
}

