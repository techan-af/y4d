"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Heart,
  Plus,
  Edit,
  Trash2,
  MoreVertical,
  Users,
  MapPin,
  Calendar,
  Eye,
  PlayCircle,
  PauseCircle,
  XCircle,
  CheckCircle,
  LogOut,
  Shield,
  AlertCircle,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import type { Project } from "@/lib/types"
import AdminProtectedRoute from "@/components/admin-protected-route"
import { useAdminAuth } from "@/hooks/use-admin-auth"

interface DashboardStats {
  totalProjects: number
  activeProjects: number
  closedProjects: number
  completedProjects: number
  pausedProjects: number
  totalBeneficiaries: number
  totalRegistrations: number
}

function AdminDashboardContent() {
  const [projects, setProjects] = useState<Project[]>([])
  const [stats, setStats] = useState<DashboardStats>({
    totalProjects: 0,
    activeProjects: 0,
    closedProjects: 0,
    completedProjects: 0,
    pausedProjects: 0,
    totalBeneficiaries: 0,
    totalRegistrations: 0,
  })
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; project: Project | null }>({
    open: false,
    project: null,
  })
  const [isDeleting, setIsDeleting] = useState(false)
  const router = useRouter()
  const { admin, logout, isAuthenticated } = useAdminAuth()

  useEffect(() => {
    if (isAuthenticated) {
      fetchDashboardData()
    }
  }, [isAuthenticated])

  const fetchDashboardData = async () => {
    setIsLoading(true)
    setError(null)

    try {
      console.log("Fetching dashboard data...")

      // Fetch projects with credentials
      const projectsResponse = await fetch("/api/admin/projects", {
        method: "GET",
        credentials: "include", // Important: include cookies
        headers: {
          "Content-Type": "application/json",
        },
      })

      console.log("Projects response status:", projectsResponse.status)

      if (projectsResponse.ok) {
        const projectsData = await projectsResponse.json()
        console.log("Projects data:", projectsData)
        setProjects(projectsData)

        // Calculate stats from projects
        const calculatedStats = calculateStats(projectsData)

        // Fetch registration count with credentials
        const registrationsResponse = await fetch("/api/admin/registrations", {
          method: "GET",
          credentials: "include", // Important: include cookies
          headers: {
            "Content-Type": "application/json",
          },
        })

        console.log("Registrations response status:", registrationsResponse.status)

        if (registrationsResponse.ok) {
          const registrationsData = await registrationsResponse.json()
          console.log("Registrations data:", registrationsData)
          calculatedStats.totalRegistrations = registrationsData.length
        } else {
          console.error("Failed to fetch registrations:", registrationsResponse.status)
        }

        setStats(calculatedStats)
        console.log("Final stats:", calculatedStats)
      } else {
        const errorData = await projectsResponse.json()
        console.error("Failed to fetch projects:", projectsResponse.status, errorData)
        setError(`Failed to fetch projects: ${errorData.error || "Unknown error"}`)

        // If unauthorized, redirect to login
        if (projectsResponse.status === 401) {
          router.push("/admin/login")
        }
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error)
      setError("Network error occurred while fetching data")
    } finally {
      setIsLoading(false)
    }
  }

  const calculateStats = (projectsData: Project[]): DashboardStats => {
    const stats = {
      totalProjects: projectsData.length,
      activeProjects: 0,
      closedProjects: 0,
      completedProjects: 0,
      pausedProjects: 0,
      totalBeneficiaries: 0,
      totalRegistrations: 0, // Will be updated separately
    }

    projectsData.forEach((project) => {
      // Count by status
      switch (project.status) {
        case "active":
          stats.activeProjects++
          break
        case "closed":
          stats.closedProjects++
          break
        case "completed":
          stats.completedProjects++
          break
        case "paused":
          stats.pausedProjects++
          break
        default:
          // Default to active if no status
          stats.activeProjects++
          break
      }

      // Sum total beneficiaries
      stats.totalBeneficiaries += project.currentBeneficiaries || 0
    })

    return stats
  }

  const handleStatusChange = async (projectId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/admin/projects/${projectId}/status`, {
        method: "PATCH",
        credentials: "include", // Important: include cookies
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      })

      if (response.ok) {
        await fetchDashboardData() // Refresh all data
      } else {
        console.error("Failed to update status:", response.status)
        const errorData = await response.json()
        alert(`Failed to update status: ${errorData.error || "Unknown error"}`)
      }
    } catch (error) {
      console.error("Error updating status:", error)
      alert("Network error occurred while updating status")
    }
  }

  const handleDelete = async () => {
    if (!deleteDialog.project) return

    setIsDeleting(true)
    try {
      const response = await fetch(`/api/admin/projects/${deleteDialog.project._id}`, {
        method: "DELETE",
        credentials: "include", // Important: include cookies
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (response.ok) {
        await fetchDashboardData() // Refresh all data
        setDeleteDialog({ open: false, project: null })
      } else {
        const data = await response.json()
        alert(data.error || "Failed to delete project")
      }
    } catch (error) {
      console.error("Error deleting project:", error)
      alert("Failed to delete project")
    } finally {
      setIsDeleting(false)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800">Active</Badge>
      case "closed":
        return <Badge className="bg-red-100 text-red-800">Closed</Badge>
      case "completed":
        return <Badge className="bg-blue-100 text-blue-800">Completed</Badge>
      case "paused":
        return <Badge className="bg-yellow-100 text-yellow-800">Paused</Badge>
      default:
        return <Badge className="bg-green-100 text-green-800">Active</Badge>
    }
  }

  const getProgressPercentage = (current: number, target: number) => {
    return Math.round((current / target) * 100)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 mx-auto text-red-500 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Dashboard</h3>
          <p className="text-gray-500 mb-4">{error}</p>
          <div className="space-x-2">
            <Button onClick={fetchDashboardData}>Retry</Button>
            <Button variant="outline" onClick={() => router.push("/admin/login")}>
              Back to Login
            </Button>
          </div>
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
              <span className="ml-2 text-xl font-bold text-gray-900">Y4D NGO - Admin Dashboard</span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Shield className="h-4 w-4" />
                <span>Welcome, {admin?.username}</span>
              </div>
              <Link href="/admin/registrations">
                <Button variant="outline">
                  <Users className="h-4 w-4 mr-2" />
                  View All Registrations ({stats.totalRegistrations})
                </Button>
              </Link>
              <Link href="/admin">
                <Button className="bg-green-600 hover:bg-green-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Project
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button variant="outline">View Public Dashboard</Button>
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
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Project Management Dashboard</h1>
          <p className="text-gray-600">Overview of all projects, registrations, and system statistics.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Projects</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalProjects}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <PlayCircle className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Active Projects</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.activeProjects}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Users className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Beneficiaries</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalBeneficiaries}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <CheckCircle className="h-6 w-6 text-orange-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Registrations</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalRegistrations}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Additional Stats Row */}
        <div className="grid gap-6 md:grid-cols-3 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <CheckCircle className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Completed Projects</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.completedProjects}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <div className="p-2 bg-red-100 rounded-lg">
                  <XCircle className="h-6 w-6 text-red-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Closed Projects</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.closedProjects}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <PauseCircle className="h-6 w-6 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Paused Projects</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.pausedProjects}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Projects Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Projects ({projects.length})</CardTitle>
            <CardDescription>Manage your projects, update status, and track progress.</CardDescription>
          </CardHeader>
          <CardContent>
            {projects.length === 0 ? (
              <div className="text-center py-8">
                <Users className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Projects Found</h3>
                <p className="text-gray-500 mb-4">Get started by creating your first project.</p>
                <Link href="/admin">
                  <Button className="bg-green-600 hover:bg-green-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Project
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {projects.map((project) => (
                  <div key={project._id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between">
                      <div className="flex space-x-4 flex-1">
                        <Image
                          src={project.image || "/placeholder.svg"}
                          width={80}
                          height={60}
                          alt={project.title}
                          className="rounded-lg object-cover"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-2">
                            <h3 className="text-lg font-semibold text-gray-900 truncate">{project.title}</h3>
                            {getStatusBadge(project.status || "active")}
                          </div>
                          <p className="text-sm text-gray-600 mb-2 line-clamp-2">{project.shortDescription}</p>
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <div className="flex items-center">
                              <MapPin className="h-4 w-4 mr-1" />
                              {project.location}
                            </div>
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 mr-1" />
                              {new Date(project.startDate).toLocaleDateString()}
                            </div>
                            <div className="flex items-center">
                              <Users className="h-4 w-4 mr-1" />
                              {project.currentBeneficiaries}/{project.targetBeneficiaries} (
                              {getProgressPercentage(project.currentBeneficiaries, project.targetBeneficiaries)}%)
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Link href={`/projects/${project._id}`}>
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                        </Link>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => router.push(`/admin/edit/${project._id}`)}>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit Project
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => router.push(`/admin/projects/${project._id}/registrations`)}
                            >
                              <Users className="h-4 w-4 mr-2" />
                              View Registrations ({project.currentBeneficiaries})
                            </DropdownMenuItem>
                            {project.status === "active" && (
                              <>
                                <DropdownMenuItem onClick={() => handleStatusChange(project._id!, "closed")}>
                                  <XCircle className="h-4 w-4 mr-2" />
                                  Close Project
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleStatusChange(project._id!, "paused")}>
                                  <PauseCircle className="h-4 w-4 mr-2" />
                                  Pause Project
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleStatusChange(project._id!, "completed")}>
                                  <CheckCircle className="h-4 w-4 mr-2" />
                                  Mark Completed
                                </DropdownMenuItem>
                              </>
                            )}
                            {project.status === "closed" && (
                              <DropdownMenuItem onClick={() => handleStatusChange(project._id!, "active")}>
                                <PlayCircle className="h-4 w-4 mr-2" />
                                Reopen Project
                              </DropdownMenuItem>
                            )}
                            {project.status === "paused" && (
                              <DropdownMenuItem onClick={() => handleStatusChange(project._id!, "active")}>
                                <PlayCircle className="h-4 w-4 mr-2" />
                                Resume Project
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem
                              onClick={() => setDeleteDialog({ open: true, project })}
                              className="text-red-600"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete Project
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialog.open} onOpenChange={(open) => setDeleteDialog({ open, project: null })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Project</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{deleteDialog.project?.title}"? This action cannot be undone.
              {deleteDialog.project && deleteDialog.project.currentBeneficiaries > 0 && (
                <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded">
                  <p className="text-red-800 text-sm">
                    ⚠️ This project has {deleteDialog.project.currentBeneficiaries} registered beneficiaries. Deletion
                    will be prevented if registrations exist.
                  </p>
                </div>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialog({ open: false, project: null })}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
              {isDeleting ? "Deleting..." : "Delete Project"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default function AdminDashboard() {
  return (
    <AdminProtectedRoute>
      <AdminDashboardContent />
    </AdminProtectedRoute>
  )
}
