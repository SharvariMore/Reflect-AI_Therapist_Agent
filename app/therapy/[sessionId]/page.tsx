"use client"

import { useEffect, useRef, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  Send,
  Bot,
  User,
  Loader2,
  Sparkles,
  X,
  Trophy,
  Star,
  Clock,
  Smile,
  PlusCircle,
  MessageSquare,
  Stethoscope,
  ArrowBigLeft,
  ArrowBigRight,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"
import ReactMarkdown from "react-markdown"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import BreathingGame from "@/components/games/breathing-game"
import ZenGarden from "@/components/games/zen-garden"
import ForestGame from "@/components/games/forest-game"
import OceanWaves from "@/components/games/ocean-waves"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { formatDistanceToNow } from "date-fns"
import { Separator } from "@/components/ui/separator"
import {
  createChatSession,
  sendChatMessage,
  getChatHistory,
  ChatMessage,
  getAllChatSessions,
  ChatSession,
} from "@/lib/api/chat"

interface SuggestedQuestion {
  id: string
  text: string
}

interface StressPrompt {
  trigger: string
  activity: {
    type: "breathing" | "garden" | "forest" | "waves"
    title: string
    description: string
  }
}

interface ApiResponse {
  message: string
  metadata: {
    technique: string
    goal: string
    progress: any[]
  }
}

const SUGGESTED_QUESTIONS = [
  { text: "How can I manage my anxiety better?" },
  { text: "I've been feeling overwhelmed lately" },
  { text: "Can we talk about improving sleep?" },
  { text: "I need help with work-life balance" },
]

const glowAnimation = {
  initial: { opacity: 0.5, scale: 1 },
  animate: {
    opacity: [0.5, 1, 0.5],
    scale: [1, 1.05, 1],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
}

const COMPLETION_THRESHOLD = 5

export default function TherapyPage() {
  const { sessionId: routeSessionId } = useParams<{ sessionId: string }>()
  const [message, setMessage] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [messages, setMessages] = useState<any[]>([])
  const [mounted, setMounted] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isChatPaused, setIsChatPaused] = useState(false)
  const [sessions, setSessions] = useState<ChatSession[]>([])
  const [sessionId, setSessionId] = useState<string | null>(routeSessionId)
  const [showActivity, setShowActivity] = useState(false)
  const [isCompletingSession, setIsCompletingSession] = useState(false)
  const [showNFTCelebration, setShowNFTCelebration] = useState(false)
  const [stressPrompt, setStressPrompt] = useState<StressPrompt | null>(null)
  const router = useRouter()
  const [sessionPage, setSessionPage] = useState(1)
  const sessionsPerPage = 3

  const totalSessionPages = Math.ceil(sessions.length / sessionsPerPage)

  const paginatedSessions = sessions.slice(
    (sessionPage - 1) * sessionsPerPage,
    sessionPage * sessionsPerPage
  )

  const handleNewSession = async () => {
    try {
      setIsLoading(true)
      const newSessionId = await createChatSession()

      // Update sessions list immediately
      const newSession: ChatSession = {
        sessionId: newSessionId,
        messages: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      setSessions((prev) => [newSession, ...prev])
      setSessionId(newSessionId)
      setMessages([])
      setSessionPage(1)

      // Update URL without refresh
      window.history.pushState({}, "", `/therapy/${newSessionId}`)

      // Force a re-render of the chat area
      setIsLoading(false)
    } catch (error) {
      console.error("Failed to Create New Session:", error)
      setIsLoading(false)
    }
  }

  //Runs when sessionId changes
  useEffect(() => {
    const initChat = async () => {
      try {
        setIsLoading(true)
        if (!sessionId || sessionId === "new") {
          const newSessionId = await createChatSession()
          setSessionId(newSessionId)
          window.history.pushState({}, "", `/therapy/${newSessionId}`)
        } else {
          try {
            const history = await getChatHistory(sessionId)
            if (Array.isArray(history)) {
              const formattedHistory = history.map((msg) => ({
                ...msg,
                timestamp: new Date(msg.timestamp),
              }))
              setMessages(formattedHistory)
            } else {
              console.error("Invalid Chat History Format:", history)
              setMessages([])
            }
          } catch (historyError) {
            console.error("Error Loading Chat History:", historyError)
            setMessages([])
          }
        }
      } catch (error) {
        setMessages([
          {
            role: "assistant",
            content:
              "I apologize, but I'm having trouble loading the chat session! Please try refreshing the page.",
            timestamp: new Date(),
          },
        ])
      } finally {
        setIsLoading(false)
      }
    }
    initChat()
  }, [sessionId])

  // Load all chat sessions and update local sessions state
  useEffect(() => {
    const loadSessions = async () => {
      try {
        const allSessions = await getAllChatSessions()
        setSessions(allSessions)
      } catch (error) {
        console.error("Failed to Load Sessions:", error)
      }
    }

    loadSessions()
  }, [messages])

  //automatically scroll to bottom of chat
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
      }, 100)
    }
  }

  //scroll to bottom of chat only when AI is not typing
  useEffect(() => {
    if (!isTyping) {
      scrollToBottom()
    }
  }, [messages, isTyping])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Form submitted")
    const currentMessage = message.trim()
    console.log("Current message:", currentMessage)
    console.log("Session ID:", sessionId)
    console.log("Is typing:", isTyping)
    console.log("Is chat paused:", isChatPaused)

    if (!currentMessage || isTyping || isChatPaused || !sessionId) {
      console.log("Submission blocked:", {
        noMessage: !currentMessage,
        isTyping,
        isChatPaused,
        noSessionId: !sessionId,
      })
      return
    }

    setMessage("")
    setIsTyping(true)

    try {
      // Add user message
      const userMessage: ChatMessage = {
        role: "user",
        content: currentMessage,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, userMessage])

      // Check for stress signals
      const stressCheck = detectStressSignals(currentMessage)
      if (stressCheck) {
        setStressPrompt(stressCheck)
        setIsTyping(false)
        return
      }

      console.log("Sending message to API...")
      // Send message to API
      const response = await sendChatMessage(sessionId, currentMessage)
      console.log("Raw API response:", response)

      // Parse the response if it's a string
      const aiResponse =
        typeof response === "string" ? JSON.parse(response) : response
      console.log("Parsed AI response:", aiResponse)

      // Add AI response with metadata
      const assistantMessage: ChatMessage = {
        role: "assistant",
        content:
          aiResponse.response ||
          aiResponse.message ||
          "I'm here to support you. Could you tell me more about what's on your mind?",
        timestamp: new Date(),
        metadata: {
          analysis: aiResponse.analysis || {
            emotionalState: "neutral",
            riskLevel: 0,
            themes: [],
            recommendedApproach: "supportive",
            progressIndicators: [],
          },
          technique: aiResponse.metadata?.technique || "supportive",
          goal: aiResponse.metadata?.currentGoal || "Provide support",
          progress: aiResponse.metadata?.progress || {
            emotionalState: "neutral",
            riskLevel: 0,
          },
        },
      }

      console.log("Created assistant message:", assistantMessage)

      // Add the message immediately
      setMessages((prev) => [...prev, assistantMessage])
      setIsTyping(false)
      scrollToBottom()
    } catch (error) {
      console.error("Error in chat:", error)
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "I apologize, but I'm having trouble connecting right now. Please try again in a moment.",
          timestamp: new Date(),
        },
      ])
      setIsTyping(false)
    }
  }

  // trigger animation only after the component is loaded at client side
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted || isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary" />
      </div>
    )
  }

  const detectStressSignals = (message: string): StressPrompt | null => {
    const stressKeywords = [
      "stress",
      "anxiety",
      "worried",
      "panic",
      "overwhelmed",
      "nervous",
      "tense",
      "pressure",
      "can't cope",
      "exhausted",
    ]

    const lowercaseMsg = message.toLowerCase()
    const foundKeyword = stressKeywords.find((keyword) =>
      lowercaseMsg.includes(keyword)
    )

    if (foundKeyword) {
      const activities = [
        {
          type: "breathing" as const,
          title: "Breathing Exercise",
          description:
            "Follow calming breathing exercises with visual guidance",
        },
        {
          type: "garden" as const,
          title: "Zen Garden",
          description: "Create and maintain your digital peaceful space",
        },
        {
          type: "forest" as const,
          title: "Mindful Forest",
          description: "Take a peaceful walk through a virtual forest",
        },
        {
          type: "waves" as const,
          title: "Ocean Waves",
          description: "Match your breath with gentle ocean waves",
        },
      ]

      return {
        trigger: foundKeyword,
        activity: activities[Math.floor(Math.random() * activities.length)],
      }
    }

    return null
  }

  const handleSuggestedQuestion = async (text: string) => {
    if (!sessionId) {
      const newSessionId = await createChatSession()
      setSessionId(newSessionId)
      router.push(`/therapy/${newSessionId}`)
    }

    setMessage(text)
    setTimeout(() => {
      const event = new Event("submit") as unknown as React.FormEvent
      handleSubmit(event)
    }, 0)
  }

  const handleCompleteSession = async () => {
    if (isCompletingSession) return
    setIsCompletingSession(true)
    try {
      setShowNFTCelebration(true)
    } catch (error) {
      console.error("Error completing session:", error)
    } finally {
      setIsCompletingSession(false)
    }
  }

  //Runs when a session is selected from sidevar
  const handleSessionSelect = async (selectedSessionId: string) => {
    //Prevent re-loading the same session
    if (selectedSessionId === sessionId) return

    try {
      setIsLoading(true)
      const history = await getChatHistory(selectedSessionId)
      if (Array.isArray(history)) {
        const formattedHistory = history.map((msg) => ({
          ...msg,
          timestamp: new Date(msg.timestamp),
        }))
        setMessages(formattedHistory)
        setSessionId(selectedSessionId)
        //Preserve navigation history
        window.history.pushState({}, "", `/therapy/${selectedSessionId}`)
      }
    } catch (error) {
      console.error("Failed to Load Session:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // useEffect(() => {
  //   const maxPage = Math.max(1, Math.ceil(sessions.length / sessionsPerPage))
  //   if (sessionPage > maxPage) {
  //     setSessionPage(maxPage)
  //   }
  // }, [sessions, sessionPage])

  return (
    <div className="relative mx-auto max-w-7xl px-4">
      <div className="mt-20 flex h-[calc(100vh-4rem)] gap-6">
        {/* Sidebar with chat history */}
        <div className="flex w-80 flex-col border-r bg-muted/30">
          <div className="border-b p-4">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold">Chat Sessions</h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleNewSession}
                className="cursor-pointer hover:bg-primary/10"
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <PlusCircle className="h-5 w-5" />
                )}
              </Button>
            </div>
            <Button
              variant="outline"
              className="w-full cursor-pointer justify-start gap-2"
              onClick={handleNewSession}
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <MessageSquare className="h-4 w-4" />
              )}
              New Session
            </Button>
          </div>

          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {paginatedSessions.map((session) => (
                <div
                  key={session.sessionId}
                  className={cn(
                    "cursor-pointer rounded-lg p-3 text-sm transition-colors hover:bg-primary/5",
                    session.sessionId === sessionId
                      ? "bg-primary/10 text-primary"
                      : "bg-secondary/10"
                  )}
                  onClick={() => handleSessionSelect(session.sessionId)}
                >
                  <div className="mb-1 flex items-center gap-2">
                    <MessageSquare className="h-4 w-4" />
                    <span className="font-medium">
                      {session.messages[0]?.content.slice(0, 30) || "New Chat"}
                    </span>
                  </div>
                  {/* line-clamp: 2 snippets of last message content to prevent overflow */}
                  <p className="line-clamp-2 text-muted-foreground">
                    {session.messages[session.messages.length - 1]?.content ||
                      "No Messages Yet!"}
                  </p>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">
                      {session.messages.length} messages
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {(() => {
                        try {
                          const date = new Date(session.updatedAt)
                          if (isNaN(date.getTime())) {
                            return "Just Now"
                          }
                          return formatDistanceToNow(date, {
                            addSuffix: true,
                          })
                        } catch (error) {
                          return "Just Now"
                        }
                      })()}
                    </span>
                  </div>
                </div>
              ))}

              <div className="flex items-center justify-center gap-3 pt-3">
                {/* Prev */}
                <Button
                  onClick={() =>
                    setSessionPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={sessionPage === 1}
                  className="cursor-pointer rounded border px-3 py-1 disabled:opacity-50"
                >
                  <ArrowBigLeft className="h-4 w-4" />
                  Prev
                </Button>

                {/* Current Page Number */}
                <span className="rounded bg-primary px-4 py-1 text-sm font-medium text-primary-foreground">
                  {sessionPage} / {totalSessionPages}
                </span>

                {/* Next */}
                <Button
                  onClick={() =>
                    setSessionPage((prev) =>
                      Math.min(prev + 1, totalSessionPages)
                    )
                  }
                  disabled={sessionPage === totalSessionPages}
                  className="cursor-pointer rounded border px-3 py-1 disabled:opacity-50"
                >
                  Next
                  <ArrowBigRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </ScrollArea>
        </div>

        <div className="flex flex-1 flex-col overflow-hidden rounded-lg border bg-white dark:bg-background">
          <div className="flex items-center justify-center gap-2 p-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Bot className="h-5 w-5" />
            </div>
          </div>
          <h2 className="text-center text-xl font-semibold">AI Therapist</h2>
          <p className="p-1 text-center text-sm text-muted-foreground">
            {messages.length} messages
          </p>

          {messages.length === 0 ? (
            <div className="flex flex-1 items-center justify-center p-4">
              <div className="w-full max-w-2xl space-y-8">
                <div className="space-y-4 text-center">
                  <div className="relative inline-flex flex-col items-center">
                    <motion.div
                      className="absolute inset-0 rounded-full bg-primary/20 blur-2xl"
                      initial="initial"
                      animate="animate"
                      variants={glowAnimation as any}
                    />
                    <div className="relative flex items-center gap-2 text-2xl font-semibold">
                      <div className="relative">
                        <Stethoscope className="h-6 w-6 text-primary" />
                        <motion.div
                          className="absolute inset-0 text-primary"
                          initial="initial"
                          animate="animate"
                          variants={glowAnimation as any}
                        >
                          <Stethoscope className="h-6 w-6" />
                        </motion.div>
                      </div>
                      <span className="bg-gradient-to-r from-primary/90 to-primary bg-clip-text text-transparent">
                        AI Therapist
                      </span>
                    </div>
                    <p className="mt-2 text-muted-foreground">
                      How can I assist you today?
                    </p>
                  </div>
                </div>
                <div className="relative grid gap-3">
                  <motion.div
                    className="absolute -inset-4 bg-gradient-to-b from-primary/5 to-transparent blur-xl"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  />
                  {SUGGESTED_QUESTIONS.map((q, index) => (
                    <motion.div
                      key={q.text}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 + 0.5 }}
                    >
                      <Button
                        variant="outline"
                        className="h-auto w-full justify-start px-6 py-4 text-left transition-all duration-300 hover:border-primary/50 hover:bg-muted/50"
                        onClick={() => handleSuggestedQuestion(q.text)}
                      >
                        {q.text}
                      </Button>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            // Chat messages
            <div className="flex-1 overflow-y-auto scroll-smooth">
              <div className="mx-auto max-w-3xl">
                <AnimatePresence initial={false}>
                  {messages.map((msg) => (
                    <motion.div
                      key={msg.timestamp.toISOString()}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className={cn(
                        "px-6 py-8",
                        msg.role === "assistant"
                          ? "bg-muted/30"
                          : "bg-background"
                      )}
                    >
                      <div className="flex gap-4">
                        <div className="mt-1 h-8 w-8 shrink-0">
                          {msg.role === "assistant" ? (
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary ring-1 ring-primary/20">
                              <Bot className="h-5 w-5" />
                            </div>
                          ) : (
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-secondary-foreground">
                              <User className="h-5 w-5" />
                            </div>
                          )}
                        </div>
                        <div className="min-h-[2rem] flex-1 space-y-2 overflow-hidden">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium">
                              {msg.role === "assistant"
                                ? "AI Therapist"
                                : "You"}
                            </p>
                            {msg.metadata?.technique && (
                              <Badge variant="secondary" className="text-xs">
                                {msg.metadata.technique}
                              </Badge>
                            )}
                          </div>
                          <div className="prose prose-sm dark:prose-invert leading-relaxed">
                            <ReactMarkdown>{msg.content}</ReactMarkdown>
                          </div>
                          {msg.metadata?.goal && (
                            <p className="mt-2 text-xs text-muted-foreground">
                              Goal: {msg.metadata.goal}
                            </p>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex gap-4 bg-muted/30 px-6 py-8"
                  >
                    <div className="h-8 w-8 shrink-0">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary ring-1 ring-primary/20">
                        <Loader2 className="h-4 w-4 animate-spin" />
                      </div>
                    </div>
                    <div className="flex-1 space-y-2">
                      <p className="text-sm font-medium">AI Therapist</p>
                      <p className="text-sm text-muted-foreground">Typing...</p>
                    </div>
                  </motion.div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </div>
          )}

          {/* Input area */}
          <div className="border-t bg-background/50 p-4 backdrop-blur supports-[backdrop-filter]:bg-background/50">
            <form
              onSubmit={handleSubmit}
              className="relative mx-auto flex max-w-3xl items-end gap-4"
            >
              <div className="group relative flex-1">
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={
                    isChatPaused
                      ? "Complete the activity to continue..."
                      : "Ask me anything..."
                  }
                  className={cn(
                    "w-full resize-none rounded-2xl border bg-background",
                    "max-h-[200px] min-h-[48px] p-3 pr-12",
                    "focus:ring-2 focus:ring-primary/50 focus:outline-none",
                    "transition-all duration-200",
                    "placeholder:text-muted-foreground/70",
                    (isTyping || isChatPaused) &&
                      "cursor-not-allowed opacity-50"
                  )}
                  rows={1}
                  disabled={isTyping || isChatPaused}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault()
                      handleSubmit(e)
                    }
                  }}
                />
                <Button
                  type="submit"
                  size="icon"
                  className={cn(
                    "absolute right-1.5 bottom-3.5 h-[36px] w-[36px]",
                    "rounded-xl transition-all duration-200",
                    "bg-primary hover:bg-primary/90",
                    "shadow-sm shadow-primary/20",
                    (isTyping || isChatPaused || !message.trim()) &&
                      "cursor-not-allowed opacity-50",
                    "group-focus-within:scale-105 group-hover:scale-105"
                  )}
                  disabled={isTyping || isChatPaused || !message.trim()}
                  onClick={(e) => {
                    e.preventDefault()
                    handleSubmit(e)
                  }}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </form>
            <div className="mt-2 text-center text-xs text-muted-foreground">
              Press <kbd className="rounded bg-muted px-2 py-0.5">Enter ↵</kbd>{" "}
              to send,
              <kbd className="ml-1 rounded bg-muted px-2 py-0.5">
                Shift + Enter
              </kbd>{" "}
              for new line
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
