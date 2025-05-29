"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Heart, Save, ArrowLeft } from "lucide-react"
import Link from "next/link"
import type { Project } from "@/lib/types"

export default function EditProjectPage() {
  const params = useParams()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

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
    status: "active",
  })

  useEffect(() => {
    if (params.id) {
      fetchProject(params.id as string)
    }
  }, [params.id])

  const fetchProject = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/projects/${id}`)
      if (response.ok) {
        const project: Project = await response.json()
        setFormData({
          title: project.title,
          shortDescription: project.shortDescription,
          description: project.description,
          location: project.location,
          targetBeneficiaries: project.targetBeneficiaries.toString(),
          startDate: project.startDate,
          endDate: project.endDate,
          category: project.category,
          requirements: project.requirements.join("\n"),
          image: project.image || "",
          status: project.status || "active",
        })
      } else {
        setError("Project not found")
      }
    } catch (error) {
      console.error("Error fetching project:", error)
      setError("Failed to load project")
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setError("")
    setSuccess("")

    try {
      const projectData = {
        ...formData,
        targetBeneficiaries: Number.parseInt(formData.targetBeneficiaries),
        requirements: formData.requirements.split("\n").filter((req) => req.trim() !== ""),
        image: formData.image || "/placeholder.svg?height=400&width=600",
      }

      const response = await fetch(`/api/admin/projects/${params.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(projectData),
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess("Project updated successfully!")
        setTimeout(() => {
          router.push("/admin/dashboard")
        }, 2000)
      } else {
        setError(data.error || "Failed to update project")
      }
    } catch (error) {
      setError("An error occurred. Please try again.")
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading project...</p>
        </div>
      </div>
    )
  }

  if (error && !formData.title) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Project Not Found</h1>
          <p className="text-gray-600 mb-6">The project you're trying to edit doesn't exist.</p>
          <Link href="/admin/dashboard">
            <Button className="bg-green-600 hover:bg-green-700">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <Heart className="h-8 w-8 text-green-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">Y4D NGO - Edit Project</span>
            </div>
            <Link href="/admin/dashboard">
              <Button variant="outline">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-2xl">
              <Save className="h-6 w-6 mr-2 text-green-600" />
              Edit Project
            </CardTitle>
            <CardDescription>Update project information and settings.</CardDescription>
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
                    <label htmlFor="status" className="text-sm font-medium">
                      Project Status *
                    </label>
                    <Select value={formData.status} onValueChange={(value) => handleInputChange("status", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="closed">Closed</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="paused">Paused</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
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
                <Button type="submit" className="flex-1 bg-green-600 hover:bg-green-700" disabled={isSaving}>
                  {isSaving ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
