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
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import type { Project } from "@/lib/types"

export default function AdminDashboard() {
  const [projects, setProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; project: Project | null }>({
    open: false,
    project: null,
  })
  const [isDeleting, setIsDeleting] = useState(false)
  const router = useRouter()

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    try {
      const response = await fetch("/api/admin/projects")
      if (response.ok) {
        const data = await response.json()
        setProjects(data)
      }
    } catch (error) {
      console.error("Error fetching projects:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleStatusChange = async (projectId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/admin/projects/${projectId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      })

      if (response.ok) {
        await fetchProjects() // Refresh the list
      }
    } catch (error) {
      console.error("Error updating status:", error)
    }
  }

  const handleDelete = async () => {
    if (!deleteDialog.project) return

    setIsDeleting(true)
    try {
      const response = await fetch(`/api/admin/projects/${deleteDialog.project._id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        await fetchProjects() // Refresh the list
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
        return <Badge variant="secondary">Unknown</Badge>
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
              <span className="ml-2 text-xl font-bold text-gray-900">Y4D NGO - Admin Dashboard</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/admin/registrations">
                <Button variant="outline">
                  <Users className="h-4 w-4 mr-2" />
                  View All Registrations
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
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Project Management</h1>
          <p className="text-gray-600">Manage all projects, update status, and track registrations.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-6 md:grid-cols-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <PlayCircle className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Active Projects</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {projects.filter((p) => p.status === "active").length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <CheckCircle className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Completed</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {projects.filter((p) => p.status === "completed").length}
                  </p>
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
                  <p className="text-sm font-medium text-gray-600">Closed</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {projects.filter((p) => p.status === "closed").length}
                  </p>
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
                  <p className="text-2xl font-bold text-gray-900">
                    {projects.reduce((sum, p) => sum + p.currentBeneficiaries, 0)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Projects Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Projects</CardTitle>
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
