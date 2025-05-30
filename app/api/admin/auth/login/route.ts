import { type NextRequest, NextResponse } from "next/server"

// Hardcoded admin credentials
const ADMIN_CREDENTIALS = {
  username: "admin",
  password: "admin@123456",
}

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json()

    if (!username || !password) {
      return NextResponse.json({ error: "Missing username or password" }, { status: 400 })
    }

    // Check admin credentials
    if (username !== ADMIN_CREDENTIALS.username || password !== ADMIN_CREDENTIALS.password) {
      return NextResponse.json({ error: "Invalid admin credentials" }, { status: 401 })
    }

    const response = NextResponse.json(
      {
        message: "Admin login successful",
        admin: { username: ADMIN_CREDENTIALS.username, role: "admin" },
      },
      { status: 200 },
    )

    // Set simple session cookie
    response.cookies.set("admin_session", "authenticated", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 8 * 60 * 60 * 1000, // 8 hours
    })

    return response
  } catch (error) {
    console.error("Admin login error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
