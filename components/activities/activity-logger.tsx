"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Plus, X, Loader2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useSession } from "@/lib/contexts/session-context"
import { toast } from "sonner"
import { logActivity } from "@/lib/api/activity"

const activityTypes = [
  { id: "meditation", name: "Meditation" },
  { id: "exercise", name: "Exercise" },
  { id: "walking", name: "Walking" },
  { id: "reading", name: "Reading" },
  { id: "journaling", name: "Journaling" },
  { id: "therapy", name: "Therapy Session" },
]

interface ActivityLoggerProps {
  open: boolean
  onOpenChange: (open: boolean) => void //update modal visibility
  onActivityLogged: () => void //callback when activity is successfully logged
}

export default function ActivityLogger({
  open,
  onOpenChange,
  onActivityLogged,
}: ActivityLoggerProps) {
  const [type, setType] = useState("")
  const [name, setName] = useState("")
  const [duration, setDuration] = useState("")
  const [description, setDescription] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { user, isAuthenticated, loading } = useSession()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isAuthenticated) {
      toast.warning("Authentication Required!", {
        description: "Please Log In to Log Activities",
        duration: 3000,
      })
      return
    }

    if (!type || !name) {
      toast.warning("Missing Information!", {
        description: "Please Fill in All Required Fields!",
        duration: 3000,
      })
      return
    }

    setIsLoading(true)
    try {
      await logActivity({
        type,
        name,
        description,
        duration: duration ? parseInt(duration) : undefined,
      })

      // Reset form
      setType("")
      setName("")
      setDuration("")
      setDescription("")

      toast.success("Activity Logged Successfully!", {
        // description: "Your Activity Has Been Recorded.",
        duration: 3000,
        position: "top-center",
      })

      onActivityLogged()
      onOpenChange(false)
    } catch (error) {
      console.error("Error logging activity:", error)
      toast.error("Failed to log activity! Please Try Again.", {
        description:
          error instanceof Error ? error.message : "Failed to Log Activity!",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Log Activity</DialogTitle>
          <DialogDescription>Record Your Wellness Activity</DialogDescription>
        </DialogHeader>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label>Activity Type</Label>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger>
                <SelectValue placeholder="Select activity type" />
              </SelectTrigger>
              <SelectContent>
                {activityTypes.map((type) => (
                  <SelectItem key={type.id} value={type.id}>
                    {type.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Name</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Morning Yoga, Evening Walk, etc."
            />
          </div>

          <div className="space-y-2">
            <Label>Duration (minutes)</Label>
            <Input
              type="number"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              placeholder="15"
              min={0}
              max={1200000000000000}
            />
          </div>

          <div className="space-y-2">
            <Label>Description (optional)</Label>
            <Input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="How did it go?"
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
              className="cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading || loading}
              className="cursor-pointer"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : loading ? (
                "Loading..."
              ) : (
                "Save Activity"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
