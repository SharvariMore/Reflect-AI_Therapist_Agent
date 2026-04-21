"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Container } from "@/components/ui/container"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { Mail } from "lucide-react"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    // TODO: Call backend to send reset email
    setTimeout(() => {
      setSubmitted(true)
      setLoading(false)
    }, 1200)
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gradient-to-br from-primary/10 via-background to-secondary/30">
      <Container className="flex w-full flex-col items-center justify-center">
        <Card className="mt-20 w-full max-w-2xl rounded-3xl border border-primary/10 bg-card/90 p-8 shadow-2xl backdrop-blur-lg md:w-5/12 md:p-10">
          <div className="mb-6 text-center">
            <h1 className="mb-1 bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-2xl font-extrabold tracking-tight text-transparent md:text-3xl">
              Forgot Password
            </h1>
            <p className="text-base font-medium text-muted-foreground">
              Enter your email to receive a password reset link.
            </p>
          </div>
          {submitted ? (
            <div className="py-8 text-center">
              <p className="mb-2 text-lg font-semibold text-primary">
                Check Your Email!
              </p>
              <p className="text-muted-foreground">
                If an account exists, a reset link has been sent.
              </p>
            </div>
          ) : (
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label
                  htmlFor="email"
                  className="mb-1 block text-base font-semibold"
                >
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    className="bg-opacity-80 rounded-xl border border-primary bg-card py-2 pl-12 text-base text-white placeholder:text-muted-foreground focus:ring-2 focus:ring-primary focus:outline-none"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>
              <Button
                className="w-full rounded-xl bg-gradient-to-r from-primary to-primary/80 py-2 text-base font-bold shadow-md hover:from-primary/80 hover:to-primary"
                size="lg"
                type="submit"
                disabled={loading}
              >
                {loading ? "Sending..." : "Send Reset Link"}
              </Button>
            </form>
          )}
          <div className="my-6 border-t border-primary/10" />
          <p className="text-center text-base text-muted-foreground">
            Remembered Your Password?{" "}
            <Link
              href="/login"
              className="font-semibold text-primary underline transition-colors hover:text-primary/80"
            >
              Sign In
            </Link>
          </p>
        </Card>
      </Container>
    </div>
  )
}
