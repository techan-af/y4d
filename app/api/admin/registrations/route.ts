import { type NextRequest, NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const projectId = searchParams.get("projectId")
    const status = searchParams.get("status")

    const client = await clientPromise
    const db = client.db("ngo_system")
    const registrations = db.collection("registrations")
    const projects = db.collection("projects")

    // Build query
    const query: any = {}
    if (projectId) query.projectId = projectId
    if (status) query.status = status

    // Get registrations with project details
    const registrationList = await registrations
      .aggregate([
        { $match: query },
        {
          $lookup: {
            from: "projects",
            let: { projectId: { $toObjectId: "$projectId" } },
            pipeline: [{ $match: { $expr: { $eq: ["$_id", "$$projectId"] } } }],
            as: "project",
          },
        },
        { $unwind: "$project" },
        { $sort: { createdAt: -1 } },
      ])
      .toArray()

    return NextResponse.json(registrationList)
  } catch (error) {
    console.error("Registrations fetch error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
