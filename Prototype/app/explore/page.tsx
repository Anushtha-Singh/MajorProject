"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Filter, User, Tractor, GraduationCap, UserPlus, Building, Search } from "lucide-react"
import Link from "next/link"
import Footer from "@/components/footer"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import SchemeCard from "@/components/scheme-card"

// Types
type SchemeType = {
  id: number
  name: string
  nameEn: string
  category: string
  summary: string
  state?: string
  targetGender?: string
  targetAge?: string
}

export default function ExplorePage() {
  const [activeFilter, setActiveFilter] = useState<string | null>("all")
  const [searchQuery, setSearchQuery] = useState("")

  // Sample schemes data
  const schemes: SchemeType[] = [
    {
      id: 1,
      name: "प्रधानमंत्री किसान सम्मान निधि",
      nameEn: "PM Kisan Samman Nidhi",
      category: "farming",
      summary: "किसानों को हर 4 महीने में ₹2,000 की आर्थिक सहायता",
      state: "all",
      targetGender: "all",
      targetAge: "adult",
    },
    {
      id: 2,
      name: "किसान क्रेडिट कार्ड",
      nameEn: "Kisan Credit Card",
      category: "farming",
      summary: "किसानों के लिए आसान ऋण सुविधा",
      state: "all",
      targetGender: "all",
      targetAge: "adult",
    },
    {
      id: 3,
      name: "प्रधानमंत्री आवास योजना",
      nameEn: "PM Awas Yojana",
      category: "housing",
      summary: "गरीब परिवारों के लिए घर बनाने हेतु आर्थिक सहायता",
      state: "all",
      targetGender: "all",
      targetAge: "adult",
    },
    {
      id: 4,
      name: "सुकन्या समृद्धि योजना",
      nameEn: "Sukanya Samriddhi Yojana",
      category: "women",
      summary: "बेटियों के लिए बचत योजना",
      state: "all",
      targetGender: "female",
      targetAge: "child",
    },
    {
      id: 5,
      name: "प्रधानमंत्री कौशल विकास योजना",
      nameEn: "PM Kaushal Vikas Yojana",
      category: "employment",
      summary: "युवाओं के लिए कौशल विकास प्रशिक्षण",
      state: "all",
      targetGender: "all",
      targetAge: "youth",
    },
    {
      id: 6,
      name: "छात्रवृत्ति योजना",
      nameEn: "Scholarship Scheme",
      category: "education",
      summary: "विद्यार्थियों के लिए छात्रवृत्ति",
      state: "all",
      targetGender: "all",
      targetAge: "youth",
    },
  ]

  // Filter schemes based on active filter and search query
  const filteredSchemes = schemes.filter((scheme) => {
    const matchesCategory = activeFilter === "all" || scheme.category === activeFilter
    const matchesSearch =
      searchQuery === "" ||
      scheme.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      scheme.nameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      scheme.summary.toLowerCase().includes(searchQuery.toLowerCase())

    return matchesCategory && matchesSearch
  })

  return (
    <div className="flex flex-col min-h-screen bg-orange-50">
      {/* Header */}
      <header className="bg-orange-500 text-white p-4 shadow-md">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <Link href="/" className="text-white">
              <ArrowLeft className="w-6 h-6" />
            </Link>
            <h1 className="text-xl font-bold">योजनाएं खोजें</h1>
          </div>
          <Button variant="ghost" size="icon" className="text-white">
            <Filter className="w-6 h-6" />
          </Button>
        </div>
      </header>

      {/* Search and Filters */}
      <div className="sticky top-0 z-10 bg-white shadow-sm">
        {/* Search Bar */}
        <div className="p-3 border-b">
          <div className="relative max-w-3xl mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder="योजना का नाम या विवरण खोजें..."
              className="pl-10 rounded-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Category Filters */}
        <div className="p-3 overflow-x-auto">
          <div className="flex gap-2 min-w-max max-w-3xl mx-auto">
            <Button
              variant="outline"
              className={`rounded-full flex items-center gap-2 ${activeFilter === "all" ? "bg-orange-100 border-orange-300 text-orange-700" : ""}`}
              onClick={() => setActiveFilter("all")}
            >
              <span>सभी</span>
            </Button>
            <Button
              variant="outline"
              className={`rounded-full flex items-center gap-2 ${activeFilter === "farming" ? "bg-green-100 border-green-300 text-green-700" : ""}`}
              onClick={() => setActiveFilter("farming")}
            >
              <Tractor className="w-4 h-4" />
              <span>किसान</span>
            </Button>
            <Button
              variant="outline"
              className={`rounded-full flex items-center gap-2 ${activeFilter === "education" ? "bg-blue-100 border-blue-300 text-blue-700" : ""}`}
              onClick={() => setActiveFilter("education")}
            >
              <GraduationCap className="w-4 h-4" />
              <span>छात्र</span>
            </Button>
            <Button
              variant="outline"
              className={`rounded-full flex items-center gap-2 ${activeFilter === "employment" ? "bg-purple-100 border-purple-300 text-purple-700" : ""}`}
              onClick={() => setActiveFilter("employment")}
            >
              <UserPlus className="w-4 h-4" />
              <span>रोजगार</span>
            </Button>
            <Button
              variant="outline"
              className={`rounded-full flex items-center gap-2 ${activeFilter === "housing" ? "bg-yellow-100 border-yellow-300 text-yellow-700" : ""}`}
              onClick={() => setActiveFilter("housing")}
            >
              <Building className="w-4 h-4" />
              <span>आवास</span>
            </Button>
            <Button
              variant="outline"
              className={`rounded-full flex items-center gap-2 ${activeFilter === "women" ? "bg-pink-100 border-pink-300 text-pink-700" : ""}`}
              onClick={() => setActiveFilter("women")}
            >
              <User className="w-4 h-4" />
              <span>महिला</span>
            </Button>
          </div>
        </div>

        {/* Advanced Filters */}
        <div className="p-3 border-t flex flex-wrap gap-2 max-w-3xl mx-auto">
          <Select defaultValue="all">
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="राज्य" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">सभी राज्य</SelectItem>
              <SelectItem value="up">उत्तर प्रदेश</SelectItem>
              <SelectItem value="mh">महाराष्ट्र</SelectItem>
              <SelectItem value="rj">राजस्थान</SelectItem>
              <SelectItem value="mp">मध्य प्रदेश</SelectItem>
            </SelectContent>
          </Select>

          <Select defaultValue="all">
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="आयु वर्ग" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">सभी आयु</SelectItem>
              <SelectItem value="child">0-18 वर्ष</SelectItem>
              <SelectItem value="youth">18-35 वर्ष</SelectItem>
              <SelectItem value="adult">35-60 वर्ष</SelectItem>
              <SelectItem value="senior">60+ वर्ष</SelectItem>
            </SelectContent>
          </Select>

          <Select defaultValue="all">
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="लिंग" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">सभी</SelectItem>
              <SelectItem value="male">पुरुष</SelectItem>
              <SelectItem value="female">महिला</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Results Count */}
      <div className="bg-green-100 p-2 text-center">
        <p className="text-green-800 font-medium">{filteredSchemes.length} योजनाएं मिलीं</p>
      </div>

      {/* Schemes List */}
      <ScrollArea className="flex-1 p-4 pb-24">
        <div className="flex flex-col gap-4 max-w-3xl mx-auto">
          {filteredSchemes.map((scheme) => (
            <SchemeCard key={scheme.id} scheme={scheme} />
          ))}

          {filteredSchemes.length === 0 && (
            <div className="bg-white p-8 rounded-lg shadow-md text-center">
              <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h2 className="text-xl font-bold mb-2">कोई योजना नहीं मिली</h2>
              <p className="text-gray-600 mb-4">अपने फिल्टर बदलें या अलग शब्दों से खोजें</p>
              <Button
                className="bg-orange-500 hover:bg-orange-600"
                onClick={() => {
                  setActiveFilter("all")
                  setSearchQuery("")
                }}
              >
                सभी योजनाएं दिखाएं
              </Button>
            </div>
          )}
        </div>
      </ScrollArea>

      <Footer />
    </div>
  )
}

