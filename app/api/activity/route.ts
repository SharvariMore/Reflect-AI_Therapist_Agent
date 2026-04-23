import { NextRequest, NextResponse } from "next/server"
import { toast } from "sonner"

export async function POST(req: NextRequest) {
  const API_URL = process.env.BACKEND_API_URL || "http://localhost:3001"
  const token = req.headers.get("Authorization")

  if (!token) {
    return NextResponse.json({ message: "No Token Provided!" }, { status: 401 })
  }

  try {
    const body = await req.json()
    const { type, name, description, duration } = body

    if (!type || !name) {
      return NextResponse.json(
        { error: "Type and Name are Required!" },
        { status: 400 }
      )
    }

    const response = await fetch(`${API_URL}/api/activity/log`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify({ type, name, description, duration }),
    })

    if (!response.ok) {
      const error = await response.json()
      return NextResponse.json(
        { error: error.message || error.error || "Failed to Log Activity!" },
        { status: response.status }
      )
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error logging Activity:", error)
    toast.error("Error Logging Activity! Please Try Again.")
    return NextResponse.json(
      { error: "Internal Server Error!" },
      { status: 500 }
    )
  }
}
