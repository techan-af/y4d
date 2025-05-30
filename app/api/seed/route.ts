import { NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"

export async function POST() {
  try {
    const client = await clientPromise
    const db = client.db("ngo_system")

    // Clear existing data
    await db.collection("projects").deleteMany({})
    await db.collection("registrations").deleteMany({})

    // Sample projects
    const projects = [
      {
        title: "Digital Literacy Program",
        shortDescription: "Teaching basic computer skills to rural communities",
        description:
          "A comprehensive program designed to bridge the digital divide by providing basic computer and internet literacy training to people in rural areas. Participants will learn essential digital skills including email, online banking, and accessing government services online.",
        location: "Rural Maharashtra",
        targetBeneficiaries: 100,
        currentBeneficiaries: 0,
        startDate: new Date("2024-01-15"),
        endDate: new Date("2024-06-15"),
        category: "Education",
        requirements: [
          "Must be 18 years or older",
          "Basic reading and writing skills required",
          "Commitment to attend all sessions",
        ],
        image: "/placeholder.svg?height=400&width=600",
        status: "active",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: "Women's Skill Development",
        shortDescription: "Empowering women through vocational training",
        description:
          "This program focuses on providing vocational training to women in tailoring, handicrafts, and small business management. The goal is to enable economic independence and improve the quality of life for women and their families.",
        location: "Urban Pune",
        targetBeneficiaries: 50,
        currentBeneficiaries: 0,
        startDate: new Date("2024-02-01"),
        endDate: new Date("2024-08-01"),
        category: "Women Empowerment",
        requirements: ["Women aged 18-45", "Basic education preferred", "Willingness to start small business"],
        image: "/placeholder.svg?height=400&width=600",
        status: "active",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: "Child Nutrition Program",
        shortDescription: "Improving child health through nutrition education",
        description:
          "A comprehensive nutrition program aimed at reducing malnutrition among children under 5 years. The program includes nutrition education for mothers, regular health check-ups, and supplementary feeding.",
        location: "Rural Gujarat",
        targetBeneficiaries: 200,
        currentBeneficiaries: 0,
        startDate: new Date("2024-01-01"),
        endDate: new Date("2024-12-31"),
        category: "Healthcare",
        requirements: [
          "Children aged 0-5 years",
          "Family income below poverty line",
          "Regular attendance at health camps",
        ],
        image: "/placeholder.svg?height=400&width=600",
        status: "active",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: "Clean Water Initiative",
        shortDescription: "Providing clean drinking water to remote villages",
        description:
          "This initiative focuses on installing water purification systems and educating communities about water hygiene. The program aims to reduce waterborne diseases and improve overall community health.",
        location: "Remote Rajasthan",
        targetBeneficiaries: 500,
        currentBeneficiaries: 0,
        startDate: new Date("2023-06-01"),
        endDate: new Date("2024-05-31"),
        category: "Environment",
        requirements: [
          "Village population under 1000",
          "No access to clean water source",
          "Community participation required",
        ],
        image: "/placeholder.svg?height=400&width=600",
        status: "completed",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]

    const projectResults = await db.collection("projects").insertMany(projects)
    const projectIds = Object.values(projectResults.insertedIds)

    // Sample registrations
    const registrations = [
      {
        projectId: projectIds[0],
        name: "Rajesh Kumar",
        email: "rajesh.kumar@email.com",
        phone: "+91-9876543210",
        aadhaarCard: "1234-5678-9012",
        age: 35,
        gender: "male",
        address: "Village Shirpur, Tal. Shirpur, Dist. Dhule, Maharashtra - 425405",
        occupation: "Farmer",
        familySize: 4,
        monthlyIncome: 15000,
        status: "approved",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        projectId: projectIds[1],
        name: "Priya Sharma",
        email: "priya.sharma@email.com",
        phone: "+91-9876543211",
        aadhaarCard: "2345-6789-0123",
        age: 28,
        gender: "female",
        address: "Flat 201, Shivaji Nagar, Pune, Maharashtra - 411005",
        occupation: "Housewife",
        familySize: 3,
        monthlyIncome: 8000,
        status: "approved",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        projectId: projectIds[2],
        name: "Meera Patel",
        email: "meera.patel@email.com",
        phone: "+91-9876543212",
        aadhaarCard: "3456-7890-1234",
        age: 25,
        gender: "female",
        address: "Village Anand, Dist. Anand, Gujarat - 388001",
        occupation: "Daily Wage Worker",
        familySize: 5,
        monthlyIncome: 6000,
        status: "approved",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        projectId: projectIds[0],
        name: "Suresh Yadav",
        email: "suresh.yadav@email.com",
        phone: "+91-9876543213",
        aadhaarCard: "4567-8901-2345",
        age: 42,
        gender: "male",
        address: "Village Nandurbar, Dist. Nandurbar, Maharashtra - 425412",
        occupation: "Small Business Owner",
        familySize: 6,
        monthlyIncome: 12000,
        status: "pending",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        projectId: projectIds[1],
        name: "Kavita Singh",
        email: "kavita.singh@email.com",
        phone: "+91-9876543214",
        aadhaarCard: "5678-9012-3456",
        age: 32,
        gender: "female",
        address: "Baner Road, Pune, Maharashtra - 411045",
        occupation: "Part-time Worker",
        familySize: 2,
        monthlyIncome: 10000,
        status: "rejected",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]

    await db.collection("registrations").insertMany(registrations)

    // Update project beneficiary counts based on approved registrations
    await db.collection("projects").updateOne(
      { _id: projectIds[0] },
      { $set: { currentBeneficiaries: 1 } }, // 1 approved registration
    )

    await db.collection("projects").updateOne(
      { _id: projectIds[1] },
      { $set: { currentBeneficiaries: 1 } }, // 1 approved registration
    )

    await db.collection("projects").updateOne(
      { _id: projectIds[2] },
      { $set: { currentBeneficiaries: 1 } }, // 1 approved registration
    )

    return NextResponse.json({
      message: "Database seeded successfully",
      projects: projects.length,
      registrations: registrations.length,
    })
  } catch (error) {
    console.error("Error seeding database:", error)
    return NextResponse.json({ error: "Failed to seed database" }, { status: 500 })
  }
}
