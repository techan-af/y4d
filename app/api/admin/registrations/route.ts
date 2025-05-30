import { type NextRequest, NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"

export async function GET(request: NextRequest) {
  try {
    const client = await clientPromise
    const db = client.db("ngo_system")
    const registrations = db.collection("registrations")

    const { searchParams } = new URL(request.url)
    const projectId = searchParams.get("projectId")

    console.log("Registrations API called with projectId:", projectId)

    // Build query - use STRING comparison since projectId is stored as string
    const query: any = {}

    if (projectId) {
      // Use string projectId directly since that's how it's stored in the database
      query.projectId = projectId
      console.log("Filtering by projectId (string):", query.projectId)
    }

    console.log("Final query:", query)

    // Get registrations with project details
    const registrationList = await registrations
      .aggregate([
        { $match: query },
        {
          $lookup: {
            from: "projects",
            let: { projectIdStr: "$projectId" },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $eq: [{ $toString: "$_id" }, "$$projectIdStr"],
                  },
                },
              },
            ],
            as: "project",
          },
        },
        {
          $unwind: {
            path: "$project",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $project: {
            _id: 1,
            projectId: 1,
            name: 1,
            email: 1,
            phone: 1,
            aadhaarCard: 1,
            age: 1,
            gender: 1,
            address: 1,
            occupation: 1,
            familySize: 1,
            monthlyIncome: 1,
            status: 1,
            createdAt: 1,
            "project._id": 1,
            "project.title": 1,
            "project.category": 1,
            "project.location": 1,
          },
        },
        { $sort: { createdAt: -1 } },
      ])
      .toArray()

    console.log("Found registrations after aggregation:", registrationList.length)

    // Convert ObjectIds to strings for JSON serialization
    const serializedRegistrations = registrationList.map((reg) => ({
      ...reg,
      _id: reg._id.toString(),
      projectId: reg.projectId, // Keep as string since it's already a string
      project: reg.project
        ? {
            ...reg.project,
            _id: reg.project._id.toString(),
          }
        : null,
    }))

    return NextResponse.json(serializedRegistrations)
  } catch (error) {
    console.error("Error fetching registrations:", error)
    return NextResponse.json({ error: "Failed to fetch registrations" }, { status: 500 })
  }
}
