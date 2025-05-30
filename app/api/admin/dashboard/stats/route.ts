import { NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"

export async function GET() {
  try {
    const client = await clientPromise
    const db = client.db("ngo_system")

    // Get total projects
    const totalProjects = await db.collection("projects").countDocuments()

    // Get active projects
    const activeProjects = await db.collection("projects").countDocuments({ status: "active" })

    // Get closed projects
    const closedProjects = await db.collection("projects").countDocuments({ status: "closed" })

    // Get total registrations
    const totalRegistrations = await db.collection("registrations").countDocuments()

    // Get total beneficiaries (approved registrations)
    const totalBeneficiaries = await db.collection("registrations").countDocuments({ status: "approved" })

    // Get all beneficiaries (all registrations regardless of status)
    const allBeneficiaries = await db.collection("registrations").find({}).toArray()

    return NextResponse.json({
      totalProjects,
      activeProjects,
      closedProjects,
      totalRegistrations,
      totalBeneficiaries,
      allBeneficiaries,
    })
  } catch (error) {
    console.error("Dashboard stats error:", error)
    return NextResponse.json({ error: "Failed to fetch dashboard stats" }, { status: 500 })
  }
}
