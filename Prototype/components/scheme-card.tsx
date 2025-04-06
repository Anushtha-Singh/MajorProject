"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Volume2, Info, Share2, Save, Tractor, User, GraduationCap, UserPlus, Building } from "lucide-react"
import Link from "next/link"

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

interface SchemeCardProps {
  scheme: SchemeType
}

export default function SchemeCard({ scheme }: SchemeCardProps) {
  const [saved, setSaved] = useState(false)

  // Get the appropriate icon based on category
  const getCategoryIcon = () => {
    switch (scheme.category) {
      case "farming":
        return <Tractor className="w-8 h-8 text-green-600" />
      case "education":
        return <GraduationCap className="w-8 h-8 text-blue-600" />
      case "employment":
        return <UserPlus className="w-8 h-8 text-purple-600" />
      case "housing":
        return <Building className="w-8 h-8 text-yellow-600" />
      case "women":
        return <User className="w-8 h-8 text-pink-600" />
      default:
        return <Info className="w-8 h-8 text-gray-600" />
    }
  }

  // Get the appropriate background color based on category
  const getCategoryBgColor = () => {
    switch (scheme.category) {
      case "farming":
        return "bg-green-100"
      case "education":
        return "bg-blue-100"
      case "employment":
        return "bg-purple-100"
      case "housing":
        return "bg-yellow-100"
      case "women":
        return "bg-pink-100"
      default:
        return "bg-gray-100"
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-4">
        <div className="flex items-start gap-3">
          <div className={`p-2 rounded-lg ${getCategoryBgColor()}`}>{getCategoryIcon()}</div>
          <div className="flex-1">
            <h3 className="font-bold text-lg">{scheme.name}</h3>
            <p className="text-gray-600 text-sm">{scheme.nameEn}</p>
            <p className="text-sm mt-1">{scheme.summary}</p>

            <div className="flex items-center mt-2 gap-2 flex-wrap">
              <Button
                variant="outline"
                size="sm"
                className="rounded-full flex items-center gap-1 bg-orange-50 border-orange-300 text-orange-700"
              >
                <Volume2 className="w-4 h-4" />
                <span className="text-xs">सुनें</span>
              </Button>

              <Button
                variant="outline"
                size="sm"
                className={`rounded-full flex items-center gap-1 ${saved ? "bg-green-100 border-green-500 text-green-700" : ""}`}
                onClick={() => setSaved(!saved)}
              >
                <Save className="w-4 h-4" />
                <span className="text-xs">{saved ? "सहेजा गया" : "सहेजें"}</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 p-3 flex justify-between border-t">
        <Link href={`/scheme/${scheme.id}`} className="flex-1 mr-2">
          <Button variant="outline" className="w-full bg-green-600 text-white hover:bg-green-700 border-0">
            <Info className="w-4 h-4 mr-1" />
            <span>आवेदन जानकारी</span>
          </Button>
        </Link>

        <Button variant="outline" className="flex-1 ml-2">
          <Share2 className="w-4 h-4 mr-1" />
          <span>लिंक भेजें</span>
        </Button>
      </div>
    </div>
  )
}

