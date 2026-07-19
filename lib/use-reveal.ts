"use client"

import { useEffect, useRef } from "react"

/**
 * Adds the `is-visible` class to the element (and optionally its children
 * via `.reveal-stagger`) when it scrolls into view. Respects
 * prefers-reduced-motion automatically — the IntersectionObserver still
 * fires, but the CSS disables the animation.
 *
 * Includes a fallback timeout: some mobile browsers (dynamic address-bar
 * resizing, etc.) can fail to fire the IntersectionObserver reliably. If
 * that happens, the section would stay invisible forever. To guard against
 * that, we force the reveal after a short delay regardless.
 */
export function useReveal<T extends HTMLElement = HTMLDivElement>() {
  const ref = useRef<T>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    let revealed = false
    const reveal = () => {
      if (revealed) return
      revealed = true
      el.classList.add("is-visible")
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            reveal()
            observer.unobserve(entry.target)
          }
        })
      },
      { rootMargin: "60px", threshold: 0.12 }
    )
    observer.observe(el)

    // Fallback: if the element is already on-screen at mount (e.g. observer
    // misses the initial check due to a viewport resize race), or the
    // observer never fires for any other reason, reveal it anyway after a
    // short grace period so content can never get stuck invisible.
    const fallback = setTimeout(reveal, 1800)

    return () => {
      observer.disconnect()
      clearTimeout(fallback)
    }
  }, [])

  return ref
}
