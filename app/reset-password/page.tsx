"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Container } from "@/components/ui/container"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { Lock } from "lucide-react"

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    if (password !== confirmPassword) {
      setError("Passwords Don't match!")
      return
    }
    setLoading(true)
    // TODO: Call backend to reset password
    setTimeout(() => {
      setSuccess(true)
      setLoading(false)
    }, 1200)
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gradient-to-br from-primary/10 via-background to-secondary/30">
      <Container className="flex w-full flex-col items-center justify-center">
        <Card className="mt-20 w-full max-w-2xl rounded-3xl border border-primary/10 bg-card/90 p-8 shadow-2xl backdrop-blur-lg md:w-5/12 md:p-10">
          <div className="mb-6 text-center">
            <h1 className="mb-1 bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-2xl font-extrabold tracking-tight text-transparent md:text-3xl">
              Reset Password
            </h1>
            <p className="text-base font-medium text-muted-foreground">
              Enter your new password below.
            </p>
          </div>
          {success ? (
            <div className="py-8 text-center">
              <p className="mb-2 text-lg font-semibold text-primary">
                Password Reset Successful!
              </p>
              <Link
                href="/login"
                className="font-semibold text-primary underline transition-colors hover:text-primary/80"
              >
                Sign In
              </Link>
            </div>
          ) : (
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label
                  htmlFor="password"
                  className="mb-1 block text-base font-semibold"
                >
                  New Password
                </label>
                <div className="relative">
                  <Lock className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter new password"
                    className="bg-opacity-80 rounded-xl border border-primary bg-card py-2 pl-12 text-base text-white placeholder:text-muted-foreground focus:ring-2 focus:ring-primary focus:outline-none"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="mb-1 block text-base font-semibold"
                >
                  Confirm New Password
                </label>
                <div className="relative">
                  <Lock className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirm new password"
                    className="bg-opacity-80 rounded-xl border border-primary bg-card py-2 pl-12 text-base text-white placeholder:text-muted-foreground focus:ring-2 focus:ring-primary focus:outline-none"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
              </div>
              {error && (
                <p className="text-center text-base font-medium text-red-500">
                  {error}
                </p>
              )}
              <Button
                className="w-full rounded-xl bg-gradient-to-r from-primary to-primary/80 py-2 text-base font-bold shadow-md hover:from-primary/80 hover:to-primary"
                size="lg"
                type="submit"
                disabled={loading}
              >
                {loading ? "Resetting..." : "Reset Password"}
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
