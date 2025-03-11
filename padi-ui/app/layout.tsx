import type React from "react"
import { SiteHeader } from "@/components/site-header"
import { ThemeProvider } from "@/components/theme-provider"
import { RallyProvider } from "@/context/rally-context"
import "@/app/globals.css"
import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Padi - Crypto Fundraising Platform",
  description: "Launch funding rallies and support projects with tokens on the Neutron blockchain",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-background font-sans antialiased">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <RallyProvider>
            <div className="relative flex min-h-screen flex-col">
              <SiteHeader />
              <div className="flex-1">{children}</div>
              <footer className="border-t py-6 md:py-0">
                <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
                  <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
                    © 2024 Padi. All rights reserved.
                  </p>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <Link href="/terms">Terms</Link>
                    <Link href="/privacy">Privacy</Link>
                    <Link href="/contact">Contact</Link>
                  </div>
                </div>
              </footer>
            </div>
          </RallyProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}



import './globals.css'