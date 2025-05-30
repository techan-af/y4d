"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Heart, Plus, ArrowLeft, LogOut, Shield } from "lucide-react"
import Link from "next/link"
import AdminProtectedRoute from "@/components/admin-protected-route"
import { useAdminAuth } from "@/hooks/use-admin-auth"

function AdminPageContent() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const { admin, logout } = useAdminAuth()

  const [formData, setFormData] = useState({
    title: "",
    shortDescription: "",
    description: "",
    location: "",
    targetBeneficiaries: "",
    startDate: "",
    endDate: "",
    category: "",
    requirements: "",
    image: "",
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

    try {
      const projectData = {
        ...formData,
        targetBeneficiaries: Number.parseInt(formData.targetBeneficiaries),
        requirements: formData.requirements.split("\n").filter((req) => req.trim() !== ""),
        image: formData.image || "/placeholder.svg?height=400&width=600",
      }

      const response = await fetch("/api/admin/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(projectData),
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess("Project created successfully!")
        setFormData({
          title: "",
          shortDescription: "",
          description: "",
          location: "",
          targetBeneficiaries: "",
          startDate: "",
          endDate: "",
          category: "",
          requirements: "",
          image: "",
        })
      } else {
        setError(data.error || "Failed to create project")
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
              <span className="ml-2 text-xl font-bold text-gray-900">Y4D NGO - Admin</span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Shield className="h-4 w-4" />
                <span>Welcome, {admin?.username}</span>
              </div>
              <Link href="/admin/dashboard">
                <Button variant="outline">View All Projects</Button>
              </Link>
              <Link href="/dashboard">
                <Button variant="outline">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
              <Button variant="outline" onClick={logout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-2xl">
              <Plus className="h-6 w-6 mr-2 text-green-600" />
              Add New Project
            </CardTitle>
            <CardDescription>Create a new project for beneficiaries to register for.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Basic Information</h3>

                <div className="space-y-2">
                  <label htmlFor="title" className="text-sm font-medium">
                    Project Title *
                  </label>
                  <Input
                    id="title"
                    type="text"
                    placeholder="Enter project title"
                    value={formData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="shortDescription" className="text-sm font-medium">
                    Short Description *
                  </label>
                  <Textarea
                    id="shortDescription"
                    placeholder="Brief description for project cards"
                    value={formData.shortDescription}
                    onChange={(e) => handleInputChange("shortDescription", e.target.value)}
                    rows={2}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="description" className="text-sm font-medium">
                    Full Description *
                  </label>
                  <Textarea
                    id="description"
                    placeholder="Detailed project description"
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    rows={6}
                    required
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <label htmlFor="category" className="text-sm font-medium">
                      Category *
                    </label>
                    <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Education">Education</SelectItem>
                        <SelectItem value="Healthcare">Healthcare</SelectItem>
                        <SelectItem value="Skill Development">Skill Development</SelectItem>
                        <SelectItem value="Environment">Environment</SelectItem>
                        <SelectItem value="Women Empowerment">Women Empowerment</SelectItem>
                        <SelectItem value="Child Welfare">Child Welfare</SelectItem>
                        <SelectItem value="Rural Development">Rural Development</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="location" className="text-sm font-medium">
                      Location *
                    </label>
                    <Input
                      id="location"
                      type="text"
                      placeholder="Project location"
                      value={formData.location}
                      onChange={(e) => handleInputChange("location", e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <label htmlFor="targetBeneficiaries" className="text-sm font-medium">
                      Target Beneficiaries *
                    </label>
                    <Input
                      id="targetBeneficiaries"
                      type="number"
                      placeholder="Number of beneficiaries"
                      value={formData.targetBeneficiaries}
                      onChange={(e) => handleInputChange("targetBeneficiaries", e.target.value)}
                      min="1"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="startDate" className="text-sm font-medium">
                      Start Date *
                    </label>
                    <Input
                      id="startDate"
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => handleInputChange("startDate", e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="endDate" className="text-sm font-medium">
                      End Date *
                    </label>
                    <Input
                      id="endDate"
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => handleInputChange("endDate", e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="requirements" className="text-sm font-medium">
                    Eligibility Requirements
                  </label>
                  <Textarea
                    id="requirements"
                    placeholder="Enter each requirement on a new line"
                    value={formData.requirements}
                    onChange={(e) => handleInputChange("requirements", e.target.value)}
                    rows={4}
                  />
                  <p className="text-xs text-gray-500">Enter each requirement on a separate line</p>
                </div>

                <div className="space-y-2">
                  <label htmlFor="image" className="text-sm font-medium">
                    Image URL (Optional)
                  </label>
                  <Input
                    id="image"
                    type="url"
                    placeholder="https://example.com/image.jpg"
                    value={formData.image}
                    onChange={(e) => handleInputChange("image", e.target.value)}
                  />
                </div>
              </div>

              {/* Error and Success Messages */}
              {error && <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">{error}</div>}

              {success && <div className="text-sm text-green-600 bg-green-50 p-3 rounded-md">{success}</div>}

              {/* Submit Button */}
              <div className="flex gap-4">
                <Link href="/admin/dashboard" className="flex-1">
                  <Button type="button" variant="outline" className="w-full">
                    Cancel
                  </Button>
                </Link>
                <Button type="submit" className="flex-1 bg-green-600 hover:bg-green-700" disabled={isLoading}>
                  {isLoading ? "Creating..." : "Create Project"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

export default function AdminPage() {
  return (
    <AdminProtectedRoute>
      <AdminPageContent />
    </AdminProtectedRoute>
  )
}
