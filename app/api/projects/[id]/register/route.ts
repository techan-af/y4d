import { type NextRequest, NextResponse } from "next/server"
import { ObjectId } from "mongodb"
import clientPromise from "@/lib/mongodb"

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const registrationData = await request.json()

    const client = await clientPromise
    const db = client.db("ngo_system")
    const registrations = db.collection("registrations")
    const projects = db.collection("projects")

    // Check if user already registered for this project
    const existingRegistration = await registrations.findOne({
      projectId: params.id,
      email: registrationData.email,
    })

    if (existingRegistration) {
      return NextResponse.json({ error: "Already registered for this project" }, { status: 400 })
    }

    // Check if project exists and has space
    const project = await projects.findOne({ _id: new ObjectId(params.id) })
    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }

    if (project.currentBeneficiaries >= project.targetBeneficiaries) {
      return NextResponse.json({ error: "Project is full" }, { status: 400 })
    }

    // Create registration
    const result = await registrations.insertOne({
      ...registrationData,
      projectId: params.id,
      status: "pending",
      createdAt: new Date(),
    })

    // Update project beneficiary count
    await projects.updateOne({ _id: new ObjectId(params.id) }, { $inc: { currentBeneficiaries: 1 } })

    return NextResponse.json(
      {
        message: "Registration successful",
        registrationId: result.insertedId,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
