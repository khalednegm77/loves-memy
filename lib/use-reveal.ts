"use client"

import { useEffect, useRef } from "react"

/**
 * Adds the `is-visible` class to the element (and optionally its children
 * via `.reveal-stagger`) when it scrolls into view. Respects
 * prefers-reduced-motion automatically — the CSS disables the animation.
 */
export function useReveal<T extends HTMLElement = HTMLDivElement>() {
  const ref = useRef<T>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible")
            observer.unobserve(entry.target)
          }
        })
      },
      { rootMargin: "0px", threshold: 0.01 }
    )

    observer.observe(el)

    // Fallback: if the observer hasn't fired after 500ms, show anyway.
    // This handles edge cases where the element is already in viewport
    // but the observer callback is delayed.
    const timeout = setTimeout(() => {
      el.classList.add("is-visible")
    }, 500)

    return () => {
      observer.disconnect()
      clearTimeout(timeout)
    }
  }, [])

  return ref
}
