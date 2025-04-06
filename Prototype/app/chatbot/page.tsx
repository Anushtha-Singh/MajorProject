"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Mic, MicOff, Volume2, Send, ArrowLeft, ThumbsUp, ThumbsDown } from "lucide-react"
import Link from "next/link"
import Footer from "@/components/footer"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"

// Types for our chat messages
type MessageType = {
  id: string
  sender: "user" | "bot"
  text: string
  timestamp: Date
  schemes?: SchemeType[]
  isListening?: boolean
}

type SchemeType = {
  id: number
  name: string
  nameEn: string
  category: string
  summary: string
}

export default function ChatbotPage() {
  const [messages, setMessages] = useState<MessageType[]>([])
  const [inputText, setInputText] = useState("")
  const [isListening, setIsListening] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Sample schemes data
  const sampleSchemes = [
    {
      id: 1,
      name: "प्रधानमंत्री किसान सम्मान निधि",
      nameEn: "PM Kisan Samman Nidhi",
      category: "farming",
      summary: "किसानों को हर 4 महीने में ₹2,000 की आर्थिक सहायता",
    },
    {
      id: 2,
      name: "किसान क्रेडिट कार्ड",
      nameEn: "Kisan Credit Card",
      category: "farming",
      summary: "किसानों के लिए आसान ऋण सुविधा",
    },
  ]

  // Initialize with a welcome message
  useEffect(() => {
    setMessages([
      {
        id: "1",
        sender: "bot",
        text: "नमस्ते! आप किस तरह की योजना चाहते हैं? कृपया बोलिए...",
        timestamp: new Date(),
      },
    ])
  }, [])

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Simulate speech recognition
  useEffect(() => {
    if (isListening) {
      // Add a temporary message showing we're listening
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          sender: "user",
          text: "",
          timestamp: new Date(),
          isListening: true,
        },
      ])

      // Simulate speech recognition after 3 seconds
      const timer = setTimeout(() => {
        setIsListening(false)

        // Replace the temporary message with the actual transcription
        setMessages((prev) => {
          const newMessages = [...prev]
          const listeningMsgIndex = newMessages.findIndex((msg) => msg.isListening)

          if (listeningMsgIndex !== -1) {
            newMessages[listeningMsgIndex] = {
              id: Date.now().toString(),
              sender: "user",
              text: "किसान योजना बताओ",
              timestamp: new Date(),
            }
          }

          return newMessages
        })

        // Simulate bot response after a short delay
        setTimeout(() => {
          respondToUser("किसान योजना बताओ")
        }, 1000)
      }, 3000)

      return () => clearTimeout(timer)
    }
  }, [isListening])

  // Function to handle user input submission
  const handleSubmit = () => {
    if (!inputText.trim()) return

    // Add user message
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        sender: "user",
        text: inputText,
        timestamp: new Date(),
      },
    ])

    // Clear input
    setInputText("")

    // Simulate bot response
    setTimeout(() => {
      respondToUser(inputText)
    }, 1000)
  }

  // Function to simulate bot responses
  const respondToUser = (userInput: string) => {
    const lowerInput = userInput.toLowerCase()

    if (lowerInput.includes("किसान") || lowerInput.includes("kisan") || lowerInput.includes("farmer")) {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          sender: "bot",
          text: "किसानों के लिए निम्नलिखित योजनाएं उपलब्ध हैं:",
          timestamp: new Date(),
          schemes: sampleSchemes,
        },
      ])

      // Follow-up question after a delay
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now().toString(),
            sender: "bot",
            text: "क्या आप इनमें से किसी योजना के बारे में अधिक जानकारी चाहते हैं या आवेदन करना चाहते हैं?",
            timestamp: new Date(),
          },
        ])
      }, 2000)
    } else if (
      lowerInput.includes("हां") ||
      lowerInput.includes("हाँ") ||
      lowerInput.includes("yes") ||
      lowerInput.includes("apply")
    ) {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          sender: "bot",
          text: "आप किस योजना के लिए आवेदन करना चाहते हैं? कृपया योजना का नाम बताएं या नीचे दिए गए बटन पर क्लिक करें।",
          timestamp: new Date(),
        },
      ])
    } else {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          sender: "bot",
          text: "मुझे समझ नहीं आया। क्या आप कृपया दोबारा बता सकते हैं कि आप किस प्रकार की योजना के बारे में जानना चाहते हैं?",
          timestamp: new Date(),
        },
      ])
    }
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
            <h1 className="text-xl font-bold">Voice Chatbot</h1>
          </div>
        </div>
      </header>

      {/* Chat Messages */}
      <ScrollArea className="flex-1 p-4 pb-24">
        <div className="max-w-3xl mx-auto">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"} mb-4`}
            >
              <div
                className={`flex items-start gap-3 max-w-[80%] ${message.sender === "user" ? "flex-row-reverse" : ""}`}
              >
                <Avatar className="w-8 h-8">
                  <AvatarImage src={message.sender === "bot" ? "/placeholder.svg?height=32&width=32" : ""} />
                  <AvatarFallback>{message.sender === "bot" ? "YS" : "U"}</AvatarFallback>
                </Avatar>

                <div className={`rounded-lg p-3 ${message.sender === "user" ? "bg-green-600 text-white" : "bg-white"}`}>
                  {message.isListening ? (
                    <div className="flex items-center gap-2 min-w-[150px]">
                      <div className="animate-pulse">सुन रहा हूँ...</div>
                      <div className="flex items-center gap-1">
                        {[...Array(3)].map((_, i) => (
                          <div
                            key={i}
                            className="w-2 bg-white rounded-full animate-bounce"
                            style={{
                              height: "8px",
                              animationDelay: `${i * 0.15}s`,
                            }}
                          ></div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <>
                      <p className={message.sender === "user" ? "text-white" : "text-gray-800"}>{message.text}</p>

                      {/* If the message has schemes, render them */}
                      {message.schemes && (
                        <div className="mt-3 grid gap-3">
                          {message.schemes.map((scheme) => (
                            <Card key={scheme.id} className="overflow-hidden">
                              <CardContent className="p-3">
                                <div className="flex flex-col">
                                  <h4 className="font-bold text-sm">{scheme.name}</h4>
                                  <p className="text-xs text-gray-600">{scheme.nameEn}</p>
                                  <p className="text-xs mt-1">{scheme.summary}</p>

                                  <div className="flex items-center mt-2 gap-2">
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="h-7 rounded-full flex items-center gap-1 bg-orange-50 border-orange-300 text-orange-700 text-xs px-2"
                                    >
                                      <Volume2 className="w-3 h-3" />
                                      <span>सुनें</span>
                                    </Button>

                                    <Link href={`/scheme/${scheme.id}`}>
                                      <Button
                                        size="sm"
                                        className="h-7 rounded-full bg-green-600 hover:bg-green-700 text-xs px-2"
                                      >
                                        अधिक जानें
                                      </Button>
                                    </Link>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      )}

                      {/* Feedback buttons for bot messages */}
                      {message.sender === "bot" && !message.schemes && (
                        <div className="flex items-center gap-2 mt-2">
                          <Button variant="ghost" size="icon" className="w-6 h-6 rounded-full">
                            <ThumbsUp className="w-3 h-3" />
                          </Button>
                          <Button variant="ghost" size="icon" className="w-6 h-6 rounded-full">
                            <ThumbsDown className="w-3 h-3" />
                          </Button>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Input Area */}
      <div className="sticky bottom-16 bg-orange-50 p-4 border-t border-gray-200">
        <div className="max-w-3xl mx-auto flex items-end gap-2">
          <Button
            onClick={() => setIsListening(!isListening)}
            className={`rounded-full p-3 ${isListening ? "bg-red-500 hover:bg-red-600" : "bg-green-600 hover:bg-green-700"}`}
          >
            {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </Button>

          <Textarea
            placeholder="टाइप करें या बोलने के लिए माइक बटन दबाएं..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="resize-none rounded-xl"
            rows={1}
          />

          <Button
            onClick={handleSubmit}
            disabled={!inputText.trim()}
            className="rounded-full p-3 bg-orange-500 hover:bg-orange-600"
          >
            <Send className="w-5 h-5" />
          </Button>
        </div>
      </div>

      <Footer />
    </div>
  )
}

