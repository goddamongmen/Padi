"use client"

import { ButtonWithAnimation } from "@/components/ui/button-with-animation"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { TokenBadge } from "@/components/token-badge"
import { Wallet } from "lucide-react"
import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

export function WalletConnect() {
  const [address, setAddress] = useState<string | null>(null)
  const [isConnecting, setIsConnecting] = useState(false)
  const [balances, setBalances] = useState<{ token: string; amount: number }[]>([
    { token: "NTRN", amount: 0 },
    { token: "tATOM", amount: 0 },
    { token: "USDC", amount: 0 },
  ])

  // Check for existing wallet connection on component mount
  useEffect(() => {
    const savedAddress = localStorage.getItem("walletAddress")
    if (savedAddress) {
      setAddress(savedAddress)
      // In a real app, we would fetch actual balances here
      setBalances([
        { token: "NTRN", amount: 125.45 },
        { token: "tATOM", amount: 3.72 },
        { token: "USDC", amount: 250 },
      ])
    }
  }, [])

  const connectWallet = async () => {
    try {
      setIsConnecting(true)

      // Check if Keplr is installed
      if (!window.keplr) {
        alert("Please install Keplr extension")
        return
      }

      // Request connection to Neutron chain
      await window.keplr.enable("neutron-1")

      // Get the offlineSigner for Neutron
      const offlineSigner = window.keplr.getOfflineSigner("neutron-1")

      // Get accounts
      const accounts = await offlineSigner.getAccounts()
      const userAddress = accounts[0].address

      // Save address to state and localStorage
      setAddress(userAddress)
      localStorage.setItem("walletAddress", userAddress)

      // In a real app, we would fetch actual balances here
      setBalances([
        { token: "NTRN", amount: 125.45 },
        { token: "tATOM", amount: 3.72 },
        { token: "USDC", amount: 250 },
      ])
    } catch (error) {
      console.error("Error connecting wallet:", error)
      alert("Failed to connect wallet. Please try again.")
    } finally {
      setIsConnecting(false)
    }
  }

  const disconnectWallet = () => {
    setAddress(null)
    localStorage.removeItem("walletAddress")
    setBalances([
      { token: "NTRN", amount: 0 },
      { token: "tATOM", amount: 0 },
      { token: "USDC", amount: 0 },
    ])
  }

  const formatAddress = (addr: string) => {
    if (!addr) return ""
    return `${addr.substring(0, 8)}...${addr.substring(addr.length - 4)}`
  }

  return (
    <AnimatePresence mode="wait">
      {address ? (
        <motion.div
          key="connected"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
        >
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <ButtonWithAnimation variant="outline" className="gap-2">
                <Wallet className="h-4 w-4" />
                {formatAddress(address)}
              </ButtonWithAnimation>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Wallet</DropdownMenuLabel>
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.2 }}
                className="px-2 py-1.5"
              >
                {balances.map((balance, index) => (
                  <motion.div
                    key={balance.token}
                    className="flex items-center justify-between py-1"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * (index + 1), duration: 0.2 }}
                  >
                    <TokenBadge token={balance.token} />
                    <span className="font-medium">{balance.amount.toLocaleString()}</span>
                  </motion.div>
                ))}
              </motion.div>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigator.clipboard.writeText(address)}>Copy Address</DropdownMenuItem>
              <DropdownMenuItem onClick={disconnectWallet}>Disconnect</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </motion.div>
      ) : (
        <motion.div
          key="disconnected"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          transition={{ duration: 0.2 }}
        >
          <ButtonWithAnimation onClick={connectWallet} disabled={isConnecting} className="gap-2">
            <Wallet className="h-4 w-4" />
            {isConnecting ? (
              <span className="flex items-center">
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4"
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
                Connecting...
              </span>
            ) : (
              "Connect Wallet"
            )}
          </ButtonWithAnimation>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

