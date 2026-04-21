"use client"

import Link from "next/link"
import { useState } from "react"
import { AudioLines, LogOut, Menu, MessageCircle, MessageCircleHeart, MessageCircleMore, X } from "lucide-react"
import ThemeToggle from "./theme-toggle"
import SignInButton from "./auth/sign-in-button"
import { Button } from "./ui/button"
import { useSession } from "@/lib/contexts/session-context"

export default function Header() {
  const navItems = [
    { href: "/features", label: "Features" },
    { href: "/about", label: "About Reflect" },
  ]

  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { isAuthenticated, logout, user } = useSession()

  console.log("Header: Auth state:", { isAuthenticated, user });

  return (
    <header className="fixed top-0 right-0 left-0 z-50 border-b border-primary/10 bg-background/95 backdrop-blur-md supports-[backdrop-filter]:bg-background/80">
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex h-16 items-center justify-between">
          <Link
            href="/"
            className="flex items-center space-x-2 transition-opacity hover:opacity-80"
          >
            <AudioLines className="animate-pulse-gentle h-7 w-7 text-primary" />
            <div className="flex flex-col">
              <span className="bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-lg font-semibold text-transparent">
                Reflect 2.0
              </span>
              <span className="text-xs text-muted-foreground">
                Your mental health companion
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-4">
            <nav className="hidden items-center space-x-1 md:flex">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="group relative px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                >
                  {item.label}
                  <span className="absolute bottom-0 left-0 h-0.5 w-full origin-left scale-x-0 bg-primary transition-transform duration-200 group-hover:scale-x-100" />
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-3">
              <ThemeToggle />

              {isAuthenticated ? (
                <>
                  <Button
                    asChild
                    className="hidden gap-2 bg-primary/90 hover:bg-primary md:flex"
                  >
                    <Link href="/dashboard">
                      <MessageCircleMore className="mr-1 h-4 w-4" />
                      Start Chat
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    onClick={logout}
                    className="text-muted-foreground transition-colors hover:text-foreground"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign out
                  </Button>
                </>
              ) : (
                <SignInButton className="font-semibold text-[#334155]" />
              )}

              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </Button>
            </div>
          </div>
        </div>

        {isMenuOpen && (
          <div className="border-t border-primary/10 md:hidden">
            <nav className="flex flex-col space-y-1 py-4">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-md px-4 py-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-primary/5 hover:text-foreground"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
