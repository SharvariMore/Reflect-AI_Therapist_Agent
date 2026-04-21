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
    console.log("Creating New Chat Session...")
    const response = await fetch(`${API_BASE}/chat/sessions`, {
      method: "POST",
      headers: getAuthHeaders(),
    })

    if (!response.ok) {
      const error = await parseErrorResponse(response)
      console.error("Failed to Create Chat Session:", error)
      throw new Error(error.error || "Failed to Create Chat Session!")
    }

    const data = await response.json()
    console.log("Chat Session Created:", data)
    return data.sessionId
  } catch (error) {
    console.error("Error Creating Chat Session:", error)
    throw error
  }
}

export const sendChatMessage = async (
  sessionId: string,
  message: string
): Promise<ApiResponse> => {
  try {
    console.log(`Sending message to session ${sessionId}:`, message)
    const response = await fetch(
      `${API_BASE}/chat/sessions/${sessionId}/messages`,
      {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({ message }),
      }
    )

    if (!response.ok) {
      const error = await parseErrorResponse(response)
      console.error("Failed to Send Message:", error)
      throw new Error(error.error || "Failed to Send Message!")
    }

    const data = await response.json()
    console.log("Message Sent Successfully:", data)
    return data
  } catch (error) {
    console.error("Error Sending Chat Message:", error)
    throw error
  }
}

export const getChatHistory = async (
  sessionId: string
): Promise<ChatMessage[]> => {
  try {
    console.log(`Fetching chat history for session ${sessionId}`)
    const response = await fetch(
      `${API_BASE}/chat/sessions/${sessionId}/history`,
      {
        headers: getAuthHeaders(),
      }
    )

    if (!response.ok) {
      const error = await parseErrorResponse(response)
      console.error("Failed to Fetch Chat History:", error)
      throw new Error(error.error || "Failed to Fetch Chat History!")
    }

    const data = await response.json()
    console.log("Received Chat History:", data)

    if (!Array.isArray(data)) {
      console.error("Invalid Chat History Format:", data)
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
    throw error
  }
}

export const getAllChatSessions = async (): Promise<ChatSession[]> => {
  try {
    console.log("Fetching All Chat Sessions...")
    const response = await fetch(`${API_BASE}/chat/sessions`, {
      headers: getAuthHeaders(),
    })

    if (!response.ok) {
      const error = await parseErrorResponse(response)
      console.error("Failed to Fetch Chat Sessions:", error)
      throw new Error(error.error || "Failed to Fetch Chat Sessions!")
    }

    const data = await response.json()
    console.log("Received Chat Sessions:", data)

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
    throw error
  }
}
