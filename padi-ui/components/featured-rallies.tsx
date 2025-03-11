"use client"

import { RallyCard } from "@/components/rally-card"
import { ButtonWithAnimation } from "@/components/ui/button-with-animation"
import { FadeIn } from "@/components/ui/fade-in"
import Link from "next/link"
import { useRallies } from "@/context/rally-context"

export function FeaturedRallies() {
  const { rallies } = useRallies()

  // Get the 3 most recent rallies
  const featuredRallies = [...rallies]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 3)

  return (
    <section className="w-full py-12 md:py-24 bg-background">
      <div className="container px-4 md:px-6">
        <FadeIn className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="space-y-1">
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Featured Rallies</h2>
            <p className="text-muted-foreground">Support these trending funding campaigns</p>
          </div>
          <Link href="/rallies">
            <ButtonWithAnimation variant="outline">View All Rallies</ButtonWithAnimation>
          </Link>
        </FadeIn>
        <div className="grid gap-6 mt-8 md:grid-cols-2 lg:grid-cols-3">
          {featuredRallies.map((rally, index) => (
            <RallyCard key={rally.id} rally={rally} delay={index} />
          ))}
        </div>
      </div>
    </section>
  )
}

