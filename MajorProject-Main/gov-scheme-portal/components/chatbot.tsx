"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Send, X, MessageSquare, Bot } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { schemes } from "@/lib/data"
import { cn } from "@/lib/utils"

type Message = {
  id: string
  content: string
  role: "user" | "assistant"
  timestamp: Date
}

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      content: "Hello! I'm your Government Schemes Assistant. How can I help you today?",
      role: "assistant",
      timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
    },
    {
      id: "user-1",
      content: "I'm looking for schemes related to farming",
      role: "user",
      timestamp: new Date(Date.now() - 1000 * 60 * 4), // 4 minutes ago
    },
    {
      id: "assistant-1",
      content:
        "Based on your query, here are some schemes that might interest you:\n\n- **PM-KISAN**: Income support for small and marginal farmers.\n\nYou can click on any scheme name on our portal to view more details. Would you like more information about any of these schemes?",
      role: "assistant",
      timestamp: new Date(Date.now() - 1000 * 60 * 3.5), // 3.5 minutes ago
    },
    {
      id: "user-2",
      content: "Yes, tell me more about PM-KISAN eligibility",
      role: "user",
      timestamp: new Date(Date.now() - 1000 * 60 * 3), // 3 minutes ago
    },
    {
      id: "assistant-2",
      content:
        "For PM-KISAN, the eligibility criteria include:\n\n- Small and marginal farmers\n- Landholding size less than 2 hectares\n- Must have cultivable land in their name\n- Must have Aadhaar linked bank account\n\nYou can check your personal eligibility by visiting the scheme details page and clicking on 'Check Eligibility'.",
      role: "assistant",
      timestamp: new Date(Date.now() - 1000 * 60 * 2.5), // 2.5 minutes ago
    },
  ])
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  // const handleSendMessage = (e?: React.FormEvent) => {
  //   if (e) e.preventDefault()

  //   if (!input.trim()) return

  //   const userMessage: Message = {
  //     id: Date.now().toString(),
  //     content: input,
  //     role: "user",
  //     timestamp: new Date(),
  //   }

  //   setMessages((prev) => [...prev, userMessage])
  //   setInput("")
  //   setIsTyping(true)

  //   // Simulate AI response after a short delay
  //   setTimeout(() => {
  //     const response = generateResponse(input)
  //     const botMessage: Message = {
  //       id: (Date.now() + 1).toString(),
  //       content: response,
  //       role: "assistant",
  //       timestamp: new Date(),
  //     }

  //     setMessages((prev) => [...prev, botMessage])
  //     setIsTyping(false)
  //   }, 1000)
  // }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (!input.trim()) return;
  
    // Create the user message object
    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      role: "user",
      timestamp: new Date(),
    };
  
    // Add user message to chat
    setMessages((prev) => [...prev, userMessage]);
    setInput(""); 
    setIsTyping(true);
  
    // Fetch response from the API
    const botResponse = await fetchBotResponse(input);
  
    // Create bot message object
    const botMessage: Message = {
      id: (Date.now() + 1).toString(),
      content: botResponse,
      role: "assistant",
      timestamp: new Date(),
    };
  
    // Update messages with bot response
    setMessages((prev) => [...prev, botMessage]);
    setIsTyping(false);
  };
  
  // Function to fetch bot response from API
  async function fetchBotResponse(query: string): Promise<string> {
    try {
      const response = await fetch("https://govtschemes.app.n8n.cloud/webhook/chatbox", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });
  
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
  
      const data = await response.json();
      return data.response || "I couldn't find relevant information.";
    } catch (error) {
      console.error("Error fetching response:", error);
      return "Sorry, something went wrong. Please try again.";
    }
  }
  


  const generateResponse = (query: string): string => {
    const lowerQuery = query.toLowerCase()

    // Check for greetings
    if (
      lowerQuery.includes("hello") ||
      lowerQuery.includes("hi") ||
      lowerQuery.includes("hey") ||
      lowerQuery === "hi" ||
      lowerQuery === "hello"
    ) {
      return "Hello! I'm your Government Schemes Assistant. I can help you find schemes, check eligibility, or understand the application process. What kind of assistance are you looking for today?"
    }

    // Check for scheme search intent
    if (
      lowerQuery.includes("find scheme") ||
      lowerQuery.includes("search scheme") ||
      lowerQuery.includes("looking for scheme") ||
      lowerQuery.includes("scheme for") ||
      lowerQuery.includes("schemes for") ||
      lowerQuery.includes("help me find")
    ) {
      return findRelevantSchemes(lowerQuery)
    }

    // Check for eligibility questions
    if (lowerQuery.includes("eligible") || lowerQuery.includes("qualify") || lowerQuery.includes("eligibility")) {
      // Check if asking about a specific scheme
      for (const scheme of schemes) {
        if (lowerQuery.includes(scheme.name.toLowerCase()) || lowerQuery.includes(scheme.id.toLowerCase())) {
          return `For ${scheme.name}, the eligibility criteria include:\n\n${scheme.eligibilityCriteria.map((c) => `- ${c}`).join("\n")}\n\nYou can check your personal eligibility by visiting the scheme details page and clicking on 'Check Eligibility'.`
        }
      }

      return "Eligibility varies by scheme. You can check your eligibility by visiting the scheme details page and clicking on 'Check Eligibility'. Would you like me to help you find a specific scheme?"
    }

    // Check for benefits questions
    if (lowerQuery.includes("benefit") || lowerQuery.includes("advantages") || lowerQuery.includes("perks")) {
      // Check if asking about a specific scheme
      for (const scheme of schemes) {
        if (lowerQuery.includes(scheme.name.toLowerCase()) || lowerQuery.includes(scheme.id.toLowerCase())) {
          return `The benefits of ${scheme.name} include:\n\n${scheme.benefits.map((b) => `- ${b}`).join("\n")}`
        }
      }

      return "Each government scheme offers different benefits. Would you like me to help you find a specific scheme so I can tell you about its benefits?"
    }

    // Check for application process questions
    if (
      lowerQuery.includes("how to apply") ||
      lowerQuery.includes("application process") ||
      lowerQuery.includes("apply for") ||
      lowerQuery.includes("register")
    ) {
      // Check if asking about a specific scheme
      for (const scheme of schemes) {
        if (lowerQuery.includes(scheme.name.toLowerCase()) || lowerQuery.includes(scheme.id.toLowerCase())) {
          return `To apply for ${scheme.name}, you need to visit the official website at ${scheme.applyUrl}. Make sure you have all the required documents ready before starting the application process.`
        }
      }

      return "To apply for a government scheme, you'll need to visit the official website of the scheme. You can find the link by viewing the scheme details on our portal. Would you like me to help you find a specific scheme?"
    }

    // Check for document questions
    if (
      lowerQuery.includes("document") ||
      lowerQuery.includes("papers") ||
      lowerQuery.includes("id") ||
      lowerQuery.includes("identification")
    ) {
      return "Most schemes require basic documents like:\n\n- Aadhaar Card\n- PAN Card\n- Income certificate\n- Bank account details\n- Residence proof\n\nThe specific requirements vary by scheme. You can find detailed information on the scheme's official website."
    }

    // Check for specific scheme questions
    for (const scheme of schemes) {
      if (lowerQuery.includes(scheme.name.toLowerCase()) || lowerQuery.includes(scheme.id.toLowerCase())) {
        return `**${scheme.name}**: ${scheme.description}\n\nYou can view more details about this scheme on our portal. Would you like me to tell you about the eligibility criteria or benefits?`
      }
    }

    // Check for help or assistance
    if (
      lowerQuery.includes("help") ||
      lowerQuery.includes("assist") ||
      lowerQuery.includes("support") ||
      lowerQuery.includes("guide")
    ) {
      return "I can help you with:\n\n- Finding schemes that match your needs\n- Understanding eligibility criteria\n- Learning about scheme benefits\n- Guidance on the application process\n\nWhat would you like help with today?"
    }

    // Check for thank you
    if (lowerQuery.includes("thank") || lowerQuery.includes("thanks")) {
      return "You're welcome! If you have any more questions about government schemes, feel free to ask. I'm here to help!"
    }

    // Default response
    return "I'm here to help you find and understand government schemes. You can ask me about specific schemes, eligibility criteria, or how to apply. If you're looking for a scheme, please tell me what kind of assistance you need."
  }

  const findRelevantSchemes = (query: string): string => {
    const keywords = [
      { words: ["farm", "agriculture", "land", "crop", "farmer", "farming"], schemes: ["pm-kisan"] },
      {
        words: [
          "health",
          "medical",
          "hospital",
          "treatment",
          "insurance",
          "healthcare",
          "doctor",
          "illness",
          "disease",
        ],
        schemes: ["pmjay"],
      },
      { words: ["house", "home", "housing", "shelter", "accommodation", "rent", "property"], schemes: ["pmay"] },
      { words: ["bank", "account", "financial", "inclusion", "banking", "savings", "money"], schemes: ["pmjdy"] },
      { words: ["accident", "injury", "disability", "protection", "safety"], schemes: ["pmsby"] },
      { words: ["life", "insurance", "death", "family protection", "security"], schemes: ["pmjjby"] },
      { words: ["student", "education", "school", "college", "scholarship", "study"], schemes: ["pmjdy", "pmjjby"] },
      { words: ["senior", "old", "elderly", "pension", "retirement"], schemes: ["pmjjby", "pmsby"] },
      { words: ["woman", "women", "female", "girl", "mother"], schemes: ["pmay", "pmjdy"] },
      { words: ["poor", "poverty", "low income", "bpl", "economically weak"], schemes: ["pmjay", "pmay", "pmjdy"] },
    ]

    const matchedSchemeIds = new Set<string>()

    // Check for keyword matches
    for (const keyword of keywords) {
      if (keyword.words.some((word) => query.includes(word))) {
        keyword.schemes.forEach((schemeId) => matchedSchemeIds.add(schemeId))
      }
    }

    if (matchedSchemeIds.size === 0) {
      return "I couldn't find specific schemes matching your query. Please try describing your needs more specifically, or you can browse all schemes on our home page."
    }

    const matchedSchemes = schemes.filter((scheme) => matchedSchemeIds.has(scheme.id))

    let response = "Based on your query, here are some schemes that might interest you:\n\n"

    matchedSchemes.forEach((scheme) => {
      response += `- **${scheme.name}**: ${scheme.shortDescription}\n`
    })

    response +=
      "\nYou can click on any scheme name on our portal to view more details. Would you like more information about any of these schemes?"

    return response
  }

  return (
    <>
      {/* Chat Button */}
      <Button
        onClick={() => setIsOpen(true)}
        className={cn("fixed bottom-4 right-4 rounded-full p-3 shadow-lg z-50", isOpen ? "hidden" : "flex")}
        size="icon"
        aria-label="Open Chat"
      >
        <MessageSquare className="h-6 w-6" />
        <span className="sr-only">Open Chat</span>
      </Button>

      {/* Chat Window */}
      <div
        className={cn(
          "fixed bottom-4 right-4 z-50 w-full max-w-[370px] transition-all duration-300 ease-in-out",
          isOpen ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0 pointer-events-none",
        )}
      >
        <Card className="border shadow-xl">
          <CardHeader className="p-4 border-b">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bot className="h-5 w-5 text-primary" />
                <CardTitle className="text-lg">Scheme Assistant</CardTitle>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                <X className="h-5 w-5" />
                <span className="sr-only">Close</span>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="h-[350px] overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    "flex flex-col max-w-[80%] rounded-lg p-3",
                    message.role === "user" ? "ml-auto bg-primary text-primary-foreground" : "mr-auto bg-muted",
                  )}
                >
                  <span className="whitespace-pre-line">{message.content}</span>
                  <span
                    className={cn(
                      "text-xs mt-1",
                      message.role === "user" ? "text-primary-foreground/70" : "text-muted-foreground",
                    )}
                  >
                    {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </span>
                </div>
              ))}
              {isTyping && (
                <div className="flex max-w-[80%] mr-auto bg-muted rounded-lg p-3">
                  <span className="animate-pulse">Typing...</span>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </CardContent>
          <CardFooter className="p-3 border-t">
            <form onSubmit={handleSendMessage} className="flex w-full gap-2">
              <Input
                placeholder="Type your message..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-1"
              />
              <Button type="submit" size="icon" disabled={!input.trim() || isTyping}>
                <Send className="h-4 w-4" />
                <span className="sr-only">Send</span>
              </Button>
            </form>
          </CardFooter>
        </Card>
      </div>
    </>
  )
}

