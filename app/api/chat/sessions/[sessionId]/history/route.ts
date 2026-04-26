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
      `${BACKEND_API_URL}/chat/sessions/${sessionId}/history`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    )

    if (!response.ok) {
      const error = await response.json()
      console.error("Failed to Get Chat History:", error)
      toast.error("Failed to Get Chat History! Please Try Again.")
      return NextResponse.json(
        { error: error.error || "Failed to Get Chat History!" },
        { status: response.status }
      )
    }

    const data = await response.json()
  
    // Format the response to match the frontend's expected format
    const formattedMessages = data.map((msg: any) => ({
      role: msg.role,
      content: msg.content,
      timestamp: msg.timestamp,
    }))

    return NextResponse.json(formattedMessages)
  } catch (error) {
    console.error("Error Getting Chat History:", error)
    toast.error("Failed to Get Chat History! Please Try Again.")
    return NextResponse.json(
      { error: "Failed to Get Chat History!" },
      { status: 500 }
    )
  }
}
