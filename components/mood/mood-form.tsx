"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { useSession } from "@/lib/contexts/session-context"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"

import { useRouter } from "next/navigation"

interface MoodFormProps {
  onSuccess?: () => void /* Callback function to be called when mood is successfully submitted */
}

export default function MoodForm({ onSuccess }: MoodFormProps) {
  const [moodScore, setMoodScore] = useState(50) /* Hold user's selected mood */
  const [isLoading, setIsLoading] = useState(false)
  const { user, isAuthenticated, loading } = useSession()
  const router = useRouter()

  const emotions = [
    { value: 0, label: "😔", description: "Very Low" },
    { value: 25, label: "☹️", description: "Low" },
    { value: 50, label: "😊", description: "Neutral" },
    { value: 75, label: "😃", description: "Good" },
    { value: 100, label: "🤗", description: "Great" },
  ]

  /* Find emotion that is closest to the user's selected mood */
  const currentEmotion =
    emotions.find((em) => Math.abs(moodScore - em.value) < 15) || emotions[2]

  const handleSubmit = async () => {
    console.log("MoodForm: Starting submission")
    console.log("MoodForm: Auth state:", { isAuthenticated, loading, user })

    if (!isAuthenticated) {
      console.log("MoodForm: User not authenticated")
      toast.warning("Authentication Required!", {
        description: "Please Login to Track Your Mood.",
        duration: 5000,
      })
      router.push("/login")
      return
    }

    try {
      setIsLoading(true)
      const token = localStorage.getItem("token")
      console.log(
        "MoodForm: Token from localStorage:",
        token ? "exists" : "not found"
      )

      const response = await fetch("/api/mood", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ score: moodScore }),
      })

      console.log("MoodForm: Response status:", response.status)

      if (!response.ok) {
        const error = await response.json()
        console.error("MoodForm: Error response:", error)
        throw new Error(error.error || "Failed to Track Your Mood!")
      }

      const data = await response.json()
      console.log("MoodForm: Success response:", data)

      toast.success("Mood Tracked Successfully!", {
        // description: "Your Mood has Been Recorded!",
        duration: 5000,
      })

      // Call onSuccess to close the modal
      onSuccess?.()
    } catch (error) {
      console.error("MoodForm: Error:", error)
      toast.error("Error", {
        description:
          error instanceof Error ? error.message : "Failed to Track Your Mood!",
        duration: 5000,
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <div className="space-y-6 py-4">
        <div className="space-y-2 text-center">
          <div className="text-4xl">{currentEmotion.label}</div>
        </div>
        <div className="text-sm text-muted-foreground">
          {currentEmotion.description}
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between px-2">
          {emotions.map((em) => (
            <div
              key={em.value}
              className={`cursor-pointer transition-opacity ${
                Math.abs(moodScore - em.value) < 15
                  ? "opacity-100"
                  : "opacity-50"
              }`}
              onClick={() => setMoodScore(em.value)}
            >
              <div className="text-2xl">{em.label}</div>
            </div>
          ))}
        </div>

        <Slider
          value={[moodScore]}
          onValueChange={(value) => setMoodScore(value[0])}
          min={0}
          max={100}
          step={1}
          className="py-4"
        />
      </div>
      <Button
        onClick={handleSubmit}
        className="w-full cursor-pointer"
        disabled={isLoading || loading}
      >
        {isLoading ? "Saving..." : "Save Mood"}
      </Button>
    </>
  )
}
