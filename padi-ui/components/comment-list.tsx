"use client"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import type { Comment } from "@/context/rally-context"
import { formatDistanceToNow } from "date-fns"
import { StaggeredList, StaggeredItem } from "@/components/ui/staggered-list"
import { motion } from "framer-motion"

interface CommentListProps {
  comments: Comment[]
}

export function CommentList({ comments }: CommentListProps) {
  if (comments.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center py-8"
      >
        <p className="text-muted-foreground">No comments yet. Be the first to comment!</p>
      </motion.div>
    )
  }

  return (
    <StaggeredList className="space-y-4" staggerDelay={0.1} initialDelay={0.2}>
      {comments.map((comment) => (
        <StaggeredItem key={comment.id}>
          <motion.div whileHover={{ scale: 1.01, x: 3 }} transition={{ duration: 0.2 }}>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback>{comment.address.substring(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">{comment.address}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                      </p>
                    </div>
                    <p className="text-sm">{comment.message}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </StaggeredItem>
      ))}
    </StaggeredList>
  )
}

