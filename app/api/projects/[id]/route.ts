import { type NextRequest, NextResponse } from "next/server"
import { ObjectId } from "mongodb"
import clientPromise from "@/lib/mongodb"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const client = await clientPromise
    const db = client.db("ngo_system")
    const projects = db.collection("projects")

    const project = await projects.findOne({ _id: new ObjectId(params.id) })

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }

    return NextResponse.json(project)
  } catch (error) {
    console.error("Project fetch error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
