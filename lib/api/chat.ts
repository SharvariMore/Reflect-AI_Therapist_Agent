import { toast } from "sonner"

export interface ChatMessage {
  role: "user" | "assistant"
  content: string
  timestamp: Date
  metadata?: {
    technique: string
    goal: string
    progress: any[]
    analysis?: {
      emotionalState: string
      themes: string[]
      riskLevel: number
      recommendedApproach: string
      progressIndicators: string[]
    }
  }
}

export interface ChatSession {
  sessionId: string
  messages: ChatMessage[]
  createdAt: Date
  updatedAt: Date
}

export interface ApiResponse {
  message: string
  response?: string
  analysis?: {
    emotionalState: string
    themes: string[]
    riskLevel: number
    recommendedApproach: string
    progressIndicators: string[]
  }
  metadata?: {
    technique: string
    goal: string
    progress: any[]
  }
}

const API_BASE = process.env.BACKEND_API_URL || "http://localhost:3001/api"

const parseErrorResponse = async (response: Response) => {
  const contentType = response.headers.get("content-type") || ""

  if (contentType.includes("application/json")) {
    return response.json()
  }

  const text = await response.text()
  return { error: text || `HTTP ${response.status}` }
}

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem("token")
  return {
    "Content-Type": "application/json",
    Authorization: token ? `Bearer ${token}` : "",
  }
}

export const createChatSession = async (): Promise<string> => {
  try {
    const response = await fetch(`${API_BASE}/api/chat/sessions`, {
      method: "POST",
      headers: getAuthHeaders(),
    })

    if (!response.ok) {
      const error = await parseErrorResponse(response)
      console.error("Failed to Create Chat Session:", error)
      toast.error("Failed to Create Chat Session!", {
        description: error instanceof Error ? error.message : "Failed to Create Chat Session!",
      })
      throw new Error(error.error || "Failed to Create Chat Session!")
    }

    const data = await response.json()
    return data.sessionId
  } catch (error) {
    console.error("Error Creating Chat Session:", error)
    toast.error("Failed to Create Chat Session!", {
      description: error instanceof Error ? error.message : "Failed to Create Chat Session!",
    })
    throw error
  }
}

export const sendChatMessage = async (
  sessionId: string,
  message: string
): Promise<ApiResponse> => {
  try {
    const response = await fetch(
      `${API_BASE}/api/chat/sessions/${sessionId}/messages`,
      {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({ message }),
      }
    )

    if (!response.ok) {
      const error = await parseErrorResponse(response)
      console.error("Failed to Send Message:", error)
      toast.error("Failed to Send Message!", {
        description: error instanceof Error ? error.message : "Failed to Send Message!",
      })
      throw new Error(error.error || "Failed to Send Message!")
    }

    const data = await response.json()
    toast.success("Message Sent Successfully!", {
      // description: "Your message has been sent to the therapist.",
      duration: 3000,
      position: "top-center",
    })
    return data
  } catch (error) {
    console.error("Error Sending Chat Message:", error)
    toast.error("Error Sending Chat Message!", {
      description: error instanceof Error ? error.message : "Error Sending Chat Message!",
    })
    throw error
  }
}

export const getChatHistory = async (
  sessionId: string
): Promise<ChatMessage[]> => {
  try {
    const response = await fetch(
      `${API_BASE}/api/chat/sessions/${sessionId}/history`,
      {
        headers: getAuthHeaders(),
      }
    )

    if (!response.ok) {
      const error = await parseErrorResponse(response)
      console.error("Failed to Fetch Chat History:", error)
      toast.error("Failed to Fetch Chat History!", {
        description: error instanceof Error ? error.message : "Failed to Fetch Chat History!",
      })
      throw new Error(error.error || "Failed to Fetch Chat History!")
    }

    const data = await response.json()

    if (!Array.isArray(data)) {
      console.error("Invalid Chat History Format:", data)
      toast.error("Invalid Chat History Format!", {
        description: "Invalid Chat History Format!",
      })
      throw new Error("Invalid Chat History Format!")
    }

    // Ensure each message has the correct format
    return data.map((msg: any) => ({
      role: msg.role,
      content: msg.content,
      timestamp: new Date(msg.timestamp),
      metadata: msg.metadata,
    }))
  } catch (error) {
    console.error("Error Fetching Chat History:", error)
    toast.error("Error Fetching Chat History!", {
      description: error instanceof Error ? error.message : "Error Fetching Chat History!",
    })
    throw error
  }
}

export const getAllChatSessions = async (): Promise<ChatSession[]> => {
  try {
    const response = await fetch(`${API_BASE}/api/chat/sessions`, {
      headers: getAuthHeaders(),
    })

    if (!response.ok) {
      const error = await parseErrorResponse(response)
      console.error("Failed to Fetch Chat Sessions:", error)
      toast.error("Failed to Fetch Chat Sessions!", {
        description: error instanceof Error ? error.message : "Failed to Fetch Chat Sessions!",
      })
      throw new Error(error.error || "Failed to Fetch Chat Sessions!")
    }

    const data = await response.json()

    return data.map((session: any) => {
      // Ensure dates are valid
      const createdAt = new Date(session.createdAt || Date.now())
      const updatedAt = new Date(session.updatedAt || Date.now())

      return {
        ...session,
        createdAt: isNaN(createdAt.getTime()) ? new Date() : createdAt,
        updatedAt: isNaN(updatedAt.getTime()) ? new Date() : updatedAt,
        messages: (session.messages || []).map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp || Date.now()),
        })),
      }
    })
  } catch (error) {
    console.error("Error Fetching Chat Sessions:", error)
    toast.error("Error Fetching Chat Sessions!", {
      description: error instanceof Error ? error.message : "Error Fetching Chat Sessions!",
    })
    throw error
  }
}
