"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, CheckCircle, XCircle, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { schemes } from "@/lib/data"

export default function EligibilityCheckPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const schemeId = params.id
  const scheme = schemes.find((s) => s.id === schemeId)

  const [formData, setFormData] = useState({
    age: "",
    occupation: "",
    income: "",
    region: "",
  })

  const [eligibilityResult, setEligibilityResult] = useState<null | boolean>(null)

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Simple eligibility check logic (can be made more complex based on actual criteria)
    const isEligible =
      (formData.age === "18-60" || formData.age === "above60") &&
      (formData.income === "below2L" || formData.income === "2L-5L") &&
      formData.region !== ""

    setEligibilityResult(isEligible)
  }

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const resetForm = () => {
    setFormData({
      age: "",
      occupation: "",
      income: "",
      region: "",
    })
    setEligibilityResult(null)
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-primary text-primary-foreground p-4 shadow-md">
        <div className="container mx-auto">
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
            onClick={() => router.push(`/scheme/${schemeId}`)}
          >
            <ArrowLeft size={16} />
            Back to Scheme Details
          </Button>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl">Eligibility Check: {scheme.name}</CardTitle>
          </CardHeader>
          <CardContent>
            {eligibilityResult === null ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="age" className="text-base">
                      Age Group
                    </Label>
                    <RadioGroup
                      id="age"
                      value={formData.age}
                      onValueChange={(value) => handleChange("age", value)}
                      className="mt-2"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="below18" id="below18" />
                        <Label htmlFor="below18">Below 18 years</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="18-60" id="18-60" />
                        <Label htmlFor="18-60">18-60 years</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="above60" id="above60" />
                        <Label htmlFor="above60">Above 60 years</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div>
                    <Label htmlFor="occupation" className="text-base">
                      Occupation
                    </Label>
                    <Select value={formData.occupation} onValueChange={(value) => handleChange("occupation", value)}>
                      <SelectTrigger className="mt-2">
                        <SelectValue placeholder="Select occupation" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="farmer">Farmer</SelectItem>
                        <SelectItem value="student">Student</SelectItem>
                        <SelectItem value="salaried">Salaried Employee</SelectItem>
                        <SelectItem value="business">Business Owner</SelectItem>
                        <SelectItem value="unemployed">Unemployed</SelectItem>
                        <SelectItem value="retired">Retired</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="income" className="text-base">
                      Annual Income
                    </Label>
                    <RadioGroup
                      id="income"
                      value={formData.income}
                      onValueChange={(value) => handleChange("income", value)}
                      className="mt-2"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="below2L" id="below2L" />
                        <Label htmlFor="below2L">Below ₹2 Lakhs</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="2L-5L" id="2L-5L" />
                        <Label htmlFor="2L-5L">₹2 Lakhs - ₹5 Lakhs</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="5L-10L" id="5L-10L" />
                        <Label htmlFor="5L-10L">₹5 Lakhs - ₹10 Lakhs</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="above10L" id="above10L" />
                        <Label htmlFor="above10L">Above ₹10 Lakhs</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div>
                    <Label htmlFor="region" className="text-base">
                      Region
                    </Label>
                    <Select value={formData.region} onValueChange={(value) => handleChange("region", value)}>
                      <SelectTrigger className="mt-2">
                        <SelectValue placeholder="Select region" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="north">North India</SelectItem>
                        <SelectItem value="south">South India</SelectItem>
                        <SelectItem value="east">East India</SelectItem>
                        <SelectItem value="west">West India</SelectItem>
                        <SelectItem value="central">Central India</SelectItem>
                        <SelectItem value="northeast">North-East India</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 bg-muted rounded-lg mt-6 mb-2">
                  <div className="text-sm">
                    <span className="font-medium">Not sure about something?</span>
                    <p className="text-muted-foreground">Our assistant can help with your questions.</p>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={openChatbot}
                    className="flex items-center gap-1"
                  >
                    <MessageSquare className="h-3 w-3" />
                    Ask Assistant
                  </Button>
                </div>

                <Button type="submit" className="w-full">
                  Check Eligibility
                </Button>
              </form>
            ) : (
              <div className="text-center py-6">
                {eligibilityResult ? (
                  <div className="space-y-4">
                    <div className="flex justify-center">
                      <CheckCircle className="h-16 w-16 text-green-500" />
                    </div>
                    <h3 className="text-xl font-semibold text-green-600">You are eligible!</h3>
                    <p className="text-muted-foreground">
                      Based on the information provided, you are eligible for this scheme.
                    </p>
                    <div className="pt-4">
                      <a href={scheme.applyUrl} target="_blank" rel="noopener noreferrer">
                        <Button className="w-full sm:w-auto">Apply Now</Button>
                      </a>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex justify-center">
                      <XCircle className="h-16 w-16 text-red-500" />
                    </div>
                    <h3 className="text-xl font-semibold text-red-600">You are not eligible</h3>
                    <p className="text-muted-foreground">
                      Based on the information provided, you do not meet the eligibility criteria for this scheme.
                    </p>
                    <div className="pt-4 space-y-2">
                      <Button onClick={resetForm} variant="outline" className="w-full">
                        Check Again
                      </Button>
                      <Link href="/" className="block">
                        <Button variant="secondary" className="w-full">
                          Check Other Schemes
                        </Button>
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            )}
          </CardContent>
          {eligibilityResult !== null && (
            <CardFooter className="flex justify-center border-t pt-6">
              <div className="max-w-md text-center">
                <h4 className="font-medium mb-2">Similar Schemes</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  You might also be interested in these related schemes:
                </p>
                <div className="space-y-2">
                  {schemes
                    .filter((s) => s.id !== schemeId)
                    .slice(0, 2)
                    .map((s) => (
                      <Link key={s.id} href={`/scheme/${s.id}`} className="block">
                        <Button variant="outline" size="sm" className="w-full text-left justify-start">
                          {s.name}
                        </Button>
                      </Link>
                    ))}
                </div>
              </div>
            </CardFooter>
          )}
        </Card>
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

