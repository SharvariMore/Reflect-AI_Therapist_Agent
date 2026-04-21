"use client"

import ActivityLogger from "@/components/activities/activity-logger"
import { AnxietyGames } from "@/components/games/anxiety-games"
import MoodForm from "@/components/mood/mood-form"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Container } from "@/components/ui/container"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useSession } from "@/lib/contexts/session-context"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { motion } from "framer-motion"
import {
  Activity,
  ArrowRight,
  Brain,
  BrainCircuit,
  CircleArrowRight,
  ClipboardClock,
  Heart,
  HeartPlus,
  HeartPulse,
  MessageSquare,
  MessageSquareMore,
  Sparkles,
  Trophy,
  Zap,
} from "lucide-react"
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react"

export default function DashboardPage() {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [showMoodModal, setShowMoodModal] = useState(false)
  const [showActivityLogger, setShowActivityLogger] = useState(false)
  const router = useRouter();
  const { user } = useSession();

  // Update wellness stats to reflect the changes
  const wellnessStats = [
    {
      title: "Mood Score",
      value: "No data",
      icon: HeartPulse,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
      description: "Today's average mood",
    },
    {
      title: "Completion Rate",
      value: "100%",
      icon: Trophy,
      color: "text-yellow-500",
      bgColor: "bg-yellow-500/10",
      description: "Perfect completion rate",
    },
    {
      title: "Therapy Sessions",
      value: "0 sessions",
      icon: ClipboardClock,
      color: "text-rose-500",
      bgColor: "bg-rose-500/10",
      description: "Total sessions completed",
    },
    {
      title: "Total Activities",
      value: "0 activities",
      icon: Activity,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
      description: "Planned for today",
    },
  ]

  const handleAICheckIn = () => {
    setShowActivityLogger(true)
  }

  const handleStartTherapy = () => {
    router.push("/therapy/new")
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen bg-background">
      <Container className="space-y-6 pt-20 pb-8">
        <div className="flex flex-col gap-2">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-2"
          >
            <h1 className="text-3xl font-bold"> Welcome back, {user?.name || "there"}!</h1>
            <p className="text-sm text-muted-foreground">
              {currentTime.toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
              })}
            </p>
          </motion.div>
        </div>

        {/* Grid Layout */}
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card className="group relative overflow-hidden border-primary/10">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-primary/10 to-transparent" />
              <CardContent className="relative p-6">
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                      <Zap className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">Quick Actions</h3>
                      <p className="text-sm text-muted-foreground">
                        Start your wellness journey
                      </p>
                    </div>
                  </div>
                  <div className="grid gap-3">
                    <Button
                      variant="default"
                      className={cn(
                        "group/button h-auto w-full items-center justify-between p-6",
                        "bg-gradient-to-r from-primary/90 to-primary hover:from-primary hover:to-primary/90",
                        "transition-all duration-200 group-hover:translate-y-[-2px]"
                      )}
                      onClick={handleStartTherapy}
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10">
                          <MessageSquareMore className="h-4 w-4 text-white" />
                        </div>
                        <div className="text-left">
                          <div className="font-semibold text-white">
                            Start Therapy
                          </div>
                          <div className="text-xs text-white/80">
                            Begin a new session
                          </div>
                        </div>
                      </div>
                      <div className="opacity-0 transition-opacity group-hover/button:opacity-100">
                        <CircleArrowRight className="h-5 w-5 text-white" />
                      </div>
                    </Button>
                    <div className="grid grid-cols-2 gap-3">
                      <Button
                        variant="outline"
                        className={cn(
                          "group/mood flex h-[120px] flex-col px-4 py-3 hover:border-primary/50",
                          "items-center justify-center text-center",
                          "transition-all duration-200 group-hover:translate-y-[-2px]"
                        )}
                        onClick={() => setShowMoodModal(true)}
                      >
                        <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-rose-500/10">
                          <Heart className="h-5 w-5 text-rose-500" />
                        </div>
                        <div>
                          <div className="text-sm font-medium">Track Mood</div>
                          <div className="mt-0.5 text-xs text-muted-foreground">
                            How are you feeling?
                          </div>
                        </div>
                      </Button>

                      <Button
                        variant="outline"
                        className={cn(
                          "group/ai flex h-[120px] flex-col px-4 py-3 hover:border-primary/50",
                          "items-center justify-center text-center",
                          "transition-all duration-200 group-hover:translate-y-[-2px]"
                        )}
                        onClick={handleAICheckIn}
                      >
                        <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-blue-500/10">
                          <BrainCircuit className="h-5 w-5 text-blue-500" />
                        </div>
                        <div>
                          <div className="text-sm font-medium">Check-in</div>
                          <div className="mt-0.5 text-xs text-muted-foreground">
                            Quick wellness check
                          </div>
                        </div>
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Wellness Stats Cards */}
            <Card className="border-primary/10">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="">
                    <CardTitle>Today's Overview</CardTitle>
                    <CardDescription>
                      Your wellness metrics for{" "}
                      {format(new Date(), "MMMM d, yyyy")}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  {wellnessStats.map((stat) => (
                    <div
                      key={stat.title}
                      className={cn(
                        "rounded-lg p-4 transition-all duration-200 hover:scale-[1.02]",
                        stat.bgColor
                      )}
                    >
                      <div className="flex items-center gap-2">
                        <stat.icon className={cn("h-5 w-5", stat.color)} />
                        <p className="text-sm font-medium">{stat.title}</p>
                      </div>
                      <p className="mt-2 text-2xl font-bold">{stat.value}</p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {stat.description}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Games Grid View */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="space-y-6 lg:col-span-3">
              <AnxietyGames />
            </div>
          </div>
        </div>
      </Container>

      {/* Mood Tracking Dialog */}
      {/* open - controls dialog visibility and onOpenChange - updates the state to open or close the dialog */}
      <Dialog open={showMoodModal} onOpenChange={setShowMoodModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>How are you feeling today?</DialogTitle>
            <DialogDescription>
              Move the slider to track your current mood!
            </DialogDescription>
          </DialogHeader>
          <MoodForm onSuccess={() => setShowMoodModal(false)} />
        </DialogContent>
      </Dialog>

      {/* Activity Log */}
      <ActivityLogger
        open={showActivityLogger}
        onOpenChange={setShowActivityLogger}
        onActivityLogged={() => {}}
      />
    </div>
  )
}
