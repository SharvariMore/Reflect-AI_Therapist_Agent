"use client"

import { useState, useEffect, useCallback } from "react"
import { motion } from "framer-motion"
import {
  Brain,
  Calendar,
  Activity,
  Sun,
  Moon,
  Heart,
  Trophy,
  Bell,
  AlertCircle,
  PhoneCall,
  Sparkles,
  MessageSquare,
  BrainCircuit,
  ArrowRight,
  X,
  Loader2,
  HeartPulse,
  ClipboardClock,
  Zap,
  Logs,
  RotateCw,
  RefreshCcw,
  CircleArrowRight,
  MessageSquareMore,
} from "lucide-react"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Container } from "@/components/ui/container"
import { cn } from "@/lib/utils"

import MoodForm from "@/components/mood/mood-form"
import { AnxietyGames } from "@/components/games/anxiety-games"

import {
  getUserActivities,
  saveMoodData,
  logActivity,
} from "@/lib/static-dashboard-data"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { useRouter, useSearchParams } from "next/navigation"
import {
  addDays,
  format,
  subDays,
  startOfDay,
  isWithinInterval,
} from "date-fns"

import ActivityLogger from "@/components/activities/activity-logger"
import { useSession } from "@/lib/contexts/session-context"
import { getAllChatSessions } from "@/lib/api/chat"
import { toast } from "sonner"

// Add this type definition
type ActivityLevel = "none" | "low" | "medium" | "high"

interface DayActivity {
  date: Date
  level: ActivityLevel
  activities: {
    type: string
    name: string
    completed: boolean
    time?: string
  }[]
}

// Add this interface near the top with other interfaces
interface Activity {
  id: string
  userId: string | null
  type: string
  name: string
  description: string | null
  timestamp: Date
  duration: number | null
  completed: boolean
  moodScore: number | null
  moodNote: string | null
  createdAt: Date
  updatedAt: Date
}

// Add this interface for stats
interface DailyStats {
  moodScore: number | null
  completionRate: number
  mindfulnessCount: number
  totalActivities: number
  lastUpdated: Date
}

// Update the calculateDailyStats function to show correct stats
const calculateDailyStats = (activities: Activity[]): DailyStats => {
  const today = startOfDay(new Date())
  const todaysActivities = activities.filter((activity) =>
    isWithinInterval(new Date(activity.timestamp), {
      start: today,
      end: addDays(today, 1),
    })
  )

  // Calculate mood score (average of today's mood entries) 
  const moodEntries = todaysActivities.filter(
    (a) => a.type === "mood" && a.moodScore !== null && a.moodScore !== undefined // check if mood score is very low
  )
  const latestMood =
    moodEntries.length > 0
      ? moodEntries.sort(
          (a, b) =>
            new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        )[0].moodScore
      : null

  // Count therapy sessions (all sessions ever)
  const therapySessions = activities.filter((a) => a.type === "therapy").length

  return {
    moodScore: latestMood ?? null,
    completionRate: 100, // Always 100% as requested
    mindfulnessCount: therapySessions, // Total number of therapy sessions
    totalActivities: todaysActivities.length,
    lastUpdated: new Date(),
  }
}

// Rename the function
const generateInsights = (activities: Activity[]) => {
  const insights: {
    title: string
    description: string
    icon: any
    priority: "low" | "medium" | "high"
  }[] = []

  // Get activities from last 7 days
  const lastWeek = subDays(new Date(), 7)
  const recentActivities = activities.filter(
    (a) => new Date(a.timestamp) >= lastWeek
  )

  // Analyze mood patterns
  const moodEntries = recentActivities.filter(
    (a) => a.type === "mood" && a.moodScore !== null
  )
  if (moodEntries.length >= 2) {
    const averageMood =
      moodEntries.reduce((acc, curr) => acc + (curr.moodScore || 0), 0) /
      moodEntries.length
    const latestMood = moodEntries[moodEntries.length - 1].moodScore || 0

    if (latestMood > averageMood) {
      insights.push({
        title: "Mood Improvement",
        description:
          "Your recent mood scores are above your weekly average. Keep up the good work!",
        icon: Brain,
        priority: "high",
      })
    } else if (latestMood < averageMood - 20) {
      insights.push({
        title: "Mood Change Detected",
        description:
          "I've noticed a dip in your mood. Would you like to try some mood-lifting activities?",
        icon: Heart,
        priority: "high",
      })
    }
  }

  // Analyze activity patterns
  const mindfulnessActivities = recentActivities.filter((a) =>
    ["game", "meditation", "breathing"].includes(a.type)
  )
  if (mindfulnessActivities.length > 0) {
    const dailyAverage = mindfulnessActivities.length / 7
    if (dailyAverage >= 1) {
      insights.push({
        title: "Consistent Practice",
        description: `You've been regularly engaging in mindfulness activities. This can help reduce stress and improve focus.`,
        icon: Trophy,
        priority: "medium",
      })
    } else {
      insights.push({
        title: "Mindfulness Opportunity",
        description:
          "Try incorporating more mindfulness activities into your daily routine.",
        icon: Sparkles,
        priority: "low",
      })
    }
  }

  // Check activity completion rate
  const completedActivities = recentActivities.filter((a) => a.completed)
  const completionRate =
    recentActivities.length > 0
      ? (completedActivities.length / recentActivities.length) * 100
      : 0

  if (completionRate >= 80) {
    insights.push({
      title: "High Achievement",
      description: `You've completed ${Math.round(
        completionRate
      )}% of your activities this week. Excellent commitment!`,
      icon: Trophy,
      priority: "high",
    })
  } else if (completionRate < 50) {
    insights.push({
      title: "Activity Reminder",
      description:
        "You might benefit from setting smaller, more achievable daily goals.",
      icon: Calendar,
      priority: "medium",
    })
  }

  // Time pattern analysis
  const morningActivities = recentActivities.filter(
    (a) => new Date(a.timestamp).getHours() < 12
  )
  const eveningActivities = recentActivities.filter(
    (a) => new Date(a.timestamp).getHours() >= 18
  )

  if (morningActivities.length > eveningActivities.length) {
    insights.push({
      title: "Morning Person",
      description:
        "You're most active in the mornings. Consider scheduling important tasks during your peak hours.",
      icon: Sun,
      priority: "medium",
    })
  } else if (eveningActivities.length > morningActivities.length) {
    insights.push({
      title: "Evening Routine",
      description:
        "You tend to be more active in the evenings. Make sure to wind down before bedtime.",
      icon: Moon,
      priority: "medium",
    })
  }

  // Sort insights by priority and return top 3
  return insights
    .sort((a, b) => {
      const priorityOrder = { high: 0, medium: 1, low: 2 }
      return priorityOrder[a.priority] - priorityOrder[b.priority]
    })
    .slice(0, 3)
}

export default function Dashboard() {
  const [mounted, setMounted] = useState(false)
  const [currentTime, setCurrentTime] = useState(new Date())
  const router = useRouter()
  const { user } = useSession()

  // Rename the state variable
  const [insights, setInsights] = useState<
    {
      title: string
      description: string
      icon: any
      priority: "low" | "medium" | "high"
    }[]
  >([])

  // New states for activities and wearables
  const [activities, setActivities] = useState<Activity[]>([])
  const [showMoodModal, setShowMoodModal] = useState(false)
  const [showCheckInChat, setShowCheckInChat] = useState(false)
  const [activityHistory, setActivityHistory] = useState<DayActivity[]>([])
  const [showActivityLogger, setShowActivityLogger] = useState(false)
  const [isSavingActivity, setIsSavingActivity] = useState(false)
  const [isSavingMood, setIsSavingMood] = useState(false)
  const [dailyStats, setDailyStats] = useState<DailyStats>({
    moodScore: null,
    completionRate: 100,
    mindfulnessCount: 0,
    totalActivities: 0,
    lastUpdated: new Date(),
  })

  // Add this function to transform activities into day activity format
  const transformActivitiesToDayActivity = (
    activities: Activity[]
  ): DayActivity[] => {
    const days: DayActivity[] = []
    const today = new Date()

    // Create array for last 28 days
    for (let i = 27; i >= 0; i--) {
      const date = startOfDay(subDays(today, i))
      const dayActivities = activities.filter((activity) =>
        isWithinInterval(new Date(activity.timestamp), {
          start: date,
          end: addDays(date, 1),
        })
      )

      // Determine activity level based on number of activities
      let level: ActivityLevel = "none"
      if (dayActivities.length > 0) {
        if (dayActivities.length <= 2) level = "low"
        else if (dayActivities.length <= 4) level = "medium"
        else level = "high"
      }

      days.push({
        date,
        level,
        activities: dayActivities.map((activity) => ({
          type: activity.type,
          name: activity.name,
          completed: activity.completed,
          time: format(new Date(activity.timestamp), "h:mm a"),
        })),
      })
    }

    return days
  }

  // Modify the loadActivities function to use a default user ID
  const loadActivities = useCallback(async () => {
    try {
      const userActivities = await getUserActivities("default-user")
      setActivities(userActivities)
      setActivityHistory(transformActivitiesToDayActivity(userActivities))
    } catch (error) {
      console.error("Error loading activities:", error)
    }
  }, [])

  useEffect(() => {
    setMounted(true)
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  // Add this effect to update stats when activities change
  useEffect(() => {
    if (activities.length > 0) {
      setDailyStats(calculateDailyStats(activities))
    }
  }, [activities])

  // Update the effect
  useEffect(() => {
    if (activities.length > 0) {
      setInsights(generateInsights(activities))
    }
  }, [activities])

  const fetchDailyStats = useCallback(async () => {
    try {
      const sessions = await getAllChatSessions()

      const today = startOfDay(new Date())
      const todaysActivities = activities.filter((activity) =>
        isWithinInterval(new Date(activity.timestamp), {
          start: today,
          end: addDays(today, 1),
        })
      )

      const moodEntries = todaysActivities.filter(
        (a: Activity) => a.type === "mood" && a.moodScore !== null
      )

      // const averageMood =
      //   moodEntries.length > 0
      //     ? Math.round(
      //         moodEntries.reduce(
      //           (acc: number, curr: Activity) => acc + (curr.moodScore || 0),
      //           0
      //         ) / moodEntries.length
      //       )
      //     : null

      const latestMood =
        moodEntries.length > 0
          ? moodEntries.sort(
              (a, b) =>
                new Date(b.timestamp).getTime() -
                new Date(a.timestamp).getTime()
            )[0].moodScore
          : null

      setDailyStats({
        moodScore: latestMood ?? null,
        completionRate: 100,
        mindfulnessCount: sessions.length,
        totalActivities: todaysActivities.length,
        lastUpdated: new Date(),
      })
    } catch (error) {
      console.error("Error fetching daily stats:", error)
    }
  }, [activities])

  // Fetch stats on mount and every 5 minutes
  // useEffect(() => {
  //   fetchDailyStats();
  //   const interval = setInterval(fetchDailyStats, 5 * 60 * 1000);
  //   return () => clearInterval(interval);
  // }, [fetchDailyStats]);
  useEffect(() => {
    if (activities.length > 0) {
      setDailyStats(calculateDailyStats(activities))
    }
  }, [activities])

  // Update wellness stats to reflect the changes
  const wellnessStats = [
    {
      title: "Mood Score",
      value:
        dailyStats?.moodScore !== null && dailyStats?.moodScore !== undefined
          ? `${dailyStats.moodScore}%`
          : "No data",
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
      value: `${dailyStats.mindfulnessCount} sessions`,
      icon: ClipboardClock,
      color: "text-rose-500",
      bgColor: "bg-rose-500/10",
      description: "Total sessions completed",
    },
    {
      title: "Total Activities",
      value: dailyStats.totalActivities.toString(),
      icon: Activity,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
      description: "Planned for today",
    },
  ]

  // Load activities on mount
  useEffect(() => {
    loadActivities()
  }, [loadActivities])

  // Add these action handlers
  const handleStartTherapy = () => {
    router.push("/therapy/new")
  }

  const handleMoodSubmit = async (moodScore: number) => {
    setIsSavingMood(true)
    try {
      await saveMoodData({
        userId: "default-user",
        mood: moodScore,
        note: "",
      })
      setShowMoodModal(false)
      await loadActivities()
    } catch (error) {
      console.error("Error saving mood:", error)
      toast.error("Error Saving Mood!", {
        description:
          error instanceof Error ? error.message : "Error saving mood",
      })
    } finally {
      setIsSavingMood(false)
    }
  }

  const handleAICheckIn = () => {
    setShowActivityLogger(true)
  }

  // Add handler for game activities
  const handleGamePlayed = useCallback(
    async (gameName: string, description: string) => {
      try {
        await logActivity({
          userId: "default-user",
          type: "game",
          name: gameName,
          description: description,
          duration: 0,
        })

        // Refresh activities after logging
        loadActivities()
      } catch (error) {
        console.error("Error logging game activity:", error)
      }
    },
    [loadActivities]
  )

  // Simple loading state
  if (!mounted) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Container className="space-y-6 pt-20 pb-8">
        {/* Header Section */}
        <div className="flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-2"
          >
            <h1 className="text-3xl font-bold text-foreground">
              Welcome back, {user?.name || "there"}
            </h1>
            <p className="text-muted-foreground">
              {currentTime.toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
              })}
            </p>
          </motion.div>
          {/* <div className="flex items-center gap-4">
            <Button variant="outline" size="icon">
              <Bell className="h-5 w-5" />
            </Button>
          </div> */}
        </div>

        {/* Main Grid Layout */}
        <div className="space-y-6">
          {/* Top Cards Grid */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {/* Quick Actions Card */}
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
                      <div className="cursor-pointer opacity-0 transition-opacity group-hover/button:opacity-100">
                        <CircleArrowRight className="h-5 w-5 text-white" />
                      </div>
                    </Button>

                    <div className="grid grid-cols-2 gap-3">
                      <Button
                        variant="outline"
                        className={cn(
                          "group/mood flex h-[120px] flex-col px-4 py-3 hover:border-primary/50",
                          "items-center justify-center text-center",
                          "cursor-pointer transition-all duration-200 group-hover:translate-y-[-2px]"
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
                          "cursor-pointer transition-all duration-200 group-hover:translate-y-[-2px]"
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

            {/* Today's Overview Card */}
            <Card className="border-primary/10">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Today's Overview</CardTitle>
                    <CardDescription>
                      Your wellness metrics for{" "}
                      {format(new Date(), "MMMM d, yyyy")}
                    </CardDescription>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={fetchDailyStats}
                    className="h-8 w-8"
                  >
                    <RotateCw className="h-4 w-4 cursor-pointer" />
                    {/* <span className="sr-only">Refresh</span> */}
                  </Button>
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
                <div className="mt-4 text-right text-xs text-muted-foreground">
                  Last updated: {format(dailyStats.lastUpdated, "h:mm a")}
                </div>
              </CardContent>
            </Card>

            {/* Insights Card */}
            <Card className="border-primary/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Logs className="h-5 w-5 text-primary" />
                  Insights
                </CardTitle>
                <CardDescription>
                  Personalized recommendations based on your activity patterns
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {insights.length > 0 ? (
                    insights.map((insight, index) => (
                      <div
                        key={index}
                        className={cn(
                          "space-y-2 rounded-lg p-4 transition-all hover:scale-[1.02]",
                          insight.priority === "high"
                            ? "bg-primary/10"
                            : insight.priority === "medium"
                              ? "bg-primary/5"
                              : "bg-muted"
                        )}
                      >
                        <div className="flex items-center gap-2">
                          <insight.icon className="h-5 w-5 text-primary" />
                          <p className="font-medium">{insight.title}</p>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {insight.description}
                        </p>
                      </div>
                    ))
                  ) : (
                    <div className="py-8 text-center text-muted-foreground">
                      <Activity className="mx-auto mb-3 h-8 w-8 opacity-50" />
                      <p>
                        Complete more activities to receive personalized
                        insights
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Content Grid */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Left side - Spans 2 columns */}
            <div className="space-y-6 lg:col-span-3">
              {/* Anxiety Games - Now directly below Fitbit */}
              <AnxietyGames onGamePlayed={handleGamePlayed} />
            </div>
          </div>
        </div>
      </Container>

      {/* Mood tracking modal */}
      <Dialog open={showMoodModal} onOpenChange={setShowMoodModal}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>How are you feeling?</DialogTitle>
            <DialogDescription>
              Move the slider to track your current mood
            </DialogDescription>
          </DialogHeader>
          <MoodForm onSuccess={handleMoodSubmit} />
        </DialogContent>
      </Dialog>

      {/* AI check-in chat */}
      {showCheckInChat && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm">
          <div className="fixed inset-y-0 right-0 w-full max-w-sm border-l bg-background shadow-lg">
            <div className="flex h-full flex-col">
              <div className="flex items-center justify-between border-b px-4 py-3">
                <h3 className="font-semibold">AI Check-in</h3>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowCheckInChat(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex-1 overflow-y-auto p-4"></div>
            </div>
          </div>
        </div>
      )}

      <ActivityLogger
        open={showActivityLogger}
        onOpenChange={setShowActivityLogger}
        onActivityLogged={loadActivities}
      />
    </div>
  )
}
