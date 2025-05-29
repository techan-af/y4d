"use client"

import type React from "react"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Heart, ArrowLeft, UserPlus } from "lucide-react"
import Link from "next/link"

export default function ProjectRegistrationPage() {
  const params = useParams()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    aadhaarCard: "",
    address: "",
    age: "",
    gender: "",
    occupation: "",
    familySize: "",
    monthlyIncome: "",
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setSuccess("")

    // Basic validation
    if (!formData.name || !formData.email || !formData.phone || !formData.aadhaarCard) {
      setError("Please fill in all required fields")
      setIsLoading(false)
      return
    }

    // Validate Aadhaar card format (12 digits)
    if (!/^\d{12}$/.test(formData.aadhaarCard)) {
      setError("Aadhaar card must be 12 digits")
      setIsLoading(false)
      return
    }

    // Validate phone number (10 digits)
    if (!/^\d{10}$/.test(formData.phone)) {
      setError("Phone number must be 10 digits")
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch(`/api/projects/${params.id}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          age: Number.parseInt(formData.age),
          familySize: Number.parseInt(formData.familySize),
          monthlyIncome: Number.parseFloat(formData.monthlyIncome),
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess("Registration successful! You will be contacted soon with further details.")
        setTimeout(() => {
          router.push(`/projects/${params.id}`)
        }, 3000)
      } else {
        setError(data.error || "Registration failed")
      }
    } catch (error) {
      setError("An error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <Heart className="h-8 w-8 text-green-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">Y4D NGO</span>
            </div>
            <Link href={`/projects/${params.id}`}>
              <Button variant="outline">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Project
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-2xl">
              <UserPlus className="h-6 w-6 mr-2 text-green-600" />
              Project Registration
            </CardTitle>
            <CardDescription>
              Please fill out the form below to register for this project. All fields marked with * are required.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium">
                      Full Name *
                    </label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="Enter your full name"
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium">
                      Email Address *
                    </label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <label htmlFor="phone" className="text-sm font-medium">
                      Phone Number *
                    </label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="10-digit mobile number"
                      value={formData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      maxLength={10}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="aadhaar" className="text-sm font-medium">
                      Aadhaar Card Number *
                    </label>
                    <Input
                      id="aadhaar"
                      type="text"
                      placeholder="12-digit Aadhaar number"
                      value={formData.aadhaarCard}
                      onChange={(e) => handleInputChange("aadhaarCard", e.target.value)}
                      maxLength={12}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="address" className="text-sm font-medium">
                    Address *
                  </label>
                  <Textarea
                    id="address"
                    placeholder="Enter your complete address"
                    value={formData.address}
                    onChange={(e) => handleInputChange("address", e.target.value)}
                    required
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <label htmlFor="age" className="text-sm font-medium">
                      Age *
                    </label>
                    <Input
                      id="age"
                      type="number"
                      placeholder="Age"
                      value={formData.age}
                      onChange={(e) => handleInputChange("age", e.target.value)}
                      min="18"
                      max="100"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="gender" className="text-sm font-medium">
                      Gender *
                    </label>
                    <Select value={formData.gender} onValueChange={(value) => handleInputChange("gender", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                        <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="familySize" className="text-sm font-medium">
                      Family Size
                    </label>
                    <Input
                      id="familySize"
                      type="number"
                      placeholder="Number of family members"
                      value={formData.familySize}
                      onChange={(e) => handleInputChange("familySize", e.target.value)}
                      min="1"
                    />
                  </div>
                </div>
              </div>

              {/* Economic Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Economic Information</h3>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <label htmlFor="occupation" className="text-sm font-medium">
                      Current Occupation
                    </label>
                    <Input
                      id="occupation"
                      type="text"
                      placeholder="Enter your occupation"
                      value={formData.occupation}
                      onChange={(e) => handleInputChange("occupation", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="monthlyIncome" className="text-sm font-medium">
                      Monthly Income (₹)
                    </label>
                    <Input
                      id="monthlyIncome"
                      type="number"
                      placeholder="Monthly income in rupees"
                      value={formData.monthlyIncome}
                      onChange={(e) => handleInputChange("monthlyIncome", e.target.value)}
                      min="0"
                    />
                  </div>
                </div>
              </div>

              {/* Error and Success Messages */}
              {error && <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">{error}</div>}

              {success && <div className="text-sm text-green-600 bg-green-50 p-3 rounded-md">{success}</div>}

              {/* Submit Button */}
              <div className="flex gap-4">
                <Link href={`/projects/${params.id}`} className="flex-1">
                  <Button type="button" variant="outline" className="w-full">
                    Cancel
                  </Button>
                </Link>
                <Button type="submit" className="flex-1 bg-green-600 hover:bg-green-700" disabled={isLoading}>
                  {isLoading ? "Submitting..." : "Submit Registration"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
