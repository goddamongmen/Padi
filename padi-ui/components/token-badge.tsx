import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface TokenBadgeProps {
  token: string
  className?: string
}

export function TokenBadge({ token, className }: TokenBadgeProps) {
  const getTokenColor = (token: string) => {
    switch (token) {
      case "NTRN":
        return "bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600"
      case "tATOM":
        return "bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600"
      case "USDC":
        return "bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
      default:
        return "bg-gradient-to-r from-gray-500 to-slate-500 hover:from-gray-600 hover:to-slate-600"
    }
  }

  return <Badge className={cn("font-medium border-0 text-white", getTokenColor(token), className)}>{token}</Badge>
}

