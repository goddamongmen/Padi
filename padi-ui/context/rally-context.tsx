"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

export interface Comment {
  id: string
  rallyId: string
  address: string
  message: string
  createdAt: Date
}

export interface Rally {
  id: string
  title: string
  description: string
  image: string
  goal: number
  raised: number
  creator: string
  daysLeft: number
  token: string
  createdAt: Date
  comments: Comment[]
}

interface RallyContextType {
  rallies: Rally[]
  addRally: (rally: Rally) => void
  addComment: (rallyId: string, comment: Omit<Comment, "id" | "rallyId" | "createdAt">) => void
}

const RallyContext = createContext<RallyContextType | undefined>(undefined)

// Sample initial rallies
const initialRallies: Rally[] = [
  {
    id: "1",
    title: "Community Garden Project",
    description: "Help us build a sustainable garden for our local community.",
    image: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?q=80&w=2942&auto=format&fit=crop",
    goal: 5000,
    raised: 3200,
    creator: "neutron1abc...",
    daysLeft: 12,
    token: "NTRN",
    createdAt: new Date(2024, 1, 15),
    comments: [
      {
        id: "c1",
        rallyId: "1",
        address: "neutron1def...",
        message: "This is exactly what our community needs! I'm excited to see this project come to life.",
        createdAt: new Date(2024, 1, 20),
      },
      {
        id: "c2",
        rallyId: "1",
        address: "neutron1ghi...",
        message: "Will there be educational workshops as part of this project?",
        createdAt: new Date(2024, 1, 22),
      },
    ],
  },
  {
    id: "2",
    title: "Decentralized Education Platform",
    description: "Creating accessible education through blockchain technology.",
    image: "https://images.unsplash.com/photo-1501504905252-473c47e087f8?q=80&w=3174&auto=format&fit=crop",
    goal: 10000,
    raised: 4500,
    creator: "neutron1def...",
    daysLeft: 20,
    token: "tATOM",
    createdAt: new Date(2024, 1, 10),
    comments: [
      {
        id: "c3",
        rallyId: "2",
        address: "neutron1jkl...",
        message: "Education should be accessible to everyone. Great initiative!",
        createdAt: new Date(2024, 1, 15),
      },
    ],
  },
  {
    id: "3",
    title: "Clean Water Initiative",
    description: "Bringing clean water solutions to communities in need.",
    image: "https://images.unsplash.com/photo-1436262513933-a0b06755c784?q=80&w=2071&auto=format&fit=crop",
    goal: 7500,
    raised: 6800,
    creator: "neutron1ghi...",
    daysLeft: 5,
    token: "NTRN",
    createdAt: new Date(2024, 1, 5),
    comments: [
      {
        id: "c4",
        rallyId: "3",
        address: "neutron1mno...",
        message: "Clean water is a basic human right. Happy to support this cause.",
        createdAt: new Date(2024, 1, 8),
      },
    ],
  },
  {
    id: "4",
    title: "Renewable Energy Research",
    description: "Funding innovative solutions for sustainable energy.",
    image: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?q=80&w=2940&auto=format&fit=crop",
    goal: 15000,
    raised: 2300,
    creator: "neutron1jkl...",
    daysLeft: 30,
    token: "tATOM",
    createdAt: new Date(2024, 0, 25),
    comments: [],
  },
  {
    id: "5",
    title: "Open Source Development Fund",
    description: "Supporting developers working on critical open source projects.",
    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=2034&auto=format&fit=crop",
    goal: 8000,
    raised: 1200,
    creator: "neutron1mno...",
    daysLeft: 25,
    token: "NTRN",
    createdAt: new Date(2024, 0, 15),
    comments: [],
  },
  {
    id: "6",
    title: "Wildlife Conservation Project",
    description: "Protecting endangered species and their habitats.",
    image: "https://images.unsplash.com/photo-1535338454770-8be927b5a00b?q=80&w=2942&auto=format&fit=crop",
    goal: 12000,
    raised: 9800,
    creator: "neutron1pqr...",
    daysLeft: 8,
    token: "tATOM",
    createdAt: new Date(2024, 0, 10),
    comments: [],
  },
]

export function RallyProvider({ children }: { children: ReactNode }) {
  const [rallies, setRallies] = useState<Rally[]>(initialRallies)

  const addRally = (rally: Rally) => {
    setRallies((prevRallies) => [rally, ...prevRallies])
  }

  const addComment = (rallyId: string, comment: Omit<Comment, "id" | "rallyId" | "createdAt">) => {
    setRallies((prevRallies) =>
      prevRallies.map((rally) => {
        if (rally.id === rallyId) {
          const newComment: Comment = {
            id: `comment-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
            rallyId,
            ...comment,
            createdAt: new Date(),
          }
          return {
            ...rally,
            comments: [newComment, ...rally.comments],
          }
        }
        return rally
      }),
    )
  }

  return <RallyContext.Provider value={{ rallies, addRally, addComment }}>{children}</RallyContext.Provider>
}

export function useRallies() {
  const context = useContext(RallyContext)
  if (context === undefined) {
    throw new Error("useRallies must be used within a RallyProvider")
  }
  return context
}

