"use client"

import type React from "react"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { forwardRef } from "react"

interface AnimatedCardProps extends React.HTMLAttributes<HTMLDivElement> {
  delay?: number
}

const AnimatedCard = forwardRef<HTMLDivElement, AnimatedCardProps>(
  ({ className, children, delay = 0, ...props }, ref) => {
    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10 }}
        transition={{
          duration: 0.3,
          delay: delay * 0.1,
          ease: "easeOut",
        }}
        whileHover={{
          y: -5,
          transition: { duration: 0.2 },
        }}
        className={cn("rounded-lg border bg-card text-card-foreground shadow-sm", className)}
        {...props}
      >
        {children}
      </motion.div>
    )
  },
)
AnimatedCard.displayName = "AnimatedCard"

export { AnimatedCard }

