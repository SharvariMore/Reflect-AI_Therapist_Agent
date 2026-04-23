import { NextRequest, NextResponse } from "next/server"
import { toast } from "sonner"

const BACKEND_API_URL = process.env.BACKEND_API_URL || "http://localhost:3001"

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get("Authorization")

    if (!authHeader) {
      return NextResponse.json(
        { error: "Authorization Header is Required!" },
        { status: 401 }
      )
    }

    const response = await fetch(`${BACKEND_API_URL}/chat/session`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: authHeader,
      },
    })

    if (!response.ok) {
      const error = await response.json()
      console.error("Failed to Create Chat Session:", error)
      toast.error("Failed to Create Chat Session!", {
        description: error instanceof Error ? error.message : "Failed to Create Chat Session!",
      })
      return NextResponse.json(
        { error: error.error || "Failed to Create Chat Session!" },
        { status: response.status }
      )
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error Creating Chat Session:", error)
    toast.error("Failed to Create Chat Session!", {
      description: error instanceof Error ? error.message : "Failed to Create Chat Session!",
    })
    return NextResponse.json(
      { error: "Failed to Create Chat Session!" },
      { status: 500 }
    )
  }
}
