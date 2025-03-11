"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { ButtonWithAnimation } from "@/components/ui/button-with-animation"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { useRallies } from "@/context/rally-context"
import { motion, AnimatePresence } from "framer-motion"

interface CommentFormProps {
  rallyId: string
}

export function CommentForm({ rallyId }: CommentFormProps) {
  const [message, setMessage] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [walletConnected, setWalletConnected] = useState(false)
  const [walletAddress, setWalletAddress] = useState<string | null>(null)
  const { addComment } = useRallies()
  const { toast } = useToast()

  useEffect(() => {
    // Check if wallet is connected
    const address = localStorage.getItem("walletAddress")
    setWalletConnected(!!address)
    setWalletAddress(address)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!walletConnected) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to leave a comment",
        variant: "destructive",
      })
      return
    }

    if (!message.trim()) {
      toast({
        title: "Empty comment",
        description: "Please enter a comment before submitting",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      // Add the comment to the rally
      addComment(rallyId, {
        address: walletAddress || "unknown",
        message: message.trim(),
      })

      // Clear the form
      setMessage("")

      toast({
        title: "Comment added",
        description: "Your comment has been added successfully",
      })
    } catch (error) {
      toast({
        title: "Error adding comment",
        description: "There was an error adding your comment. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="space-y-4"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Textarea
        placeholder={walletConnected ? "Share your thoughts about this rally..." : "Connect your wallet to comment"}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        disabled={!walletConnected || isSubmitting}
        className="min-h-[100px] transition-all duration-200 focus:border-primary"
      />
      <div className="flex justify-end">
        <ButtonWithAnimation
          type="submit"
          disabled={!walletConnected || isSubmitting || !message.trim()}
          animateOnClick={true}
        >
          {isSubmitting ? (
            <span className="flex items-center">
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Posting...
            </span>
          ) : (
            "Post Comment"
          )}
        </ButtonWithAnimation>
      </div>
      <AnimatePresence>
        {!walletConnected && (
          <motion.p
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="text-sm text-center text-muted-foreground"
          >
            Please connect your wallet to leave a comment
          </motion.p>
        )}
      </AnimatePresence>
    </motion.form>
  )
}

