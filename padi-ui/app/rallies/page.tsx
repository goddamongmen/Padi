"use client"

import { ButtonWithAnimation } from "@/components/ui/button-with-animation"
import { Input } from "@/components/ui/input"
import { RallyCard } from "@/components/rally-card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search } from "lucide-react"
import { useState } from "react"
import { useRallies } from "@/context/rally-context"
import { FadeIn } from "@/components/ui/fade-in"
import { motion, AnimatePresence } from "framer-motion"

export default function RalliesPage() {
  const { rallies } = useRallies()
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("newest")
  const [visibleCount, setVisibleCount] = useState(6)

  // Filter rallies based on search term
  const filteredRallies = rallies.filter(
    (rally) =>
      rally.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rally.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Sort rallies based on selected option
  const sortedRallies = [...filteredRallies].sort((a, b) => {
    switch (sortBy) {
      case "newest":
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      case "popular":
        return b.raised - a.raised
      case "ending-soon":
        return a.daysLeft - b.daysLeft
      case "most-funded":
        return b.raised / b.goal - a.raised / a.goal
      default:
        return 0
    }
  })

  // Get visible rallies
  const visibleRallies = sortedRallies.slice(0, visibleCount)

  const loadMore = () => {
    setVisibleCount((prev) => prev + 3)
  }

  return (
    <main className="flex min-h-screen flex-col">
      <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/30">
        <div className="container px-4 md:px-6">
          <FadeIn className="space-y-2 text-center">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Explore Rallies</h1>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
              Discover and support funding rallies from around the Neutron ecosystem
            </p>
          </FadeIn>
          <FadeIn className="mt-8 flex flex-col gap-4 md:flex-row" delay={2}>
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search rallies..."
                className="w-full bg-background pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select defaultValue="newest" value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="popular">Most Popular</SelectItem>
                <SelectItem value="ending-soon">Ending Soon</SelectItem>
                <SelectItem value="most-funded">Most Funded</SelectItem>
              </SelectContent>
            </Select>
          </FadeIn>

          <AnimatePresence>
            {visibleRallies.length > 0 ? (
              <motion.div
                className="grid gap-6 mt-8 md:grid-cols-2 lg:grid-cols-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                {visibleRallies.map((rally, index) => (
                  <RallyCard key={rally.id} rally={rally} delay={index} />
                ))}
              </motion.div>
            ) : (
              <motion.div
                className="text-center py-12"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h3 className="text-xl font-medium">No rallies found</h3>
                <p className="text-muted-foreground mt-2">Try adjusting your search criteria</p>
              </motion.div>
            )}
          </AnimatePresence>

          {visibleCount < sortedRallies.length && (
            <FadeIn className="mt-12 flex justify-center" delay={4}>
              <ButtonWithAnimation variant="outline" size="lg" onClick={loadMore}>
                Load More
              </ButtonWithAnimation>
            </FadeIn>
          )}
        </div>
      </section>
    </main>
  )
}

