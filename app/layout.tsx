import { Geist, Geist_Mono } from "next/font/google"

import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { cn } from "@/lib/utils";
import Header from "@/components/header";
import { Providers } from "@/components/providers";
import { Toaster } from "@/components/ui/sonner"
import { Footer } from "@/components/footer";

export const metadata = {
  title: "AI Therapist Agent",
  description: "Your personal AI therapist companion",
}

const geist = Geist({subsets:['latin'],variable:'--font-sans'})

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn("antialiased", fontMono.variable, "font-sans", geist.variable)}
    >
      <body>
        <Providers>
          <Header />
          <main className="pt-16">{children}</main>
          <Toaster />
          <Footer />
        </Providers>
      </body>
    </html>
  )
}
