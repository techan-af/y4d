"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Heart, Users, MapPin, Calendar, ArrowLeft, UserPlus, CheckCircle } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import type { Project } from "@/lib/types"

export default function ProjectDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [project, setProject] = useState<Project | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    if (params.id) {
      fetchProject(params.id as string)
    }
  }, [params.id])

  const fetchProject = async (id: string) => {
    try {
      const response = await fetch(`/api/projects/${id}`)
      if (response.ok) {
        const data = await response.json()
        setProject(data)
      } else if (response.status === 404) {
        setError("Project not found")
      } else {
        setError("Failed to load project")
      }
    } catch (error) {
      console.error("Error fetching project:", error)
      setError("Failed to load project")
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading project details...</p>
        </div>
      </div>
    )
  }

  if (error || !project) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">{error || "Project Not Found"}</h1>
          <p className="text-gray-600 mb-6">
            {error === "Project not found"
              ? "The project you're looking for doesn't exist or has been removed."
              : "There was an error loading the project details."}
          </p>
          <Link href="/dashboard">
            <Button className="bg-green-600 hover:bg-green-700">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  const progressPercentage = (project.currentBeneficiaries / project.targetBeneficiaries) * 100
  const isProjectFull = project.currentBeneficiaries >= project.targetBeneficiaries

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
            <Link href="/dashboard">
              <Button variant="outline">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Project Details */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader className="p-0">
                <Image
                  src={project.image || "/placeholder.svg"}
                  width={800}
                  height={400}
                  alt={project.title}
                  className="w-full h-64 object-cover rounded-t-lg"
                />
              </CardHeader>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    {project.category}
                  </Badge>
                  <div className="flex items-center text-sm text-gray-500">
                    <Users className="h-4 w-4 mr-1" />
                    {project.currentBeneficiaries} of {project.targetBeneficiaries} registered
                  </div>
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-4">{project.title}</h1>
                <div className="prose max-w-none text-gray-600">
                  <p className="text-lg leading-relaxed whitespace-pre-line">{project.description}</p>
                </div>
              </CardContent>
            </Card>

            {/* Requirements */}
            {project.requirements && project.requirements.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <CheckCircle className="h-5 w-5 mr-2 text-green-600" />
                    Eligibility Requirements
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {project.requirements.map((requirement, index) => (
                      <li key={index} className="flex items-start">
                        <div className="w-2 h-2 bg-green-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <span className="text-gray-700">{requirement}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Registration Card */}
            <Card>
              <CardHeader>
                <CardTitle>Register for this Project</CardTitle>
                <CardDescription>
                  {project.status === "closed"
                    ? "This project is currently closed for new registrations."
                    : project.status === "completed"
                      ? "This project has been completed."
                      : project.status === "paused"
                        ? "This project is temporarily paused."
                        : isProjectFull
                          ? "This project has reached its maximum capacity."
                          : "Join this program and be part of positive change in your community."}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Registration Progress</span>
                    <span>
                      {project.currentBeneficiaries}/{project.targetBeneficiaries}
                    </span>
                  </div>
                  <Progress value={progressPercentage} className="h-2" />
                  <p className="text-xs text-gray-500">{Math.round(progressPercentage)}% of target reached</p>
                </div>

                {project.status === "closed" ||
                project.status === "completed" ||
                project.status === "paused" ||
                isProjectFull ? (
                  <Button disabled className="w-full">
                    {project.status === "closed"
                      ? "Registration Closed"
                      : project.status === "completed"
                        ? "Project Completed"
                        : project.status === "paused"
                          ? "Project Paused"
                          : "Project Full"}
                  </Button>
                ) : (
                  <Link href={`/projects/${project._id}/register`}>
                    <Button className="w-full bg-green-600 hover:bg-green-700">
                      <UserPlus className="h-4 w-4 mr-2" />
                      Register Now
                    </Button>
                  </Link>
                )}
              </CardContent>
            </Card>

            {/* Project Info */}
            <Card>
              <CardHeader>
                <CardTitle>Project Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center text-sm">
                  <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                  <span>{project.location}</span>
                </div>
                <div className="flex items-center text-sm">
                  <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                  <span>
                    {new Date(project.startDate).toLocaleDateString()} -{" "}
                    {new Date(project.endDate).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center text-sm">
                  <Users className="h-4 w-4 mr-2 text-gray-500" />
                  <span>Target: {project.targetBeneficiaries} beneficiaries</span>
                </div>
                {project.status && (
                  <div className="flex items-center text-sm">
                    <div
                      className={`w-2 h-2 rounded-full mr-2 ${
                        project.status === "active"
                          ? "bg-green-500"
                          : project.status === "completed"
                            ? "bg-blue-500"
                            : "bg-gray-500"
                      }`}
                    ></div>
                    <span className="capitalize">{project.status}</span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Contact Info */}
            <Card>
              <CardHeader>
                <CardTitle>Need Help?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">
                  Have questions about this project? Contact our support team.
                </p>
                <div className="space-y-2 text-sm">
                  <p>
                    <strong>Email:</strong> support@y4d.ngo
                  </p>
                  <p>
                    <strong>Phone:</strong> +91 98765 43210
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
