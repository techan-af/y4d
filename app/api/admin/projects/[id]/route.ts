import { type NextRequest, NextResponse } from "next/server"
import { ObjectId } from "mongodb"
import clientPromise from "@/lib/mongodb"

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const client = await clientPromise
    const db = client.db("ngo_system")
    const projects = db.collection("projects")

    const project = await projects.findOne({ _id: new ObjectId(id) })

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }

    return NextResponse.json(project)
  } catch (error) {
    console.error("Project fetch error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const projectData = await request.json()

    // Validate required fields
    const requiredFields = [
      "title",
      "description",
      "shortDescription",
      "location",
      "targetBeneficiaries",
      "startDate",
      "endDate",
      "category",
    ]
    for (const field of requiredFields) {
      if (!projectData[field]) {
        return NextResponse.json({ error: `Missing required field: ${field}` }, { status: 400 })
      }
    }

    const client = await clientPromise
    const db = client.db("ngo_system")
    const projects = db.collection("projects")

    const updateData = {
      ...projectData,
      requirements: projectData.requirements || [],
      image: projectData.image || "/placeholder.svg?height=400&width=600",
      updatedAt: new Date(),
    }

    // Remove fields that shouldn't be updated
    delete updateData._id
    delete updateData.createdAt
    delete updateData.currentBeneficiaries

    const result = await projects.updateOne({ _id: new ObjectId(id) }, { $set: updateData })

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Project updated successfully" })
  } catch (error) {
    console.error("Project update error:", error)
    return NextResponse.json({ error: "Failed to update project" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const client = await clientPromise
    const db = client.db("ngo_system")
    const projects = db.collection("projects")
    const registrations = db.collection("registrations")

    // Check if project has registrations
    const registrationCount = await registrations.countDocuments({ projectId: id })
    if (registrationCount > 0) {
      return NextResponse.json({ error: "Cannot delete project with existing registrations" }, { status: 400 })
    }

    const result = await projects.deleteOne({ _id: new ObjectId(id) })

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Project deleted successfully" })
  } catch (error) {
    console.error("Project deletion error:", error)
    return NextResponse.json({ error: "Failed to delete project" }, { status: 500 })
  }
}
