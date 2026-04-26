import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  const body = await request.json()
  const BACKEND_API_URL = process.env.BACKEND_API_URL || "http://localhost:3001"

  try {
    const resp = await fetch(`${BACKEND_API_URL}/api/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })
    const data = await resp.json()
    return NextResponse.json(data, { status: resp.status })
  } catch (error) {
    return NextResponse.json(
      { message: "Server Error!", error },
      { status: 500 }
    )
  }
}
