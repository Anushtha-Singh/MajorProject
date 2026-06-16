"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Search, MessageSquare } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { schemes } from "@/lib/data"

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState(schemes)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()

    if (!searchQuery.trim()) {
      setSearchResults(schemes)
      return
    }

    const filteredResults = schemes.filter(
      (scheme) =>
        scheme.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        scheme.shortDescription.toLowerCase().includes(searchQuery.toLowerCase()),
    )

    setSearchResults(filteredResults)
  }

  const openChatbot = () => {
    const chatbotButton = document.querySelector('[aria-label="Open Chat"]') as HTMLButtonElement
    if (chatbotButton) chatbotButton.click()
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-primary text-primary-foreground p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <Link href="/" className="text-xl font-bold">
            GovSchemes
          </Link>
          <nav className="hidden md:flex space-x-4">
            <Link href="/" className="hover:underline">
              Home
            </Link>
            <Link href="#" className="hover:underline">
              About
            </Link>
            <Link href="#" className="hover:underline">
              Contact
            </Link>
          </nav>
          <Button variant="outline" className="md:hidden" size="icon">
            <span className="sr-only">Menu</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </Button>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8">
        <section className="mb-12 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Find Government Schemes</h1>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Search for government schemes that you may be eligible for and learn how to apply.
          </p>

          <form onSubmit={handleSearch} className="max-w-2xl mx-auto flex flex-col md:flex-row gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search for schemes..."
                className="pl-10 w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button type="submit">Search</Button>
          </form>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-6">
            {searchQuery ? `Search Results (${searchResults.length})` : "Available Schemes"}
          </h2>

          {searchResults.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No schemes found matching your search.</p>
              <Button
                variant="link"
                onClick={() => {
                  setSearchQuery("")
                  setSearchResults(schemes)
                }}
              >
                View all schemes
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {searchResults.map((scheme) => (
                <Card key={scheme.id} className="h-full flex flex-col">
                  <CardHeader>
                    <CardTitle>{scheme.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex-1">
                    <p className="text-muted-foreground">{scheme.shortDescription}</p>
                  </CardContent>
                  <CardFooter>
                    <Link href={`/scheme/${scheme.id}`} className="w-full">
                      <Button variant="outline" className="w-full">
                        View Details
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </section>

        <section className="mt-16 mb-12 text-center">
          <div className="bg-muted rounded-lg p-6 max-w-3xl mx-auto">
            <h2 className="text-2xl font-semibold mb-4">Need Help Finding Schemes?</h2>
            <p className="text-muted-foreground mb-6">
              Our AI assistant can help you discover schemes based on your needs, answer questions about eligibility,
              and guide you through the application process.
            </p>
            <Button onClick={openChatbot} className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Chat with Scheme Assistant
            </Button>
          </div>
        </section>
      </main>

      <footer className="bg-muted py-6 mt-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-muted-foreground mb-4 md:mb-0">© 2025 GovSchemes. All rights reserved.</p>
            <div className="flex space-x-4">
              <Link href="#" className="text-muted-foreground hover:text-foreground">
                Contact Us
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-foreground">
                Privacy Policy
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-foreground">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

