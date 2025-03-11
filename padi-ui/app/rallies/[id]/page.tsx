"use client"

import { ButtonWithAnimation } from "@/components/ui/button-with-animation"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Clock, Heart, Share2, User } from "lucide-react"
import Image from "next/image"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { TokenBadge } from "@/components/token-badge"
import { useRallies } from "@/context/rally-context"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { CommentList } from "@/components/comment-list"
import { CommentForm } from "@/components/comment-form"
import { FadeIn } from "@/components/ui/fade-in"
import { motion, AnimatePresence } from "framer-motion"
import React from "react"

export default function RallyPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = React.use(params) // Unwrap the params Promise
  const { rallies } = useRallies()
  const router = useRouter()
  const [rally, setRally] = useState<any>(null)
  const [activeTab, setActiveTab] = useState("about")

  // Find the rally by ID
  useEffect(() => {
    const foundRally = rallies.find((r) => r.id === resolvedParams.id)

    if (foundRally) {
      // Add additional data for the rally detail page
      setRally({
        ...foundRally,
        updates: [
          {
            date: new Date().toISOString().split("T")[0],
            title: "Project launched",
            content: "We're excited to launch this funding rally. Thank you for your support!",
          },
        ],
        supporters: [
          {
            address: "neutron1def...",
            amount: Math.floor(foundRally.goal * 0.1),
            date: new Date().toISOString().split("T")[0],
            token: foundRally.token,
          },
        ],
      })
    } else {
      // If rally not found, redirect to rallies page
      router.push("/rallies")
    }
  }, [resolvedParams.id, rallies, router]) // Use resolvedParams.id in the dependency array

  if (!rally) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
          className="rounded-full h-12 w-12 border-b-2 border-primary"
        ></motion.div>
      </div>
    )
  }

  const percentComplete = Math.round((rally.raised / rally.goal) * 100)

  return (
    <main className="flex min-h-screen flex-col">
      <section className="w-full py-12 md:py-24 bg-background">
        <div className="container px-4 md:px-6">
          <div className="grid gap-8 lg:grid-cols-[2fr_1fr]">
            <div className="space-y-8">
              <FadeIn>
                <motion.div
                  className="relative aspect-video w-full overflow-hidden rounded-lg"
                  whileHover={{ scale: 1.01 }}
                  transition={{ duration: 0.3 }}
                >
                  <Image src={rally.image || "/placeholder.svg"} alt={rally.title} fill className="object-cover" />
                </motion.div>
              </FadeIn>
              <FadeIn delay={1}>
                <div>
                  <div className="flex items-center justify-between">
                    <h1 className="text-3xl font-bold">{rally.title}</h1>
                    <TokenBadge token={rally.token} className="ml-2" />
                  </div>
                  <div className="flex items-center gap-2 mt-2 text-muted-foreground">
                    <User className="h-4 w-4" />
                    <span>Created by {rally.creator}</span>
                  </div>
                </div>
              </FadeIn>
              <FadeIn delay={2}>
                <Tabs defaultValue="about" value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="about">About</TabsTrigger>
                    <TabsTrigger value="updates">Updates</TabsTrigger>
                    <TabsTrigger value="supporters">Supporters</TabsTrigger>
                    <TabsTrigger value="comments">Comments</TabsTrigger>
                  </TabsList>
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeTab}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                    >
                      <TabsContent value="about" className="mt-4 space-y-4">
                        <div className="prose max-w-none">
                          {rally.description.split("\n\n").map((paragraph: string, i: number) => (
                            <p key={i}>{paragraph}</p>
                          ))}
                        </div>
                      </TabsContent>
                      <TabsContent value="updates" className="mt-4 space-y-4">
                        {rally.updates.map((update: any, index: number) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.1 }}
                          >
                            <Card>
                              <CardContent className="p-4">
                                <div className="space-y-2">
                                  <div className="flex items-center justify-between">
                                    <h3 className="font-semibold">{update.title}</h3>
                                    <span className="text-sm text-muted-foreground">{update.date}</span>
                                  </div>
                                  <p>{update.content}</p>
                                </div>
                              </CardContent>
                            </Card>
                          </motion.div>
                        ))}
                      </TabsContent>
                      <TabsContent value="supporters" className="mt-4 space-y-4">
                        {rally.supporters.map((supporter: any, index: number) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.1 }}
                            whileHover={{ scale: 1.01, x: 3 }}
                          >
                            <Card>
                              <CardContent className="p-4">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                    <Avatar className="h-8 w-8">
                                      <AvatarFallback>{supporter.address.substring(0, 2).toUpperCase()}</AvatarFallback>
                                    </Avatar>
                                    <span className="font-medium">{supporter.address}</span>
                                  </div>
                                  <div className="text-right">
                                    <div className="font-medium">
                                      {supporter.amount} {supporter.token}
                                    </div>
                                    <div className="text-sm text-muted-foreground">{supporter.date}</div>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          </motion.div>
                        ))}
                      </TabsContent>
                      <TabsContent value="comments" className="mt-4 space-y-6">
                        <Card>
                          <CardContent className="p-4">
                            <h3 className="text-lg font-semibold mb-4">Leave a Comment</h3>
                            <CommentForm rallyId={rally.id} />
                          </CardContent>
                        </Card>

                        <div className="space-y-2">
                          <h3 className="text-lg font-semibold">Comments ({rally.comments.length})</h3>
                          <CommentList comments={rally.comments} />
                        </div>
                      </TabsContent>
                    </motion.div>
                  </AnimatePresence>
                </Tabs>
              </FadeIn>
            </div>
            <FadeIn direction="left" delay={3}>
              <div className="sticky top-24">
                <motion.div whileHover={{ y: -5 }} transition={{ duration: 0.2 }}>
                  <Card>
                    <CardContent className="p-6 space-y-6">
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="font-medium">{percentComplete}% Funded</span>
                          <span>
                            {rally.raised} / {rally.goal} {rally.token}
                          </span>
                        </div>
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${percentComplete}%` }}
                          transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
                        >
                          <Progress value={percentComplete} className="h-2" />
                        </motion.div>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>{rally.daysLeft} days left</span>
                      </div>
                      <Separator />
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="token">Token</Label>
                            <Select defaultValue={rally.token}>
                              <SelectTrigger id="token">
                                <SelectValue placeholder="Select token" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="NTRN">NTRN</SelectItem>
                                <SelectItem value="tATOM">tATOM</SelectItem>
                                <SelectItem value="USDC">USDC</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="amount">Amount</Label>
                            <Input id="amount" type="number" className="w-full" placeholder="Enter amount" min="1" />
                          </div>
                        </div>
                        <ButtonWithAnimation className="w-full" size="lg">
                          Support This Rally
                        </ButtonWithAnimation>
                      </div>
                      <div className="flex justify-center gap-4">
                        <ButtonWithAnimation variant="outline" size="icon">
                          <Heart className="h-4 w-4" />
                        </ButtonWithAnimation>
                        <ButtonWithAnimation variant="outline" size="icon">
                          <Share2 className="h-4 w-4" />
                        </ButtonWithAnimation>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>
    </main>
  )
}
