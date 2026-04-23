import { NextRequest, NextResponse } from "next/server";
import { toast } from "sonner";

const BACKEND_API_URL =
  process.env.BACKEND_API_URL ||
  "http://localhost:3001";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  try {
    const { sessionId } = await params;
    const body = await req.json();
    const { message } = body;

    if (!message) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    const response = await fetch(
      `${BACKEND_API_URL}/chat/sessions/${sessionId}/messages`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message }),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      console.error("Failed to send message:", error);
      toast.error("Failed to send message! Please Try Again.");
      return NextResponse.json(
        { error: error.error || "Failed to send message" },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log("Message sent successfully:", data);
    toast.success("Message Sent Successfully!");
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error sending message:", error);
    toast.error("Failed to send message! Please Try Again.");
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 }
    );
  }
}