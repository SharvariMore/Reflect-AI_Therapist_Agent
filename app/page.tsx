"use client"

import { Button } from "@/components/ui/button"
import { Ripple } from "@/components/ui/ripple"
import { useEffect, useState } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import {
  Waves,
  ArrowRight,
  HeartPulse,
  Lightbulb,
  MessageSquareHeart,
  Lock,
  HandHeart,
  FingerprintPattern,
  ShieldPlus,
  CircleArrowRight,
  Stethoscope,
  Shield,
  HeartHandshake,
  Sparkles,
  ChevronsRight,
  Heart,
  AudioLines,
  ShieldUser,
} from "lucide-react"
import { Slider } from "@/components/ui/slider"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import Link from "next/link"
import React from "react"

export default function Page() {
  /* value represents the intensity of the emotion */
  const emotions = [
    { value: 0, label: "😔 Sad", color: "from-blue-500/50" },
    { value: 25, label: "😊 Content", color: "from-green-500/50" },
    { value: 50, label: "😌 Peaceful", color: "from-purple-500/50" },
    { value: 75, label: "🤗 Happy", color: "from-yellow-500/50" },
    { value: 100, label: "🥳 Excited", color: "from-pink-500/50" },
  ]

  const features = [
    {
      icon: HandHeart,
      title: "24/7 Support",
      description:
        "Always-on AI that listens, adapts, and supports you in real time.",
      color: "from-rose-500/20",
      delay: 0.2,
    },
    {
      icon: Lightbulb,
      title: "Smart Insights",
      description:
        "AI-driven insights that evolve with your emotional patterns.",
      color: "from-amber-500/20",
      delay: 0.4,
    },
    {
      icon: ShieldPlus,
      title: "Private & Secure",
      description:
        "Encrypted end-to-end, with confidentiality built in design.",
      color: "from-emerald-500/20",
      delay: 0.6,
    },
    {
      icon: FingerprintPattern,
      title: "Evidence-Based",
      description: "Clinically grounded techniques enhanced by intelligent AI.",
      color: "from-blue-500/20",
      delay: 0.8,
    },
  ]

  const welcomeSteps = [
    {
      title: "Hi, I'm Reflect 👋",
      description:
        "Your AI companion for emotional well-being. Here to listen without judgment and hold space for whatever you’re feeling.",
      icon: AudioLines,
    },
    {
      title: "Personalized Support 💟",
      description:
        "I tune into your emotions and adapt in real time, offering thoughtful insights and gentle guidance tailored just for you.",
      icon: HeartHandshake,
    },
    {
      title: "Your Privacy Matters 🛡️",
      description:
        "Everything you share stays between us. Protected, encrypted, and handled with the highest respect for your boundaries.",
      icon: ShieldUser,
    },
  ]

  const [emotion, setEmotion] = useState(50)
  const [mounted, setMounted] = useState(false) // trigger animation only after the component is loaded
  const [showDialog, setShowDialog] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)

  useEffect(() => {
    setMounted(true) // control animations
  }, [])

  const currentEmotion = emotions.find(
    (em) => Math.abs(emotion - em.value) < 15 || emotions[2]
  ) // find the emotion that is closest to the current emotion by comapring slider value and emotion value

  return (
    <div className="flex min-h-screen flex-col overflow-hidden">
      {/* Hero content section */}
      <section className="relative mt-20 flex min-h-[90vh] flex-col items-center justify-center px-4 py-12">
        {/* Glowing background effect */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          {/* Blurred circular gradient at top-left which changes color based on selected emotion */}
          <div
            className={`absolute top-0 -left-20 h-[500px] w-[500px] rounded-full bg-gradient-to-r blur-3xl transition-all duration-700 ease-in-out ${currentEmotion?.color} to-transparent opacity-60`}
          />

          {/* Floating background visuals */}
          <div className="absolute right-0 bottom-0 h-[400px] w-[400px] animate-pulse rounded-full bg-secondary/10 blur-3xl delay-700" />

          {/* Subtle blurred overlay on top of the background for soft seperation */}
          <div className="absolute inset-0 bg-background/80 backdrop-blur-3xl" />
        </div>

        <Ripple className="opacity-60" />

        <motion.div
          className="mx-auto w-full max-w-[600px] space-y-6 py-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: mounted ? 1 : 0, y: mounted ? 0 : 20 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          {/* Enhanced badge with subtle animation */}
          <div className="relative space-y-8 text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm backdrop-blur-sm transition-all duration-300 hover:border-primary/40">
              <Stethoscope className="animate-wave h-4 w-4 text-primary" />
              <span className="relative text-foreground/90 after:absolute after:bottom-0 after:left-0 after:h-[1px] after:w-full after:scale-x-0 after:bg-primary/30 after:transition-transform after:duration-300 after:content-[''] hover:after:scale-x-100 dark:text-foreground">
                Your AI Agent Mental Health Companion
              </span>
            </div>

            {/* Enhanced main heading with smoother gradient */}
            <h1 className="font-plus-jakarta text-4xl font-bold tracking-tight md:text-6xl lg:text-7xl">
              <span className="inline-block bg-gradient-to-r from-primary via-primary/90 to-secondary bg-clip-text text-transparent transition-all duration-300 [text-shadow:_0_1px_0_rgb(0_0_0_/_20%)] hover:to-primary">
                Find Peace
              </span>
              <br />
              <span className="mt-2 inline-block bg-gradient-to-b from-foreground to-foreground/90 bg-clip-text text-transparent">
                of Mind
              </span>
            </h1>

            {/* Enhanced description with better readability */}
            <p className="mx-auto max-w-[600px] text-base leading-relaxed tracking-wide text-muted-foreground md:text-lg">
              Step into a new era of emotional well-being. Powered by AI that
              listens deeply, adapts to you, and guides you forward.
            </p>
          </div>

          {/* Emotion slider section with enhanced transitions */}
          <motion.div
            className="mx-auto w-full max-w-[600px] space-y-6 py-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: mounted ? 1 : 0, y: mounted ? 0 : 20 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            <div className="space-y-2 text-center">
              <p className="text-sm font-medium text-muted-foreground/80">
                Whatever you're feeling, we're here to listen
              </p>
              <div className="flex items-center justify-between px-2">
                {emotions.map((em) => (
                  <div
                    key={em.value}
                    className={`cursor-pointer transition-all duration-500 ease-out hover:scale-105 ${
                      Math.abs(emotion - em.value) < 15
                        ? "scale-110 transform-gpu opacity-100"
                        : "scale-100 opacity-50"
                    }`}
                    onClick={() => setEmotion(em.value)}
                  >
                    <div className="transform-gpu text-2xl">
                      {em.label.split(" ")[0]}
                    </div>
                    <div className="mt-1 text-xs font-medium text-muted-foreground">
                      {em.label.split(" ")[1]}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Slider to control the emotion intensity */}
            <div className="relative px-2">
              <div
                className={`absolute inset-0 bg-gradient-to-r ${currentEmotion?.color} -z-10 to-transparent blur-2xl transition-all duration-500`}
              />
              <Slider
                value={[emotion]}
                onValueChange={(value) => setEmotion(value[0])}
                min={0}
                max={100}
                step={1}
                className="py-4"
              />
            </div>

            <div className="text-center">
              <p className="animate-pulse text-sm text-muted-foreground">
                Slide to express how you're feeling today!
              </p>
            </div>
          </motion.div>

          {/* CTA button and welcome dialog */}
          <motion.div
            className="flex flex-col items-center justify-center gap-4 sm:flex-row"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: mounted ? 1 : 0, y: mounted ? 0 : 20 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            <Button
              size="lg"
              onClick={() => setShowDialog(true)}
              className="group relative h-12 cursor-pointer rounded-full bg-gradient-to-r from-primary via-primary/90 to-secondary px-8 shadow-lg shadow-primary/20 transition-all duration-500 hover:to-primary hover:shadow-xl hover:shadow-primary/30"
            >
              <span className="relative z-10 flex items-center gap-2 font-bold text-[#334155]">
                Begin Your Journey
                <CircleArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </span>
              <div className="bg-size-200 bg-pos-0 group-hover:bg-pos-100 absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
            </Button>
          </motion.div>
        </motion.div>
      </section>

      {/* Features section */}
      <section className="relative overflow-hidden px-4 py-20">
        <div className="mx-auto max-w-6xl">
          <motion.div className="mb-16 space-y-4 text-center text-white">
            <h2 className="bg-gradient-to-r from-primary/90 to-primary bg-clip-text text-3xl font-bold text-transparent dark:text-primary/90">
              How Reflect Helps You?
            </h2>
            <p className="mx-auto max-w-2xl text-lg font-medium text-foreground dark:text-foreground/95">
              Experience a new kind of emotional support, powered by empathetic
              AI
            </p>
          </motion.div>

          <div className="relative grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: feature.delay, duration: 0.5 }}
                viewport={{ once: true }}
              >
                <Card className="group relative h-[200px] overflow-hidden border border-primary/10 bg-card/30 backdrop-blur-sm transition-all duration-300 hover:border-primary/20 dark:bg-card/80">
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${feature.color} to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-20 dark:group-hover:opacity-30`}
                  />
                  <CardHeader className="pb-4">
                    <div className="flex items-center gap-3">
                      <div className="rounded-xl bg-primary/10 p-2 transition-colors duration-300 group-hover:bg-primary/20 dark:bg-primary/20 dark:group-hover:bg-primary/30">
                        <feature.icon className="h-5 w-5 text-primary dark:text-primary/90" />
                      </div>
                      <h3 className="font-semibold tracking-tight text-foreground/90 dark:text-foreground">
                        {feature.title}
                      </h3>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm leading-relaxed text-muted-foreground/90 dark:text-muted-foreground">
                      {feature.description}
                    </p>
                  </CardContent>
                  <div className="absolute right-0 bottom-0 left-0 h-[2px] bg-gradient-to-r from-transparent via-primary/20 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100 dark:via-primary/30" />
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Welcome dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="bg-card/80 backdrop-blur-lg sm:max-w-[425px]">
          <DialogHeader>
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                {welcomeSteps[currentStep] && (
                  <div>
                    {React.createElement(welcomeSteps[currentStep].icon, {
                      className: "w-8 h-8 text-primary",
                    })}
                  </div>
                )}
              </div>
              <DialogTitle className="text-center text-2xl">
                {welcomeSteps[currentStep]?.title}
              </DialogTitle>
              <DialogDescription className="text-center text-base leading-relaxed">
                {welcomeSteps[currentStep]?.description}
              </DialogDescription>
            </motion.div>
          </DialogHeader>
          <div className="mt-8 flex items-center justify-between">
            <div className="flex gap-2">
              {welcomeSteps.map((_, index) => (
                <div
                  key={index}
                  className={`h-2 w-2 rounded-full transition-all duration-300 ${
                    index === currentStep ? "w-4 bg-primary" : "bg-primary/20"
                  }`}
                />
              ))}
            </div>
            <Button
              onClick={() => {
                if (currentStep < welcomeSteps.length - 1) {
                  setCurrentStep((c) => c + 1)
                } else {
                  setShowDialog(false)
                  setCurrentStep(0)
                  // Here you would navigate to the chat interface
                }
              }}
              className="group relative cursor-pointer px-6"
            >
              <span className="flex items-center gap-2">
                {currentStep === welcomeSteps.length - 1 ? (
                  <>
                    Let's Begin
                    <Heart className="h-4 w-4 animate-pulse" />
                  </>
                ) : (
                  <>
                    Next
                    <ChevronsRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </>
                )}
              </span>
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
