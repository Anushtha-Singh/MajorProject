"use client"

import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, ExternalLink, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { schemes } from "@/lib/data"

export default function SchemeDetailsPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const schemeId = params.id
  const scheme = schemes.find((s) => s.id === schemeId)

  const openChatbot = () => {
    const chatbotButton = document.querySelector('[aria-label="Open Chat"]') as HTMLButtonElement
    if (chatbotButton) chatbotButton.click()
  }

  if (!scheme) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">Scheme Not Found</h1>
        <p className="mb-6">The scheme you are looking for does not exist.</p>
        <Button onClick={() => router.push("/")}>Back to Home</Button>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-primary text-primary-foreground p-4 shadow-md">
        <div className="container mx-auto">
          <Button variant="outline" size="sm" className="flex items-center gap-2" onClick={() => router.push("/")}>
            <ArrowLeft size={16} />
            Back to Search
          </Button>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8">
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle className="text-3xl">{scheme.name}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <section>
              <h2 className="text-xl font-semibold mb-2">Description</h2>
              <p className="text-muted-foreground">{scheme.description}</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-2">Eligibility Criteria</h2>
              <ul className="list-disc pl-5 space-y-1">
                {scheme.eligibilityCriteria.map((criteria, index) => (
                  <li key={index} className="text-muted-foreground">
                    {criteria}
                  </li>
                ))}
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-2">Benefits</h2>
              <ul className="list-disc pl-5 space-y-1">
                {scheme.benefits.map((benefit, index) => (
                  <li key={index} className="text-muted-foreground">
                    {benefit}
                  </li>
                ))}
              </ul>
            </section>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <a href={scheme.applyUrl} target="_blank" rel="noopener noreferrer" className="flex-1">
                <Button className="w-full flex items-center gap-2">
                  Apply Now
                  <ExternalLink size={16} />
                </Button>
              </a>
              <Link href={`/eligibility/${scheme.id}`} className="flex-1">
                <Button variant="outline" className="w-full">
                  Check Eligibility
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <section className="max-w-4xl mx-auto mt-8">
          <h2 className="text-xl font-semibold mb-4">Additional Resources</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Frequently Asked Questions</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Find answers to common questions about this scheme.</p>
                <Button variant="link" className="p-0 mt-2">
                  View FAQs
                </Button>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Required Documents</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Learn about the documents needed for application.</p>
                <Button variant="link" className="p-0 mt-2">
                  View Document List
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="max-w-4xl mx-auto mt-8 p-4 bg-muted rounded-lg flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">Have questions about this scheme?</h2>
            <p className="text-muted-foreground">Our AI assistant can help answer your queries.</p>
          </div>
          <Button onClick={openChatbot} className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            Ask Assistant
          </Button>
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

