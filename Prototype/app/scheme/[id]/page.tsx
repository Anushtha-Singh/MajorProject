"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Volume2, Share2, Save, Tractor, FileText, Download, Phone, MessageSquare } from "lucide-react"
import Link from "next/link"
import Footer from "@/components/footer"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"

export default function SchemeDetailsPage({ params }: { params: { id: string } }) {
  const [saved, setSaved] = useState(false)

  // In a real app, you would fetch the scheme details based on the ID
  // For this prototype, we'll use hardcoded data
  const scheme = {
    id: Number.parseInt(params.id),
    name: "प्रधानमंत्री किसान सम्मान निधि",
    nameEn: "PM Kisan Samman Nidhi",
    category: "farming",
    summary: "किसानों को हर 4 महीने में ₹2,000 की आर्थिक सहायता",
    description:
      "प्रधानमंत्री किसान सम्मान निधि (पीएम-किसान) एक केंद्रीय क्षेत्र की योजना है जिसमें भारत सरकार द्वारा पूरी तरह से वित्त पोषित है। इस योजना के तहत, पात्र किसान परिवारों को प्रति वर्ष ₹6,000 की वित्तीय सहायता प्रदान की जाती है, जो कि ₹2,000 की तीन समान किस्तों में दी जाती है।",
    eligibility: [
      "सभी छोटे और सीमांत किसान",
      "जिनके पास 2 हेक्टेयर तक की भूमि है",
      "भारत के नागरिक",
      "किसान का नाम भूमि रिकॉर्ड में होना चाहिए",
    ],
    documents: ["आधार कार्ड", "बैंक खाता विवरण", "जमीन के कागजात", "पासपोर्ट साइज फोटो"],
    applicationSteps: [
      "अपने नजदीकी CSC केंद्र पर जाएं",
      "ऑनलाइन पोर्टल पर जाकर फॉर्म भरें",
      "सभी जरूरी दस्तावेज अपलोड करें",
      "आवेदन जमा करें और रेफरेंस नंबर प्राप्त करें",
    ],
    benefits: [
      "प्रति वर्ष ₹6,000 की आर्थिक सहायता",
      "सीधे बैंक खाते में ट्रांसफर",
      "खेती के लिए आवश्यक इनपुट खरीदने में मदद",
      "किसानों की आय में वृद्धि",
    ],
    applicationUrl: "https://pmkisan.gov.in/",
  }

  return (
    <div className="flex flex-col min-h-screen bg-orange-50">
      {/* Header */}
      <header className="bg-orange-500 text-white p-4 shadow-md">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <Link href="/explore" className="text-white">
              <ArrowLeft className="w-6 h-6" />
            </Link>
            <h1 className="text-xl font-bold">योजना विवरण</h1>
          </div>
          <Button variant="ghost" size="icon" className="text-white" onClick={() => setSaved(!saved)}>
            <Save className={`w-6 h-6 ${saved ? "fill-white" : ""}`} />
          </Button>
        </div>
      </header>

      {/* Scheme Header */}
      <div className="bg-white p-4 shadow-sm">
        <div className="flex items-start gap-4 max-w-3xl mx-auto">
          <div className="bg-green-100 p-3 rounded-lg">
            <Tractor className="w-12 h-12 text-green-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">{scheme.name}</h2>
            <p className="text-gray-600">{scheme.nameEn}</p>
            <p className="mt-2">{scheme.summary}</p>

            <div className="flex items-center mt-3 gap-2">
              <Button className="rounded-full flex items-center gap-2 bg-orange-500 hover:bg-orange-600">
                <Volume2 className="w-4 h-4" />
                <span>पूरा विवरण सुनें</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <ScrollArea className="flex-1 p-4 pb-24">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-lg shadow-md overflow-hidden mb-4">
            <Tabs defaultValue="eligibility" className="w-full">
              <TabsList className="grid grid-cols-4 w-full">
                <TabsTrigger value="eligibility">पात्रता</TabsTrigger>
                <TabsTrigger value="documents">कागज़ात</TabsTrigger>
                <TabsTrigger value="apply">आवेदन</TabsTrigger>
                <TabsTrigger value="benefits">लाभ</TabsTrigger>
              </TabsList>

              <TabsContent value="eligibility" className="p-4">
                <h3 className="font-bold text-lg mb-3">यह योजना किनके लिए है?</h3>
                <p className="text-sm mb-4">{scheme.description}</p>
                <ul className="list-disc pl-5 space-y-2">
                  {scheme.eligibility.map((item, index) => (
                    <li key={index} className="text-sm">
                      {item}
                    </li>
                  ))}
                </ul>
              </TabsContent>

              <TabsContent value="documents" className="p-4">
                <h3 className="font-bold text-lg mb-3">जरूरी कागज़ात</h3>
                <ul className="list-disc pl-5 space-y-2">
                  {scheme.documents.map((item, index) => (
                    <li key={index} className="text-sm">
                      {item}
                    </li>
                  ))}
                </ul>

                <div className="mt-4 p-3 bg-orange-50 rounded-lg">
                  <p className="text-sm text-orange-800">
                    सभी दस्तावेजों की स्कैन कॉपी या फोटो तैयार रखें। आवेदन के समय इन्हें अपलोड करना होगा।
                  </p>
                </div>

                <Button className="mt-4 flex items-center gap-2">
                  <Download className="w-4 h-4" />
                  <span>आवेदन फॉर्म डाउनलोड करें</span>
                </Button>
              </TabsContent>

              <TabsContent value="apply" className="p-4">
                <h3 className="font-bold text-lg mb-3">कैसे आवेदन करें?</h3>
                <ol className="list-decimal pl-5 space-y-2">
                  {scheme.applicationSteps.map((item, index) => (
                    <li key={index} className="text-sm">
                      {item}
                    </li>
                  ))}
                </ol>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6">
                  <a href={scheme.applicationUrl} target="_blank" rel="noopener noreferrer">
                    <Button className="w-full bg-green-600 hover:bg-green-700">
                      <FileText className="w-4 h-4 mr-2" />
                      अभी आवेदन करें
                    </Button>
                  </a>

                  <Button variant="outline" className="w-full">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    WhatsApp पर लिंक भेजें
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="benefits" className="p-4">
                <h3 className="font-bold text-lg mb-3">योजना के लाभ</h3>
                <ul className="list-disc pl-5 space-y-2">
                  {scheme.benefits.map((item, index) => (
                    <li key={index} className="text-sm">
                      {item}
                    </li>
                  ))}
                </ul>

                <div className="mt-6 p-4 bg-green-50 rounded-lg">
                  <h4 className="font-bold text-green-800 mb-2">सफलता की कहानी</h4>
                  <p className="text-sm text-green-800">
                    "इस योजना से मुझे अपनी खेती के लिए बीज और उर्वरक खरीदने में मदद मिली। मेरी फसल की पैदावार बढ़ गई और आय में भी वृद्धि
                    हुई।" - रामलाल, उत्तर प्रदेश
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Help Section */}
          <div className="bg-white rounded-lg shadow-md p-4 mb-4">
            <h3 className="font-bold text-lg mb-3">मदद चाहिए?</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Button className="flex items-center justify-between bg-green-600 hover:bg-green-700">
                <div className="flex items-center">
                  <Phone className="w-5 h-5 mr-2" />
                  <span>हेल्पलाइन पर कॉल करें</span>
                </div>
                <span className="text-xs bg-green-500 px-2 py-1 rounded">1800-11-0001</span>
              </Button>

              <Button variant="outline" className="flex items-center justify-between">
                <div className="flex items-center">
                  <MessageSquare className="w-5 h-5 mr-2" />
                  <span>CSC केंद्र खोजें</span>
                </div>
                <span className="text-xs bg-gray-100 px-2 py-1 rounded">नज़दीकी</span>
              </Button>
            </div>
          </div>

          {/* Share Section */}
          <div className="bg-white rounded-lg shadow-md p-4">
            <h3 className="font-bold text-lg mb-3">इस योजना को शेयर करें</h3>
            <p className="text-sm mb-3">अपने परिवार और दोस्तों को इस योजना के बारे में बताएं जिन्हें इसकी आवश्यकता हो सकती है।</p>
            <Button className="w-full">
              <Share2 className="w-4 h-4 mr-2" />
              WhatsApp पर शेयर करें
            </Button>
          </div>
        </div>
      </ScrollArea>

      <Footer />
    </div>
  )
}

