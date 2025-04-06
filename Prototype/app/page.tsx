import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Mic, FileText, Save } from "lucide-react"
import Image from "next/image"
import LanguageSwitcher from "@/components/language-switcher"
import Footer from "@/components/footer"

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-orange-50">
      {/* Header */}
      <header className="bg-orange-500 text-white p-4 shadow-md">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <Image
              src="/placeholder.svg?height=40&width=40"
              alt="Yojna Sathi Logo"
              width={40}
              height={40}
              className="rounded-full bg-white p-1"
            />
            <h1 className="text-xl font-bold hidden sm:block">Yojna Sathi - आपकी योजना साथी</h1>
            <h1 className="text-xl font-bold sm:hidden">Yojna Sathi</h1>
          </div>
          <LanguageSwitcher />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center p-6 gap-8 max-w-7xl mx-auto w-full">
        <div className="text-center mb-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">सरकारी योजनाएं खोजें और आवेदन करें</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            अपनी आवश्यकता के अनुसार सरकारी योजनाओं का पता लगाएं और सीधे आवेदन करें
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
          {/* Voice Chatbot Card */}
          <Link href="/chatbot" className="no-underline">
            <div className="bg-white rounded-xl shadow-lg p-8 h-full flex flex-col items-center text-center hover:shadow-xl transition-shadow">
              <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mb-4">
                <Mic className="w-10 h-10 text-green-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">Voice Chatbot से बात करें</h3>
              <p className="text-gray-600 mb-4">अपनी आवाज से बात करके योजनाओं के बारे में जानकारी प्राप्त करें</p>
              <Button className="bg-green-600 hover:bg-green-700 mt-auto">शुरू करें</Button>
            </div>
          </Link>

          {/* Manual Explore Card */}
          <Link href="/explore" className="no-underline">
            <div className="bg-white rounded-xl shadow-lg p-8 h-full flex flex-col items-center text-center hover:shadow-xl transition-shadow">
              <div className="w-20 h-20 rounded-full bg-orange-100 flex items-center justify-center mb-4">
                <FileText className="w-10 h-10 text-orange-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">Schemes Manually खोजें</h3>
              <p className="text-gray-600 mb-4">फिल्टर का उपयोग करके अपनी पसंद की योजनाएं खोजें</p>
              <Button className="bg-orange-500 hover:bg-orange-600 mt-auto">खोजें</Button>
            </div>
          </Link>
        </div>

        {/* Features Section */}
        <div className="w-full max-w-4xl mt-8">
          <h3 className="text-xl font-bold mb-4 text-center">मुख्य विशेषताएं</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-lg shadow flex items-start gap-3">
              <div className="bg-green-100 p-2 rounded-full">
                <Mic className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h4 className="font-bold text-sm">आवाज से खोजें</h4>
                <p className="text-xs text-gray-600">अपनी आवाज से योजनाओं के बारे में पूछें</p>
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow flex items-start gap-3">
              <div className="bg-orange-100 p-2 rounded-full">
                <FileText className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <h4 className="font-bold text-sm">फिल्टर से खोजें</h4>
                <p className="text-xs text-gray-600">श्रेणी, राज्य और उम्र के अनुसार फिल्टर करें</p>
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow flex items-start gap-3">
              <div className="bg-blue-100 p-2 rounded-full">
                <Save className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h4 className="font-bold text-sm">योजनाएं सहेजें</h4>
                <p className="text-xs text-gray-600">पसंदीदा योजनाओं को बाद के लिए सहेजें</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

