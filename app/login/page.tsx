"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Container } from "@/components/ui/container"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Lock, Mail } from "lucide-react"
import { loginUser } from "@/lib/api/auth"
import { useSession } from "@/lib/contexts/session-context"


export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { checkSession } = useSession()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // setLoading(true)
    setError("")
    try {
      const response = await loginUser(email, password)

      // Store the token in localStorage
      localStorage.setItem("token", response.token);

      // Update session state
      await checkSession()

      // Wait for state to update before redirecting
      await new Promise((resolve) => setTimeout(resolve, 100))
      router.push("/dashboard")
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Invalid Email or Password! Please try again."
      )
    } finally {
      setLoading(false)
    }
    console.log("Submitting login form...");
    
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gradient-to-br from-primary/10 via-background to-secondary/30">
      <Container className="flex w-full flex-col items-center justify-center">
        <Card className="mt-12 w-full max-w-2xl rounded-3xl border border-primary/10 bg-card/90 p-8 shadow-2xl backdrop-blur-lg md:w-5/12 md:p-10">
          <div className="mb-6 text-center">
            <h1 className="mb-1 bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-2xl font-extrabold tracking-tight text-transparent md:text-3xl">
              Sign In
            </h1>
            <p className="text-base font-medium text-muted-foreground">
              Welcome back! Please sign in to continue your journey.
            </p>
          </div>

          {/* Login form */}
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-3">
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
                    className="bg-opacity-80 rounded-xl border border-primary bg-card py-2 pl-12 text-base text-black placeholder:text-muted-foreground focus:ring-2 focus:ring-primary focus:outline-none dark:text-white"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="mb-1 block text-base font-semibold"
                >
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    className="bg-opacity-80 rounded-xl border border-primary bg-card py-2 pl-12 text-base text-black placeholder:text-muted-foreground focus:ring-2 focus:ring-primary focus:outline-none dark:text-white"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>
            {error && (
              <p className="text-center text-base font-medium text-red-500">
                {error}
              </p>
            )}
            <Button
              className="w-full rounded-xl bg-gradient-to-r from-primary to-primary/80 py-2 text-base font-bold shadow-md hover:from-primary/80 hover:to-primary cursor-pointer"
              size="lg"
              type="submit"
              disabled={loading}
            >
              {loading ? "Signing In..." : "Sign In"}
            </Button>
          </form>

          <div className="my-6 border-t border-primary/10" />
          <div className="flex flex-col items-center gap-2">
            <div className="flex items-center justify-center gap-2 text-sm">
              <span className="text-muted-foreground">
                Don&apos;t have an account?
              </span>
              <Link
                href="/signup"
                className="font-semibold text-primary underline transition-colors hover:text-primary/80"
              >
                Sign up
              </Link>
              <span className="text-muted-foreground">·</span>
              <Link
                href="/forgot-password"
                className="text-primary underline transition-colors hover:text-primary/80"
              >
                Forgot password?
              </Link>
            </div>
          </div>
        </Card>
      </Container>
    </div>
  )
}
