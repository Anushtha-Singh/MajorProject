import Link from "next/link"
import { Home, Save, HelpCircle } from "lucide-react"

export default function Footer() {
  return (
    <nav className="bg-white border-t border-gray-200 p-2 sticky bottom-0 w-full shadow-lg">
      <div className="flex justify-around items-center max-w-7xl mx-auto">
        <Link href="/" className="flex flex-col items-center p-2 rounded-lg bg-orange-100">
          <Home className="w-6 h-6 text-orange-600" />
          <span className="text-xs text-orange-600 font-medium">Home</span>
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
  )
}

