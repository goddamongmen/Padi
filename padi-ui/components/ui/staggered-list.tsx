"use client"

import type React from "react"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface StaggeredListProps extends React.HTMLAttributes<HTMLDivElement> {
  staggerDelay?: number
  initialDelay?: number
}

export function StaggeredList({
  children,
  className,
  staggerDelay = 0.1,
  initialDelay = 0,
  ...props
}: StaggeredListProps) {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDelay,
        delayChildren: initialDelay,
      },
    },
  }

  return (
    <motion.div variants={container} initial="hidden" animate="show" className={cn(className)} {...props}>
      {children}
    </motion.div>
  )
}

interface StaggeredItemProps extends React.HTMLAttributes<HTMLDivElement> {
  distance?: number
}

export function StaggeredItem({ children, className, distance = 20, ...props }: StaggeredItemProps) {
  const item = {
    hidden: { opacity: 0, y: distance },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24,
      },
    },
  }

  return (
    <motion.div variants={item} className={cn(className)} {...props}>
      {children}
    </motion.div>
  )
}

