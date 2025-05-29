import { NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"

export async function POST() {
  try {
    const client = await clientPromise
    const db = client.db("ngo_system")
    const projects = db.collection("projects")

    // Check if projects already exist
    const existingProjects = await projects.countDocuments()
    if (existingProjects > 0) {
      return NextResponse.json({ message: "Projects already exist in database" }, { status: 200 })
    }

    // Initial project data
    const initialProjects = [
      {
        title: "Digital Literacy Program",
        description:
          "Our Digital Literacy Program is designed to bridge the digital divide in rural communities. This comprehensive initiative provides hands-on training in basic computer skills, internet navigation, digital financial services, and online safety. Participants learn essential digital skills that enable them to access government services online, communicate with family members, and explore new economic opportunities. The program includes practical sessions on using smartphones, tablets, and computers, understanding digital payments, and accessing educational resources online. We also focus on digital safety, teaching participants how to protect themselves from online fraud and misinformation. The curriculum is designed to be accessible to people with varying levels of education and is delivered in local languages. Our trained instructors use a patient, step-by-step approach to ensure every participant gains confidence in using digital tools. Upon completion, participants receive certificates and ongoing support to continue their digital journey.",
        shortDescription: "Empowering rural communities with digital skills and computer literacy.",
        image: "/placeholder.svg?height=400&width=600",
        location: "Rural Maharashtra",
        targetBeneficiaries: 500,
        currentBeneficiaries: 150,
        startDate: "2024-01-15",
        endDate: "2024-12-31",
        category: "Education",
        requirements: [
          "Basic literacy skills",
          "Age between 18-60 years",
          "Commitment to complete the full course",
          "Regular attendance required",
          "Willingness to learn new technology",
        ],
        status: "active",
        createdAt: new Date(),
      },
      {
        title: "Mobile Health Clinics",
        description:
          "Our Mobile Health Clinics bring essential healthcare services directly to remote and underserved communities. These fully equipped medical units travel to villages and settlements that lack access to proper healthcare facilities. Each clinic is staffed with qualified doctors, nurses, and health workers who provide comprehensive medical services including general health checkups, vaccinations, maternal and child health services, and treatment for common ailments. We also conduct health awareness programs focusing on preventive care, nutrition, hygiene, and disease prevention. The clinics carry essential medicines, diagnostic equipment, and emergency medical supplies. Special attention is given to women's health, child immunization, and elderly care. We maintain detailed health records for each community and provide follow-up care as needed. The program also includes health education sessions where community members learn about maintaining good health, recognizing symptoms of common diseases, and when to seek medical help.",
        shortDescription: "Bringing essential healthcare services to remote and underserved areas.",
        image: "/placeholder.svg?height=400&width=600",
        location: "Remote Rajasthan",
        targetBeneficiaries: 1000,
        currentBeneficiaries: 300,
        startDate: "2024-02-01",
        endDate: "2024-11-30",
        category: "Healthcare",
        requirements: [
          "Valid government ID proof",
          "Medical history documents if available",
          "Consent for medical examination",
          "Vaccination records if available",
        ],
        status: "active",
        createdAt: new Date(),
      },
      {
        title: "Women's Skill Development",
        description:
          "Our Women's Skill Development Program empowers women with practical vocational skills that enable economic independence and entrepreneurship. The program offers training in various trades including tailoring and garment making, handicrafts and traditional arts, food processing and preservation, beauty and wellness services, and basic computer skills. Each participant receives hands-on training from experienced instructors and access to modern equipment and tools. The curriculum includes not just technical skills but also business development, financial literacy, and marketing strategies. We help participants understand how to start and manage small businesses, access credit facilities, and connect with markets for their products. The program also includes soft skills training such as communication, leadership, and teamwork. Upon completion, participants receive tool kits to start their own ventures and ongoing mentorship support. We facilitate connections with local markets, self-help groups, and microfinance institutions to ensure sustainable livelihoods.",
        shortDescription: "Training women in vocational skills for economic independence.",
        image: "/placeholder.svg?height=400&width=600",
        location: "Urban Slums, Delhi",
        targetBeneficiaries: 300,
        currentBeneficiaries: 80,
        startDate: "2024-03-01",
        endDate: "2024-10-31",
        category: "Skill Development",
        requirements: [
          "Women aged 18-45 years",
          "Basic education preferred but not mandatory",
          "Commitment to regular attendance",
          "Willingness to start own business",
          "Participation in group activities",
        ],
        status: "active",
        createdAt: new Date(),
      },
      {
        title: "Rural Water Conservation",
        description:
          "Our Rural Water Conservation project focuses on sustainable water management in drought-prone areas. We work with local communities to implement rainwater harvesting systems, construct check dams, and restore traditional water bodies. The program includes training on water conservation techniques, maintenance of water infrastructure, and community-based water management. We also conduct awareness programs on water usage efficiency and hygiene practices. The project aims to ensure year-round water availability for drinking, irrigation, and livestock needs.",
        shortDescription: "Implementing sustainable water management solutions in rural areas.",
        image: "/placeholder.svg?height=400&width=600",
        location: "Drought-prone regions, Karnataka",
        targetBeneficiaries: 800,
        currentBeneficiaries: 200,
        startDate: "2024-04-01",
        endDate: "2025-03-31",
        category: "Environment",
        requirements: [
          "Community participation mandatory",
          "Land ownership or community consent",
          "Commitment to maintenance",
          "Basic understanding of water conservation",
        ],
        status: "active",
        createdAt: new Date(),
      },
      {
        title: "Child Education Support",
        description:
          "Our Child Education Support program provides comprehensive educational assistance to underprivileged children. This includes providing school supplies, uniforms, nutritious meals, and after-school tutoring. We work closely with local schools to improve infrastructure and teaching quality. The program also includes digital learning tools, library facilities, and extracurricular activities. We focus on reducing dropout rates and improving learning outcomes through personalized attention and family engagement.",
        shortDescription: "Supporting quality education for underprivileged children.",
        image: "/placeholder.svg?height=400&width=600",
        location: "Rural Schools, Uttar Pradesh",
        targetBeneficiaries: 600,
        currentBeneficiaries: 180,
        startDate: "2024-06-01",
        endDate: "2025-05-31",
        category: "Education",
        requirements: [
          "Children aged 6-16 years",
          "Enrolled in local schools",
          "Family income below poverty line",
          "Regular school attendance",
          "Parent/guardian consent",
        ],
        status: "active",
        createdAt: new Date(),
      },
    ]

    // Insert projects into database
    const result = await projects.insertMany(initialProjects)

    return NextResponse.json(
      {
        message: "Database seeded successfully",
        projectsCreated: result.insertedCount,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Seed error:", error)
    return NextResponse.json({ error: "Failed to seed database" }, { status: 500 })
  }
}
