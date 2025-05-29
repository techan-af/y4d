"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  Heart,
  Users,
  Search,
  Filter,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  Phone,
  Mail,
  MapPin,
  User,
  Calendar,
  ArrowLeft,
} from "lucide-react"
import Link from "next/link"
import type { Registration } from "@/lib/types"

interface RegistrationWithProject extends Registration {
  project: {
    title: string
    category: string
    location: string
  }
}

export default function RegistrationsPage() {
  const [registrations, setRegistrations] = useState<RegistrationWithProject[]>([])
  const [filteredRegistrations, setFilteredRegistrations] = useState<RegistrationWithProject[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedRegistration, setSelectedRegistration] = useState<RegistrationWithProject | null>(null)
  const [isUpdating, setIsUpdating] = useState(false)

  useEffect(() => {
    fetchRegistrations()
  }, [])

  useEffect(() => {
    filterRegistrations()
  }, [registrations, searchTerm, statusFilter])

  const fetchRegistrations = async () => {
    try {
      const response = await fetch("/api/admin/registrations")
      if (response.ok) {
        const data = await response.json()
        setRegistrations(data)
      }
    } catch (error) {
      console.error("Error fetching registrations:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const filterRegistrations = () => {
    let filtered = registrations

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (reg) =>
          reg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          reg.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          reg.phone.includes(searchTerm) ||
          reg.project.title.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Filter by status
    if (statusFilter !== "all") {
      filtered = filtered.filter((reg) => reg.status === statusFilter)
    }

    setFilteredRegistrations(filtered)
  }

  const handleStatusUpdate = async (registrationId: string, newStatus: string) => {
    setIsUpdating(true)
    try {
      const response = await fetch(`/api/admin/registrations/${registrationId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      })

      if (response.ok) {
        await fetchRegistrations() // Refresh the list
        if (selectedRegistration && selectedRegistration._id === registrationId) {
          setSelectedRegistration({ ...selectedRegistration, status: newStatus as any })
        }
      }
    } catch (error) {
      console.error("Error updating status:", error)
    } finally {
      setIsUpdating(false)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-green-100 text-green-800">Approved</Badge>
      case "rejected":
        return <Badge className="bg-red-100 text-red-800">Rejected</Badge>
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
      default:
        return <Badge variant="secondary">Unknown</Badge>
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "rejected":
        return <XCircle className="h-4 w-4 text-red-600" />
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-600" />
      default:
        return <Clock className="h-4 w-4 text-gray-600" />
    }
  }

  const getStatusCounts = () => {
    return {
      total: registrations.length,
      pending: registrations.filter((r) => r.status === "pending").length,
      approved: registrations.filter((r) => r.status === "approved").length,
      rejected: registrations.filter((r) => r.status === "rejected").length,
    }
  }

  const statusCounts = getStatusCounts()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading registrations...</p>
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
              <span className="ml-2 text-xl font-bold text-gray-900">Y4D NGO - Beneficiary Management</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/admin/dashboard">
                <Button variant="outline">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Beneficiary Registrations</h1>
          <p className="text-gray-600">Manage and review all beneficiary applications across all projects.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-6 md:grid-cols-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Applications</p>
                  <p className="text-2xl font-bold text-gray-900">{statusCounts.total}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Clock className="h-6 w-6 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Pending Review</p>
                  <p className="text-2xl font-bold text-gray-900">{statusCounts.pending}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Approved</p>
                  <p className="text-2xl font-bold text-gray-900">{statusCounts.approved}</p>
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
                  <p className="text-sm font-medium text-gray-600">Rejected</p>
                  <p className="text-2xl font-bold text-gray-900">{statusCounts.rejected}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search by name, email, phone, or project..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="sm:w-48">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Registrations Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Registrations ({filteredRegistrations.length})</CardTitle>
            <CardDescription>Review and manage beneficiary applications.</CardDescription>
          </CardHeader>
          <CardContent>
            {filteredRegistrations.length === 0 ? (
              <div className="text-center py-8">
                <Users className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Registrations Found</h3>
                <p className="text-gray-500">
                  {registrations.length === 0
                    ? "No beneficiaries have registered yet."
                    : "No registrations match your current filters."}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredRegistrations.map((registration) => (
                  <div key={registration._id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">{registration.name}</h3>
                          {getStatusBadge(registration.status)}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-600">
                          <div className="flex items-center">
                            <Mail className="h-4 w-4 mr-2" />
                            {registration.email}
                          </div>
                          <div className="flex items-center">
                            <Phone className="h-4 w-4 mr-2" />
                            {registration.phone}
                          </div>
                          <div className="flex items-center">
                            <User className="h-4 w-4 mr-2" />
                            Age: {registration.age}, {registration.gender}
                          </div>
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-2" />
                            {new Date(registration.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                        <div className="mt-2">
                          <span className="text-sm font-medium text-gray-700">Project: </span>
                          <span className="text-sm text-gray-600">{registration.project.title}</span>
                          <span className="text-sm text-gray-500 ml-2">({registration.project.category})</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 ml-4">
                        <Button variant="outline" size="sm" onClick={() => setSelectedRegistration(registration)}>
                          <Eye className="h-4 w-4 mr-1" />
                          View Details
                        </Button>
                        {registration.status === "pending" && (
                          <>
                            <Button
                              size="sm"
                              className="bg-green-600 hover:bg-green-700"
                              onClick={() => handleStatusUpdate(registration._id!, "approved")}
                              disabled={isUpdating}
                            >
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleStatusUpdate(registration._id!, "rejected")}
                              disabled={isUpdating}
                            >
                              <XCircle className="h-4 w-4 mr-1" />
                              Reject
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      {/* Registration Details Dialog */}
      <Dialog open={!!selectedRegistration} onOpenChange={() => setSelectedRegistration(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>Beneficiary Details</span>
              {selectedRegistration && getStatusBadge(selectedRegistration.status)}
            </DialogTitle>
            <DialogDescription>Complete information about the beneficiary application.</DialogDescription>
          </DialogHeader>

          {selectedRegistration && (
            <div className="space-y-6">
              {/* Personal Information */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Personal Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Full Name</label>
                    <p className="text-gray-900">{selectedRegistration.name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Email</label>
                    <p className="text-gray-900">{selectedRegistration.email}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Phone</label>
                    <p className="text-gray-900">{selectedRegistration.phone}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Aadhaar Card</label>
                    <p className="text-gray-900">{selectedRegistration.aadhaarCard}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Age</label>
                    <p className="text-gray-900">{selectedRegistration.age} years</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Gender</label>
                    <p className="text-gray-900 capitalize">{selectedRegistration.gender}</p>
                  </div>
                </div>
                <div className="mt-4">
                  <label className="text-sm font-medium text-gray-600">Address</label>
                  <p className="text-gray-900">{selectedRegistration.address}</p>
                </div>
              </div>

              {/* Economic Information */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Economic Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Occupation</label>
                    <p className="text-gray-900">{selectedRegistration.occupation || "Not specified"}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Family Size</label>
                    <p className="text-gray-900">{selectedRegistration.familySize || "Not specified"}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Monthly Income</label>
                    <p className="text-gray-900">
                      {selectedRegistration.monthlyIncome ? `₹${selectedRegistration.monthlyIncome}` : "Not specified"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Project Information */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Project Information</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">{selectedRegistration.project.title}</h4>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded">
                      {selectedRegistration.project.category}
                    </span>
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-1" />
                      {selectedRegistration.project.location}
                    </div>
                  </div>
                </div>
              </div>

              {/* Application Status */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Application Status</h3>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(selectedRegistration.status)}
                    <span className="capitalize font-medium">{selectedRegistration.status}</span>
                  </div>
                  <div className="text-sm text-gray-600">
                    Applied on: {new Date(selectedRegistration.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              {selectedRegistration.status === "pending" && (
                <div className="flex space-x-3 pt-4 border-t">
                  <Button
                    className="flex-1 bg-green-600 hover:bg-green-700"
                    onClick={() => handleStatusUpdate(selectedRegistration._id!, "approved")}
                    disabled={isUpdating}
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Approve Application
                  </Button>
                  <Button
                    variant="destructive"
                    className="flex-1"
                    onClick={() => handleStatusUpdate(selectedRegistration._id!, "rejected")}
                    disabled={isUpdating}
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Reject Application
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
