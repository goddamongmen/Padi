"use client"

import { ButtonWithAnimation } from "@/components/ui/button-with-animation"
import { FadeIn } from "@/components/ui/fade-in"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"

export function Hero() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-br from-primary/10 via-background to-primary/5">
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
          <FadeIn className="flex flex-col justify-center space-y-4" delay={0}>
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                Fund Your Dreams with Crypto
              </h1>
              <p className="max-w-[600px] text-muted-foreground md:text-xl">
                Padi makes it easy to launch funding rallies and support projects with tokens on the Neutron blockchain.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Link href="/create-rally">
                <ButtonWithAnimation size="lg" className="h-12 px-6">
                  Start a Rally
                </ButtonWithAnimation>
              </Link>
              <Link href="/rallies">
                <ButtonWithAnimation size="lg" variant="outline" className="h-12 px-6">
                  Explore Rallies
                </ButtonWithAnimation>
              </Link>
            </div>
          </FadeIn>
          <FadeIn className="flex items-center justify-center" direction="left" delay={3}>
            <div className="relative w-full h-[300px] md:h-[400px] lg:h-[500px] rounded-lg overflow-hidden">
              <motion.div
                initial={{ scale: 1.1 }}
                animate={{ scale: 1 }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className="h-full w-full"
              >
                <Image
                  src="https://images.unsplash.com/photo-1639762681057-408e52192e55?q=80&w=2832&auto=format&fit=crop"
                  alt="Crypto fundraising illustration"
                  fill
                  className="object-cover"
                />
              </motion.div>
              <div className="absolute inset-0 bg-gradient-to-br from-primary/60 to-background/80 flex items-center justify-center">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                  className="text-center space-y-4 p-6 text-white"
                >
                  <motion.div
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.8, duration: 0.5, type: "spring" }}
                    className="text-4xl font-bold"
                  >
                    $2.4M+
                  </motion.div>
                  <div className="text-xl">Raised on Padi</div>
                </motion.div>
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  )
}

