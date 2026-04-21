"use client"

import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Heart, Target, Sparkles, Rocket, Gem } from "lucide-react"

const missions = [
  {
    icon: <Rocket className="h-8 w-8 text-primary" />,
    title: "Our Mission",
    description:
      "Deliver intelligent mental health support through AI, secured by blockchain for universal access and trust.",
  },
  {
    icon: <Target className="h-8 w-8 text-primary" />,
    title: "Our Vision",
    description:
      "A world where mental health support is proactive, personalized, and securely woven into your everyday life.",
  },
  {
    icon: <Gem className="h-8 w-8 text-primary" />,
    title: "Our Values",
    description:
      "Empathy, Innovation, Privacy, and Trust define everything we build guiding every experience from design to delivery.",
  },
]

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-24">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-20 text-center"
      >
        <h1 className="mb-6 bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-4xl font-bold text-transparent">
          About Reflect 2.0
        </h1>
        <p className="mx-auto max-w-3xl text-xl text-muted-foreground">
          We’re redefining mental health care by fusing advanced AI intelligence
          with the trust and transparency of blockchain.
        </p>
      </motion.div>

      {/* Mission Cards */}
      <div className="mb-20 grid grid-cols-1 gap-8 md:grid-cols-3">
        {missions.map((mission, index) => (
          <motion.div
            key={mission.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card className="h-full bg-card/50 p-6 text-center backdrop-blur supports-[backdrop-filter]:bg-background/60">
              <div className="mb-4 flex justify-center">{mission.icon}</div>
              <h3 className="mb-3 text-xl font-semibold">{mission.title}</h3>
              <p className="text-muted-foreground">{mission.description}</p>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
