"use client"

import { createContext, useContext, useEffect, useState, ReactNode } from "react"
import { supabase } from "@/lib/supabase-client"

type ContentContextType = {
  content: Record<string, Record<string, unknown>>
  loading: boolean
  refreshContent: () => Promise<void>
}

const defaultContent = {
  hero: {
    subtitle: "Our Love Story",
    title1: "khaled",
    title2: "amyy",
    description: "Two hearts, one beautiful story — written one ordinary, extraordinary day at a time.",
    cta: "See how long we've loved",
  },
  counter: {
    anniversary_date: "2025-10-20",
    subtitle: "Together since 20 October 2025",
    title: "Every second has been ours",
    description:
      "And the count keeps climbing — just like the way I fall for you a little more with each passing day.",
  },
  gallery: {
    subtitle: "Moments we keep",
    title: "Our favorite memories",
  },
  videos: {
    subtitle: "Moments in motion",
    title: "Our memories, alive",
    description: "Tap any clip to turn its sound on.",
  },
  reasons: {
    subtitle: "From me to you",
    title: "Reasons I love you",
    items: [
      { title: "Your smile", text: "It turns the most ordinary moments into the ones I never want to forget." },
      { title: "The way you listen", text: "You make me feel heard, understood, and completely at home." },
      { title: "Your kindness", text: "The gentle way you treat the world reminds me how lucky I am to be yours." },
      { title: "Our inside jokes", text: "A whole language only we understand, built from a thousand little moments." },
      { title: "How you dream", text: "Every plan we make for the future feels brighter because you're in it." },
      { title: "Just being you", text: "I could list a thousand reasons, but really it all comes down to this." },
    ],
  },
  closing: {
    quote: "In a sea of people, my eyes will always search for you.",
    description:
      "Thank you for every laugh, every hug, and every quiet moment in between. Here's to us — today, on our anniversary, and for all the years still to come.",
    signature: "khaled & amyy",
    tagline: "Forever & always · 20.10.2025",
  },
  envelope: {
    button: "Open Your Love Letter",
    letter_heading: "With all my love",
    letter_names: "khaled & amyy",
    letter_footer: "Forever & Always",
    welcome_message: "Welcome to our story",
  },
}

const ContentContext = createContext<ContentContextType | undefined>(undefined)

export function ContentProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState<Record<string, Record<string, unknown>>>(defaultContent)
  const [loading, setLoading] = useState(true)

  const fetchContent = async () => {
    try {
      const { data, error } = await supabase.from("site_content").select("section, content")

      if (error) throw error

      if (data && data.length > 0) {
        const contentMap: Record<string, Record<string, unknown>> = {}
        data.forEach((item) => {
          contentMap[item.section] = item.content as Record<string, unknown>
        })
        setContent({ ...defaultContent, ...contentMap })
      }
    } catch (err) {
      console.error("Failed to fetch content:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchContent()
  }, [])

  return (
    <ContentContext.Provider value={{ content, loading, refreshContent: fetchContent }}>
      {children}
    </ContentContext.Provider>
  )
}

export function useContent() {
  const context = useContext(ContentContext)
  if (context === undefined) {
    throw new Error("useContent must be used within a ContentProvider")
  }
  return context
}
