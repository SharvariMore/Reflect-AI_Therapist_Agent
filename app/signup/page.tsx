"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Container } from "@/components/ui/container"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Lock, Mail, User } from "lucide-react"
import { registerUser } from "@/lib/api/auth"

export default function LoginPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // setLoading(true)
    setError("")
    if (password !== confirmPassword) {
      setError("Passwords Don't Match!")
      return
    }
    setLoading(true)
    try {
      await registerUser(name, email, password)
      router.push("/login")
    } catch (error: any) {
      setError(error.message || "Something Went Wrong! Please Try Again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gradient-to-br from-primary/10 via-background to-secondary/30">
      <Container className="flex w-full flex-col items-center justify-center">
        <Card className="mt-12 w-full max-w-2xl rounded-3xl border border-primary/10 bg-card/90 p-8 shadow-2xl backdrop-blur-lg md:w-5/12 md:p-10">
          <div className="mb-6 text-center">
            <h1 className="mb-1 bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-2xl font-extrabold tracking-tight text-transparent md:text-3xl">
              Sign Up
            </h1>
            <p className="text-base font-medium text-muted-foreground">
              Create your account to start your journey with Reflect.
            </p>
          </div>

          {/* Login form */}
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-3">
              <div className="flex flex-col gap-4 md:flex-row">
                <div className="flex-1">
                  <label
                    htmlFor="name"
                    className="mb-1 block text-base font-semibold"
                  >
                    Name
                  </label>
                  <div className="relative">
                    <User className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="name"
                      type="text"
                      placeholder="Enter your name"
                      className="bg-opacity-80 rounded-xl border border-primary bg-card py-2 pl-12 text-base text-black placeholder:text-muted-foreground focus:ring-2 focus:ring-primary focus:outline-none dark:text-white"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="flex-1">
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
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="mb-1 block text-base font-semibold"
                >
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirm your password"
                    className="bg-opacity-80 rounded-xl border border-primary bg-card py-2 pl-12 text-base text-black placeholder:text-muted-foreground focus:ring-2 focus:ring-primary focus:outline-none dark:text-white"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
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
              className="w-full cursor-pointer rounded-xl bg-gradient-to-r from-primary to-primary/80 py-2 text-base font-bold shadow-md hover:from-primary/80 hover:to-primary"
              size="lg"
              type="submit"
              disabled={loading}
            >
              {loading ? "Signing Up..." : "Sign Up"}
            </Button>
          </form>

          <div className="my-6 border-t border-primary/10" />
          <p className="text-center text-base text-muted-foreground">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-semibold text-primary underline transition-colors hover:text-primary/80"
            >
              Sign in
            </Link>
          </p>
        </Card>
      </Container>
    </div>
  )
}
