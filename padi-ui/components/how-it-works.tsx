"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Coins, Rocket, Users, Wallet } from "lucide-react"
import { FadeIn } from "@/components/ui/fade-in"
import { motion } from "framer-motion"

export function HowItWorks() {
  const steps = [
    {
      icon: <Wallet className="h-10 w-10 text-primary" />,
      title: "Connect Your Wallet",
      description:
        "Link your Keplr wallet to get started with Padi.",
    },
    {
      icon: <Rocket className="h-10 w-10 text-primary" />,
      title: "Create a Rally",
      description: "Set your funding goal, timeline, and share your story.",
    },
    {
      icon: <Users className="h-10 w-10 text-primary" />,
      title: "Share With Community",
      description: "Spread the word about your funding rally to the Neutron ecosystem and beyond.",
    },
    {
      icon: <Coins className="h-10 w-10 text-primary" />,
      title: "Receive Funds",
      description: "Get tokens directly to your wallet when funded. Multiple token types supported.",
    },
  ]

  return (
    <section className="w-full py-12 md:py-24 bg-muted/50">
      <div className="container px-4 md:px-6">
        <FadeIn className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">How Padi Works</h2>
            <p className="max-w-[700px] text-muted-foreground md:text-xl">
              Launch your funding rally in minutes and start receiving crypto contributions
            </p>
          </div>
        </FadeIn>
        <div className="grid gap-6 mt-8 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => (
            <FadeIn key={index} delay={index + 1} direction="up">
              <motion.div whileHover={{ y: -5 }} transition={{ duration: 0.2 }}>
                <Card className="bg-background h-full">
                  <CardHeader className="pb-2">
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.2 * (index + 1), duration: 0.5 }}
                      className="mb-2"
                    >
                      {step.icon}
                    </motion.div>
                    <CardTitle className="text-xl">{step.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-sm">{step.description}</CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  )
}

