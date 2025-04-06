import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  Home,
  Save,
  HelpCircle,
  Tractor,
  User,
  Briefcase,
  UserPlus,
  Building,
  GraduationCap,
  Filter,
} from "lucide-react"
import SchemeCard from "@/components/scheme-card"
import { ScrollArea } from "@/components/ui/scroll-area"

export default function SchemesResultPage() {
  // Sample scheme data
  const schemes = [
    {
      id: 1,
      name: "प्रधानमंत्री किसान सम्मान निधि",
      nameEn: "PM Kisan Samman Nidhi",
      category: "farming",
      icon: <Tractor className="w-8 h-8 text-green-600" />,
    },
    {
      id: 2,
      name: "किसान क्रेडिट कार्ड",
      nameEn: "Kisan Credit Card",
      category: "farming",
      icon: <Tractor className="w-8 h-8 text-green-600" />,
    },
    {
      id: 3,
      name: "प्रधानमंत्री फसल बीमा योजना",
      nameEn: "PM Fasal Bima Yojana",
      category: "farming",
      icon: <Tractor className="w-8 h-8 text-green-600" />,
    },
  ]

  return (
    <div className="flex flex-col min-h-screen bg-orange-50">
      {/* Header */}
      <header className="bg-orange-500 text-white p-4 text-center shadow-md">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-white">
            <Home className="w-6 h-6" />
          </Link>
          <h1 className="text-xl font-bold">योजना परिणाम</h1>
          <Button variant="ghost" size="icon" className="text-white">
            <Filter className="w-6 h-6" />
          </Button>
        </div>
      </header>

      {/* Filters */}
      <div className="bg-white p-3 overflow-x-auto">
        <div className="flex gap-3 min-w-max">
          <Button
            variant="outline"
            className="rounded-full flex items-center gap-2 border-green-600 text-green-700 bg-green-50"
          >
            <Tractor className="w-4 h-4" />
            <span>किसान</span>
          </Button>
          <Button variant="outline" className="rounded-full flex items-center gap-2">
            <User className="w-4 h-4" />
            <span>महिला</span>
          </Button>
          <Button variant="outline" className="rounded-full flex items-center gap-2">
            <Briefcase className="w-4 h-4" />
            <span>बेरोजगार</span>
          </Button>
          <Button variant="outline" className="rounded-full flex items-center gap-2">
            <UserPlus className="w-4 h-4" />
            <span>पेंशन</span>
          </Button>
          <Button variant="outline" className="rounded-full flex items-center gap-2">
            <Building className="w-4 h-4" />
            <span>घर</span>
          </Button>
          <Button variant="outline" className="rounded-full flex items-center gap-2">
            <GraduationCap className="w-4 h-4" />
            <span>छात्र</span>
          </Button>
        </div>
      </div>

      {/* Results Count */}
      <div className="bg-green-100 p-2 text-center">
        <p className="text-green-800 font-medium">3 किसान योजनाएं मिलीं</p>
      </div>

      {/* Main Content */}
      <ScrollArea className="flex-1 p-4">
        <div className="flex flex-col gap-4 pb-20">
          {schemes.map((scheme) => (
            <SchemeCard key={scheme.id} scheme={scheme} />
          ))}
        </div>
      </ScrollArea>

      {/* Bottom Navigation */}
      <nav className="bg-white border-t border-gray-200 p-2 sticky bottom-0 w-full shadow-lg">
        <div className="flex justify-around items-center">
          <Link href="/" className="flex flex-col items-center p-2">
            <Home className="w-6 h-6 text-gray-600" />
            <span className="text-xs text-gray-600">Home</span>
          </Link>
          <Link href="/saved-schemes" className="flex flex-col items-center p-2">
            <Save className="w-6 h-6 text-gray-600" />
            <span className="text-xs text-gray-600">Saved</span>
          </Link>
          <Link href="/help" className="flex flex-col items-center p-2">
            <HelpCircle className="w-6 h-6 text-gray-600" />
            <span className="text-xs text-gray-600">Help</span>
          </Link>
        </div>
      </nav>
    </div>
  )
}

