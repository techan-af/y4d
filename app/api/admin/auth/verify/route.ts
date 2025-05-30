import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const session = request.cookies.get("admin_session")?.value

    if (session === "authenticated") {
      return NextResponse.json({
        admin: {
          username: "admin",
          role: "admin",
        },
      })
    } else {
      return NextResponse.json({ error: "No admin session found" }, { status: 401 })
    }
  } catch (error) {
    console.error("Admin verification error:", error)
    return NextResponse.json({ error: "Invalid admin session" }, { status: 401 })
  }
}
