import { FeaturedRallies } from "@/components/featured-rallies"
import { Hero } from "@/components/hero"
import { HowItWorks } from "@/components/how-it-works"
import { TopContributors } from "@/components/top-contributors"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col">
      <Hero />
      <FeaturedRallies />
      <HowItWorks />
      <TopContributors />
    </main>
  )
}

