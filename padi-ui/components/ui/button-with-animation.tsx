"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { forwardRef } from "react"
import { cn } from "@/lib/utils"

const MotionButton = motion(Button)

interface ButtonWithAnimationProps extends React.ComponentProps<typeof Button> {
  animateOnClick?: boolean
}

const ButtonWithAnimation = forwardRef<HTMLButtonElement, ButtonWithAnimationProps>(
  ({ className, children, animateOnClick = true, ...props }, ref) => {
    return (
      <MotionButton
        ref={ref}
        className={cn(className)}
        whileHover={{ scale: 1.02 }}
        whileTap={animateOnClick ? { scale: 0.98 } : undefined}
        transition={{ duration: 0.2 }}
        {...props}
      >
        {children}
      </MotionButton>
    )
  },
)
ButtonWithAnimation.displayName = "ButtonWithAnimation"

export { ButtonWithAnimation }

