import { NextRequest, NextResponse } from "next/server"
import { toast } from "sonner"

const BACKEND_API_URL = process.env.BACKEND_API_URL || "http://localhost:3001"

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  try {
    const { sessionId } = await params
    const response = await fetch(
      `${BACKEND_API_URL}/chat/sessions/${sessionId}/history`
    )

    if (!response.ok) {
      throw new Error(`HTTP Error! Status: ${response.status}`)
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error in Chat History API:", error)
    toast.error("Failed to Fetch Chat History! Please Try Again.")
    return NextResponse.json(
      { error: "Failed to Fetch Chat History!" },
      { status: 500 }
    )
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: { sessionId: string } }
) {
  try {
    const { sessionId } = params
    const { message } = await req.json()

    if (!message) {
      return NextResponse.json(
        { error: "Message is Required!" },
        { status: 400 }
      )
    }

    const response = await fetch(
      `${BACKEND_API_URL}/chat/session/${sessionId}/messages`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message }),
      }
    )

    if (!response.ok) {
      throw new Error(`HTTP Error! Status: ${response.status}`)
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error in Chat API:", error)
    toast.error("Failed to Process Chat Message! Please Try Again.")
    return NextResponse.json(
      { error: "Failed to Process Chat Message!" },
      { status: 500 }
    )
  }
}
