import { type NextRequest, NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"

export async function POST(request: NextRequest) {
  try {
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

    const newProject = {
      ...projectData,
      currentBeneficiaries: 0,
      status: "active",
      createdAt: new Date(),
      requirements: projectData.requirements || [],
      image: projectData.image || "/placeholder.svg?height=400&width=600",
    }

    const result = await projects.insertOne(newProject)

    return NextResponse.json(
      {
        message: "Project created successfully",
        projectId: result.insertedId,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Project creation error:", error)
    return NextResponse.json({ error: "Failed to create project" }, { status: 500 })
  }
}

export async function GET() {
  try {
    const client = await clientPromise
    const db = client.db("ngo_system")
    const projects = db.collection("projects")

    const projectList = await projects.find({}).sort({ createdAt: -1 }).toArray()

    return NextResponse.json(projectList)
  } catch (error) {
    console.error("Projects fetch error:", error)
    return NextResponse.json({ error: "Failed to fetch projects" }, { status: 500 })
  }
}
