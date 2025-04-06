import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Phone, MessageSquare, Building, Volume2, HelpCircle, FileText, Headphones } from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import Footer from "@/components/footer"
import { ScrollArea } from "@/components/ui/scroll-area"

export default function HelpPage() {
  return (
    <div className="flex flex-col min-h-screen bg-orange-50">
      {/* Header */}
      <header className="bg-orange-500 text-white p-4 shadow-md">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <Link href="/" className="text-white">
              <ArrowLeft className="w-6 h-6" />
            </Link>
            <h1 className="text-xl font-bold">मदद और संपर्क</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <ScrollArea className="flex-1 p-4 pb-24">
        <div className="max-w-3xl mx-auto">
          {/* Helpline Section */}
          <div className="bg-white rounded-lg shadow-md p-4 mb-4">
            <h2 className="text-lg font-bold mb-3 flex items-center gap-2">
              <Phone className="w-5 h-5 text-green-600" />
              टोल-फ्री हेल्पलाइन
            </h2>

            <div className="grid gap-3">
              <Button className="bg-green-600 hover:bg-green-700 h-auto py-3 flex justify-between">
                <div className="flex items-center gap-2">
                  <Phone className="w-5 h-5" />
                  <span>1800-11-0001</span>
                </div>
                <span className="text-xs bg-green-500 px-2 py-1 rounded">अभी कॉल करें</span>
              </Button>

              <Button variant="outline" className="h-auto py-3 flex justify-between">
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5" />
                  <span>WhatsApp सहायता</span>
                </div>
                <span className="text-xs bg-gray-100 px-2 py-1 rounded">9876543210</span>
              </Button>
            </div>
          </div>

          {/* CSC Section */}
          <div className="bg-white rounded-lg shadow-md p-4 mb-4">
            <h2 className="text-lg font-bold mb-3 flex items-center gap-2">
              <Building className="w-5 h-5 text-green-600" />
              नज़दीकी CSC केंद्र
            </h2>

            <div className="bg-orange-50 p-3 rounded-lg mb-3">
              <p className="text-sm">
                आपके नज़दीकी CSC केंद्र पर जाकर आप किसी भी योजना के लिए आवेदन कर सकते हैं। वहां आपको पूरी मदद मिलेगी।
              </p>
            </div>

            <Button className="w-full bg-green-600 hover:bg-green-700">नज़दीकी CSC केंद्र खोजें</Button>
          </div>

          {/* Video Tutorials */}
          <div className="bg-white rounded-lg shadow-md p-4 mb-4">
            <h2 className="text-lg font-bold mb-3 flex items-center gap-2">
              <FileText className="w-5 h-5 text-green-600" />
              वीडियो ट्यूटोरियल
            </h2>

            <div className="grid gap-3">
              <div className="border rounded-lg p-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="bg-orange-100 p-2 rounded-full">
                    <Volume2 className="w-4 h-4 text-orange-600" />
                  </div>
                  <span>ऐप का उपयोग कैसे करें</span>
                </div>
                <Button size="sm" variant="ghost">
                  देखें
                </Button>
              </div>

              <div className="border rounded-lg p-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="bg-orange-100 p-2 rounded-full">
                    <Volume2 className="w-4 h-4 text-orange-600" />
                  </div>
                  <span>आवेदन कैसे करें</span>
                </div>
                <Button size="sm" variant="ghost">
                  देखें
                </Button>
              </div>
            </div>
          </div>

          {/* FAQs Section */}
          <div className="bg-white rounded-lg shadow-md p-4">
            <h2 className="text-lg font-bold mb-3 flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-green-600" />
              अक्सर पूछे जाने वाले सवाल
            </h2>

            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger className="text-left">
                  <div className="flex items-center gap-2">
                    <Volume2 className="w-4 h-4 text-orange-600 flex-shrink-0" />
                    <span>योजना क्या है?</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="pl-6">
                    <p className="text-sm text-gray-700 mb-2">
                      सरकारी योजनाएं वे कार्यक्रम हैं जो सरकार द्वारा नागरिकों के कल्याण के लिए चलाए जाते हैं। इनमें आर्थिक सहायता,
                      सब्सिडी, या अन्य लाभ शामिल हो सकते हैं।
                    </p>
                    <Button
                      size="sm"
                      variant="outline"
                      className="rounded-full flex items-center gap-1 bg-orange-50 border-orange-300 text-orange-700"
                    >
                      <Volume2 className="w-4 h-4" />
                      <span className="text-xs">पूरा सुनें</span>
                    </Button>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2">
                <AccordionTrigger className="text-left">
                  <div className="flex items-center gap-2">
                    <Volume2 className="w-4 h-4 text-orange-600 flex-shrink-0" />
                    <span>कैसे मदद मिलेगी?</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="pl-6">
                    <p className="text-sm text-gray-700 mb-2">
                      यह ऐप आपको सरकारी योजनाओं के बारे में जानकारी देता है और आवेदन प्रक्रिया में मदद करता है। आप अपनी आवश्यकता बताएं
                      और हम आपके लिए उपयुक्त योजनाएं खोजेंगे।
                    </p>
                    <Button
                      size="sm"
                      variant="outline"
                      className="rounded-full flex items-center gap-1 bg-orange-50 border-orange-300 text-orange-700"
                    >
                      <Volume2 className="w-4 h-4" />
                      <span className="text-xs">पूरा सुनें</span>
                    </Button>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3">
                <AccordionTrigger className="text-left">
                  <div className="flex items-center gap-2">
                    <Volume2 className="w-4 h-4 text-orange-600 flex-shrink-0" />
                    <span>आवेदन कैसे करें?</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="pl-6">
                    <p className="text-sm text-gray-700 mb-2">
                      आप हमारे ऐप से सीधे आवेदन कर सकते हैं या नज़दीकी CSC केंद्र पर जाकर मदद ले सकते हैं। आवेदन के लिए आधार कार्ड और अन्य
                      जरूरी दस्तावेज़ तैयार रखें।
                    </p>
                    <Button
                      size="sm"
                      variant="outline"
                      className="rounded-full flex items-center gap-1 bg-orange-50 border-orange-300 text-orange-700"
                    >
                      <Volume2 className="w-4 h-4" />
                      <span className="text-xs">पूरा सुनें</span>
                    </Button>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4">
                <AccordionTrigger className="text-left">
                  <div className="flex items-center gap-2">
                    <Volume2 className="w-4 h-4 text-orange-600 flex-shrink-0" />
                    <span>वॉइस चैटबॉट कैसे उपयोग करें?</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="pl-6">
                    <p className="text-sm text-gray-700 mb-2">
                      वॉइस चैटबॉट का उपयोग करने के लिए, माइक बटन पर क्लिक करें और अपनी आवश्यकता बताएं। उदाहरण के लिए, "किसान
                      योजना बताओ" या "छात्रवृत्ति योजना कौन सी हैं"।
                    </p>
                    <Button
                      size="sm"
                      variant="outline"
                      className="rounded-full flex items-center gap-1 bg-orange-50 border-orange-300 text-orange-700"
                    >
                      <Volume2 className="w-4 h-4" />
                      <span className="text-xs">पूरा सुनें</span>
                    </Button>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          {/* Contact Us */}
          <div className="bg-white rounded-lg shadow-md p-4 mt-4">
            <h2 className="text-lg font-bold mb-3 flex items-center gap-2">
              <Headphones className="w-5 h-5 text-green-600" />
              हमसे संपर्क करें
            </h2>

            <div className="grid gap-2 text-sm">
              <p>
                <span className="font-medium">ईमेल:</span> support@yojnasathi.gov.in
              </p>
              <p>
                <span className="font-medium">फोन:</span> 1800-11-0001 (टोल-फ्री)
              </p>
              <p>
                <span className="font-medium">समय:</span> सुबह 9 बजे से शाम 6 बजे तक (सोमवार से शनिवार)
              </p>
            </div>
          </div>
        </div>
      </ScrollArea>

      <Footer />
    </div>
  )
}

