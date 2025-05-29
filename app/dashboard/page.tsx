"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Heart, Users, MapPin, Calendar, ArrowRight, LogOut, Plus } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import type { Project } from "@/lib/types"

export default function DashboardPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSeeding, setIsSeeding] = useState(false)
  const router = useRouter()

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    try {
      const response = await fetch("/api/projects")
      if (response.ok) {
        const data = await response.json()
        // Filter to show only active projects for regular users
        const activeProjects = data.filter((project: Project) => project.status === "active" || !project.status)
        setProjects(activeProjects)
      }
    } catch (error) {
      console.error("Error fetching projects:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSeedDatabase = async () => {
    setIsSeeding(true)
    try {
      const response = await fetch("/api/seed", { method: "POST" })
      if (response.ok) {
        await fetchProjects() // Refresh projects after seeding
      }
    } catch (error) {
      console.error("Error seeding database:", error)
    } finally {
      setIsSeeding(false)
    }
  }

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" })
      router.push("/")
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading projects...</p>
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
              <span className="ml-2 text-xl font-bold text-gray-900">Y4D NGO</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-600">Welcome to the Dashboard</span>
              <Button variant="outline" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Available Projects</h1>
          <p className="text-gray-600">
            Explore our current projects and register for programs that match your needs and interests.
          </p>
        </div>

        {projects.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-500 mb-6">
              <Users className="h-16 w-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-xl font-medium mb-2">No Projects Available</h3>
              <p className="text-gray-400 mb-6">
                It looks like there are no projects in the database yet. You can seed the database with sample projects
                to get started.
              </p>
              <Button onClick={handleSeedDatabase} disabled={isSeeding} className="bg-green-600 hover:bg-green-700">
                {isSeeding ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Seeding Database...
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4 mr-2" />
                    Seed Database with Sample Projects
                  </>
                )}
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <Card key={project._id} className="group hover:shadow-lg transition-all duration-200">
                <CardHeader className="p-0">
                  <Image
                    src={project.image || "/placeholder.svg"}
                    width={400}
                    height={200}
                    alt={project.title}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                </CardHeader>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      {project.category}
                    </Badge>
                    <div className="flex items-center text-sm text-gray-500">
                      <Users className="h-4 w-4 mr-1" />
                      {project.currentBeneficiaries}/{project.targetBeneficiaries}
                    </div>
                  </div>
                  <CardTitle className="text-xl mb-2 group-hover:text-green-600 transition-colors">
                    {project.title}
                  </CardTitle>
                  <CardDescription className="text-gray-600 mb-4 line-clamp-3">
                    {project.shortDescription}
                  </CardDescription>
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-500">
                      <MapPin className="h-4 w-4 mr-2" />
                      {project.location}
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="h-4 w-4 mr-2" />
                      {new Date(project.startDate).toLocaleDateString()} -{" "}
                      {new Date(project.endDate).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Link href={`/projects/${project._id}`} className="flex-1">
                      <Button
                        variant="outline"
                        className="w-full group-hover:bg-green-600 group-hover:text-white transition-colors"
                      >
                        Read More
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
