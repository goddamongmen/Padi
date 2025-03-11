"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function CreateRallyPage() {
  const [walletConnected, setWalletConnected] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    // Check if wallet is connected
    const address = localStorage.getItem("walletAddress")
    setWalletConnected(!!address)
  }, [])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!walletConnected) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to create a rally",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      // In a real app, you would submit to your API and interact with the blockchain
      // This is just a simulation
      await new Promise((resolve) => setTimeout(resolve, 2000))

      toast({
        title: "Rally created!",
        description: "Your funding rally has been created successfully",
      })

      router.push("/rallies")
    } catch (error) {
      toast({
        title: "Error creating rally",
        description: "There was an error creating your rally. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="flex min-h-screen flex-col">
      <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/30">
        <div className="container px-4 md:px-6">
          <div className="space-y-2 text-center">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Create a Funding Rally</h1>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
              Launch your project and start receiving support from the community
            </p>
          </div>
          <div className="mx-auto mt-8 max-w-2xl">
            <Card>
              <CardHeader>
                <CardTitle>Rally Details</CardTitle>
                <CardDescription>Fill out the information below to create your funding rally</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="title">Rally Title</Label>
                    <Input id="title" placeholder="Enter a catchy title for your rally" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      placeholder="Describe your project, goals, and how the funds will be used"
                      className="min-h-[150px]"
                      required
                    />
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="goal">Funding Goal</Label>
                      <Input id="goal" type="number" min="100" placeholder="1000" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="token">Token</Label>
                      <Select defaultValue="NTRN">
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
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="duration">Duration (Days)</Label>
                      <Input id="duration" type="number" min="1" max="90" placeholder="30" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="category">Category</Label>
                      <Select defaultValue="community">
                        <SelectTrigger id="category">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="community">Community</SelectItem>
                          <SelectItem value="technology">Technology</SelectItem>
                          <SelectItem value="environment">Environment</SelectItem>
                          <SelectItem value="education">Education</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="image">Cover Image</Label>
                    <Input id="image" type="file" accept="image/*" />
                    <p className="text-sm text-muted-foreground">
                      Recommended size: 1200x630 pixels. Max file size: 5MB.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tags">Tags (Optional)</Label>
                    <Input id="tags" placeholder="Separate tags with commas (e.g., education, environment)" />
                  </div>
                  <Button type="submit" className="w-full" size="lg" disabled={!walletConnected || isSubmitting}>
                    {isSubmitting ? "Creating Rally..." : "Create Rally"}
                  </Button>
                  {!walletConnected && (
                    <p className="text-sm text-center text-destructive">Please connect your wallet to create a rally</p>
                  )}
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </main>
  )
}

