import { NextRequest, NextResponse } from "next/server"
import { toast } from "sonner"

export async function POST(req: NextRequest) {
  const BACKEND_API_URL = process.env.BACKEND_BACKEND_API_URL || "http://localhost:3001"
  const token = req.headers.get("Authorization")

  if (!token) {
    return NextResponse.json({ message: "No Token Provided!" }, { status: 401 })
  }

  try {
    const body = await req.json()
    const { score, note } = body

    if (typeof score !== "number" || score < 0 || score > 100) {
      return NextResponse.json(
        { error: "Invalid Mood Score!" },
        { status: 400 }
      )
    }

    const response = await fetch(`${BACKEND_API_URL}/api/mood`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify({ score, note }),
    })

    if (!response.ok) {
      const error = await response.json()
      return NextResponse.json(
        { error: error.message || "Failed to Track Mood!" },
        { status: response.status }
      )
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error Tracking Mood:", error)
    toast.error("Failed to Track Mood! Please Try Again.")
    return NextResponse.json(
      { error: "Internal Server Error!" },
      { status: 500 }
    )
  }
}
