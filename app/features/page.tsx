"use client"

import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import {
  Brain,
  Shield,
  Fingerprint,
  Activity,
  Bot,
  LineChart,
  Wifi,
  Heart,
  ShieldCheck,
  HeartPlus,
  Lock,
  Route,
} from "lucide-react"

const features = [
  {
    icon: <Bot className="h-10 w-10 text-primary" />,
    title: "AI-Powered Therapy",
    description:
      "24/7 access to adaptive AI agents delivering empathetic, personalized mental health support.",
  },
  {
    icon: <Lock className="h-10 w-10 text-primary" />,
    title: "Blockchain Security",
    description:
      "Blockchain secures every interaction, ensuring immutable records and verifiable privacy at every step.",
  },
  {
    icon: <Brain className="h-10 w-10 text-primary" />,
    title: "Smart Analysis",
    description:
      "Advanced NLP and emotional modeling to deeply interpret your state and guide meaningful interventions.",
  },
  {
    icon: <Activity className="h-10 w-10 text-primary" />,
    title: "Crisis Detection",
    description:
      "Continuously monitors signals to identify critical moments early triggering intelligent, safety-first responses.",
  },
  {
    icon: <Wifi className="h-10 w-10 text-primary" />,
    title: "IoT Integration",
    description:
      "Seamlessly integrates with smart environments to create a calming, adaptive therapeutic space around you.",
  },
  {
    icon: <LineChart className="h-10 w-10 text-primary" />,
    title: "Progress Tracking",
    description:
      "Transform your journey into actionable insights with AI-driven analytics and blockchain-verified continuity.",
  },
  {
    icon: <ShieldCheck className="h-10 w-10 text-primary" />,
    title: "Privacy First",
    description:
      "Built on end-to-end encryption and zero-knowledge principles where your data remains yours, always.",
  },
  {
    icon: <HeartPlus className="h-10 w-10 text-primary" />,
    title: "Holistic Care",
    description:
      "Unifies data from wearables and health systems to deliver a truly holistic and continuous care experience.",
  },
]

export default function FeaturesPage() {
  return (
    <div className="container mx-auto px-4 py-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-16 text-center"
      >
        <h1 className="mb-6 bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-4xl font-bold text-transparent">
          Platform Features
        </h1>
        <p className="mx-auto max-w-2xl text-xl text-muted-foreground">
          Step into the future of mental health care powered by adaptive AI and
          protected by privacy-first design.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {features.map((feature, index) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card className="h-full bg-card/50 p-6 backdrop-blur transition-shadow duration-300 hover:shadow-lg supports-[backdrop-filter]:bg-background/60">
              <div className="mb-4">{feature.icon}</div>
              <h3 className="mb-2 text-xl font-semibold">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </Card>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.8 }}
        className="mt-16 text-center"
      >
        <h2 className="mb-4 text-2xl font-semibold">Ready to Get Started?</h2>
        <p className="mb-8 text-muted-foreground">
          Join thousands of users benefiting from AI-powered mental health
          support.
        </p>
        <a
          href="/dashboard"
          className="inline-flex items-center rounded-lg bg-primary px-6 py-3 text-primary-foreground transition-colors hover:bg-primary/90 font-semibold"
        >
          Start Your Journey
          <Route className="ml-2 h-5 w-5" />
        </a>
      </motion.div>
    </div>
  )
}
