import { Button } from "@/components/ui/button"
import { WalletConnect } from "@/components/wallet-connect"
import Link from "next/link"

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="mr-4 flex">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold">Padi</span>
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <nav className="flex items-center space-x-4">
            <Link href="/rallies" className="text-sm font-medium transition-colors hover:text-primary">
              Explore
            </Link>
            <Link href="/" className="text-sm font-medium transition-colors hover:text-primary">
              How It Works
            </Link>
            <Link href="/" className="text-sm font-medium transition-colors hover:text-primary">
              About
            </Link>
          </nav>
          <div className="flex items-center space-x-2">
            <Link href="/create-rally">
              <Button variant="outline" size="sm" className="mr-2">
                Start a Rally
              </Button>
            </Link>
            <WalletConnect />
          </div>
        </div>
      </div>
    </header>
  )
}

