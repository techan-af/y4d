import { type NextRequest, NextResponse } from "next/server"
import { ObjectId } from "mongodb"
import clientPromise from "@/lib/mongodb"

export async function GET(request: NextRequest, context: any) {
  const { params } = context;
  try {
    const client = await clientPromise
    const db = client.db("ngo_system")
    const registrations = db.collection("registrations")

    const registration = await registrations
      .aggregate([
        { $match: { _id: new ObjectId(params.id) } },
        {
          $lookup: {
            from: "projects",
            let: { projectId: { $toObjectId: "$projectId" } },
            pipeline: [{ $match: { $expr: { $eq: ["$_id", "$$projectId"] } } }],
            as: "project",
          },
        },
        { $unwind: "$project" },
      ])
      .toArray()

    if (registration.length === 0) {
      return NextResponse.json({ error: "Registration not found" }, { status: 404 })
    }

    return NextResponse.json(registration[0])
  } catch (error) {
    console.error("Registration fetch error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest, context: any) {
  const { params } = context;
  try {
    const { status } = await request.json()

    if (!["pending", "approved", "rejected"].includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 })
    }

    const client = await clientPromise
    const db = client.db("ngo_system")
    const registrations = db.collection("registrations")

    const result = await registrations.updateOne(
      { _id: new ObjectId(params.id) },
      {
        $set: {
          status,
          updatedAt: new Date(),
        },
      },
    )

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Registration not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Registration status updated successfully" })
  } catch (error) {
    console.error("Status update error:", error)
    return NextResponse.json({ error: "Failed to update registration status" }, { status: 500 })
  }
}
