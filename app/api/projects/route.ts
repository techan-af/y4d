import { type NextRequest, NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"

export async function GET() {
  try {
    const client = await clientPromise
    const db = client.db("ngo_system")
    const projects = db.collection("projects")

    // Get all projects
    const projectList = await projects.find({}).toArray()

    return NextResponse.json(projectList)
  } catch (error) {
    console.error("Projects fetch error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const projectData = await request.json()

    const client = await clientPromise
    const db = client.db("ngo_system")
    const projects = db.collection("projects")

    const result = await projects.insertOne({
      ...projectData,
      currentBeneficiaries: 0,
      createdAt: new Date(),
    })

    return NextResponse.json({ message: "Project created successfully", projectId: result.insertedId }, { status: 201 })
  } catch (error) {
    console.error("Project creation error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
