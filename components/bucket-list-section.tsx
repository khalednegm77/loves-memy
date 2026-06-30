"use client"

import { useState, useEffect } from "react"
import { Heart } from "lucide-react"
import { useContent } from "./content-context"
import { supabase } from "@/lib/supabase-client"

type BucketItem = { text: string; done: boolean; emoji: string }

const LS_KEY = "bucketlist_checked"

function loadLocal(): Record<number, boolean> {
  try {
    return JSON.parse(localStorage.getItem(LS_KEY) || "{}")
  } catch {
    return {}
  }
}

function saveLocal(map: Record<number, boolean>) {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(map))
  } catch { /* ignore */ }
}

export function BucketListSection() {
  const { content, refreshContent } = useContent()
  const bucketlist = content.bucketlist || {}
  const baseItems = (bucketlist.items as BucketItem[]) || []

  // Local overrides from localStorage (index → done)
  const [localOverrides, setLocalOverrides] = useState<Record<number, boolean>>({})
  const [toggling, setToggling] = useState<number | null>(null)

  useEffect(() => {
    setLocalOverrides(loadLocal())
  }, [])

  // Merge base items with local overrides
  const items = baseItems.map((item, i) =>
    i in localOverrides ? { ...item, done: localOverrides[i] } : item
  )

  const handleToggle = async (index: number) => {
    if (toggling !== null) return
    setToggling(index)

    const newDone = !items[index].done
    const newOverrides = { ...localOverrides, [index]: newDone }
    setLocalOverrides(newOverrides)
    saveLocal(newOverrides)

    const updated = items.map((item, i) =>
      i === index ? { ...item, done: newDone } : item
    )

    try {
      const { error } = await supabase
        .from("site_content")
        .upsert(
          { section: "bucketlist", content: { ...bucketlist, items: updated } },
          { onConflict: "section" }
        )
      if (!error) {
        // If DB saved successfully, clear local overrides for this item
        const cleared = { ...newOverrides }
        delete cleared[index]
        setLocalOverrides(cleared)
        saveLocal(cleared)
        await refreshContent()
      }
    } catch { /* local state already applied */ } finally {
      setToggling(null)
    }
  }

  const done = items.filter((i) => i.done).length
  const total = items.length

  return (
    <section id="bucketlist" className="mx-auto w-full max-w-4xl px-6 py-20 sm:py-28">
      <div className="mb-12 text-center">
        <p className="mb-3 text-sm uppercase tracking-[0.3em] text-accent-foreground">
          {bucketlist.subtitle as string}
        </p>
        <h2 className="text-balance font-serif text-4xl font-semibold text-foreground sm:text-5xl">
          {bucketlist.title as string}
        </h2>

        <div className="mx-auto mt-6 max-w-xs">
          <div className="mb-2 flex justify-between text-xs text-muted-foreground">
            <span>{done} completed</span>
            <span>{total} total</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
            <div
              className="h-full rounded-full bg-primary transition-all duration-700"
              style={{ width: total > 0 ? `${(done / total) * 100}%` : "0%" }}
            />
          </div>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {items.map((item, index) => (
          <button
            key={index}
            onClick={() => handleToggle(index)}
            disabled={toggling !== null}
            className={`group flex items-center gap-4 rounded-2xl border p-4 text-left transition-all duration-200 hover:shadow-md disabled:opacity-70 ${
              item.done
                ? "border-primary/30 bg-primary/5"
                : "border-border bg-card hover:border-primary/30"
            }`}
          >
            <span
              className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full border-2 transition-all ${
                item.done
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-muted-foreground/30 group-hover:border-primary/50"
              }`}
            >
              {item.done && (
                <svg className="h-4 w-4" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8l3.5 3.5L13 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </span>

            <span className="text-2xl">{item.emoji}</span>

            <span
              className={`font-serif text-base leading-snug transition-colors ${
                item.done
                  ? "text-muted-foreground line-through decoration-primary/50"
                  : "text-foreground"
              }`}
            >
              {item.text}
            </span>

            {item.done && (
              <Heart className="ml-auto h-4 w-4 flex-shrink-0 fill-primary text-primary opacity-60" />
            )}
          </button>
        ))}
      </div>
    </section>
  )
}
