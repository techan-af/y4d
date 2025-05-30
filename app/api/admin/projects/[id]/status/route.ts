import { type NextRequest, NextResponse } from "next/server"
import { ObjectId } from "mongodb"
import clientPromise from "@/lib/mongodb"

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const { status } = await request.json()

    if (!["active", "closed", "completed", "paused"].includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 })
    }

    const client = await clientPromise
    const db = client.db("ngo_system")
    const projects = db.collection("projects")

    const result = await projects.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          status,
          updatedAt: new Date(),
        },
      },
    )

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Project status updated successfully" })
  } catch (error) {
    console.error("Status update error:", error)
    return NextResponse.json({ error: "Failed to update project status" }, { status: 500 })
  }
}
