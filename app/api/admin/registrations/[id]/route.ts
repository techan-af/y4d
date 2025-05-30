import { type NextRequest, NextResponse } from "next/server"
import { ObjectId } from "mongodb"
import clientPromise from "@/lib/mongodb"
import { sendEmail, generateApprovalEmail, generateRejectionEmail } from "@/lib/email-service"

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const client = await clientPromise
    const db = client.db("ngo_system")
    const registrations = db.collection("registrations")

    const registration = await registrations
      .aggregate([
        { $match: { _id: new ObjectId(id) } },
        {
          $lookup: {
            from: "projects",
            let: { projectIdStr: "$projectId" },
            pipeline: [{ $match: { $expr: { $eq: [{ $toString: "$_id" }, "$$projectIdStr"] } } }],
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

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const { status } = await request.json()

    if (!["pending", "approved", "rejected"].includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 })
    }

    const client = await clientPromise
    const db = client.db("ngo_system")
    const registrations = db.collection("registrations")

    // First, get the current registration with project details for email
    const currentRegistration = await registrations
      .aggregate([
        { $match: { _id: new ObjectId(id) } },
        {
          $lookup: {
            from: "projects",
            let: { projectIdStr: "$projectId" },
            pipeline: [{ $match: { $expr: { $eq: [{ $toString: "$_id" }, "$$projectIdStr"] } } }],
            as: "project",
          },
        },
        { $unwind: "$project" },
      ])
      .toArray()

    if (currentRegistration.length === 0) {
      return NextResponse.json({ error: "Registration not found" }, { status: 404 })
    }

    const registration = currentRegistration[0]
    const previousStatus = registration.status

    // Update the registration status
    const result = await registrations.updateOne(
      { _id: new ObjectId(id) },
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

    // Send email notification if status changed to approved or rejected
    if (previousStatus !== status && (status === "approved" || status === "rejected")) {
      try {
        let emailContent

        if (status === "approved") {
          emailContent = generateApprovalEmail(registration.name, registration.project.title)
        } else {
          emailContent = generateRejectionEmail(registration.name, registration.project.title)
        }

        const emailResult = await sendEmail({
          to: registration.email,
          subject: emailContent.subject,
          html: emailContent.html,
        })

        console.log(`📧 Email notification sent to ${registration.email}:`, emailResult)
      } catch (emailError) {
        console.error("Failed to send email notification:", emailError)
        // Don't fail the status update if email fails
      }
    }

    return NextResponse.json({
      message: "Registration status updated successfully",
      emailSent: previousStatus !== status && (status === "approved" || status === "rejected"),
    })
  } catch (error) {
    console.error("Status update error:", error)
    return NextResponse.json({ error: "Failed to update registration status" }, { status: 500 })
  }
}
