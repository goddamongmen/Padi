"use client"

import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Clock, User } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { TokenBadge } from "@/components/token-badge"
import { ButtonWithAnimation } from "@/components/ui/button-with-animation"
import { motion } from "framer-motion"

interface RallyCardProps {
  rally: {
    id: string
    title: string
    description: string
    image: string
    goal: number
    raised: number
    creator: string
    daysLeft: number
    token: string
  }
  delay?: number
}

export function RallyCard({ rally, delay = 0 }: RallyCardProps) {
  const percentComplete = Math.round((rally.raised / rally.goal) * 100)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: delay * 0.1 }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      className="h-full"
    >
      <Card className="overflow-hidden transition-all h-full flex flex-col">
        <div className="relative aspect-video w-full overflow-hidden">
          <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.4 }} className="h-full w-full">
            <Image src={rally.image || "/placeholder.svg"} alt={rally.title} fill className="object-cover" />
          </motion.div>
        </div>
        <CardHeader className="p-4">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <h3 className="font-semibold text-xl line-clamp-1">{rally.title}</h3>
              <p className="text-muted-foreground text-sm line-clamp-2">{rally.description}</p>
            </div>
            <TokenBadge token={rally.token} />
          </div>
        </CardHeader>
        <CardContent className="p-4 pt-0 space-y-4 flex-grow">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="font-medium">{percentComplete}% Funded</span>
              <span>
                {rally.raised} / {rally.goal} {rally.token}
              </span>
            </div>
            <Progress value={percentComplete} className="h-2" />
          </div>
          <div className="flex justify-between text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <User className="h-3.5 w-3.5" />
              <span className="truncate max-w-[100px]">{rally.creator}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              <span>{rally.daysLeft} days left</span>
            </div>
          </div>
        </CardContent>
        <CardFooter className="p-4 pt-0 mt-auto">
          <Link href={`/rallies/${rally.id}`} className="w-full">
            <ButtonWithAnimation className="w-full">Support This Rally</ButtonWithAnimation>
          </Link>
        </CardFooter>
      </Card>
    </motion.div>
  )
}

