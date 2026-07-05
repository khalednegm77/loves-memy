"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { X, ChevronLeft, ChevronRight } from "lucide-react"
import { useContent } from "./content-context"
import { useReveal } from "@/lib/use-reveal"

const photos = [
  { src: "/photo/Snapchat-56070109.jpg", caption: "bahbk ya meemy" },
  { src: "/photo/Snapchat-409129044.jpg", caption: "mbhb4 8erek" },
  { src: "/photo/Snapchat-627390407.jpg", caption: "ya rb atgwzek" },
  { src: "/photo/Snapchat-883938423.jpg", caption: "b34 hlawtek" },
  { src: "/photo/Snapchat-973548843.jpg", caption: "ya khlathoo 3leky" },
  { src: "/photo/Snapchat-996879705.jpg", caption: "aywa ya 8azaal" },
  { src: "/photo/Snapchat-1077329272.jpg", caption: "7ook4a el kalb" },
  { src: "/photo/Snapchat-1137848570.jpg", caption: "ykhrbeet gmalak" },
  { src: "/photo/Snapchat-1391196933.jpg", caption: "ykhrbeet hlawtek" },
  { src: "/photo/Snapchat-1415068960.jpg", caption: "a8la ma lya" },
  { src: "/photo/Snapchat-1574178237.jpg", caption: "b34 kol haga feky" },
  { src: "/photo/Snapchat-1614855115.jpg", caption: "om el 3yal" },
  { src: "/photo/IMG-20260701-WA0005.jpg", caption: "a7la ayam hyaty btb4a m3aky" },
  { src: "/photo/Snapchat-1797008326.jpg", caption: "mhd4 bywhshny adek bgd" },
  { src: "/photo/Snapchat-1931337413.jpg", caption: "bmoot feky ya meemy" },
]

export function Gallery() {
  const { content } = useContent()
  const gallery = content.gallery || {}
  const [errored, setErrored] = useState<Record<string, boolean>>({})
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
  const sectionRef = useReveal<HTMLElement>()

  const visible = photos.filter((p) => !errored[p.src])

  // Map filtered index back to original photos array
  const openLightbox = (filteredIndex: number) => setLightboxIndex(filteredIndex)
  const closeLightbox = () => setLightboxIndex(null)

  const goNext = useCallback(() => {
    setLightboxIndex((prev) => (prev === null ? prev : (prev + 1) % visible.length))
  }, [visible.length])

  const goPrev = useCallback(() => {
    setLightboxIndex((prev) => (prev === null ? prev : (prev - 1 + visible.length) % visible.length))
  }, [visible.length])

  // Keyboard navigation
  useEffect(() => {
    if (lightboxIndex === null) return
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox()
      if (e.key === "ArrowRight") goNext()
      if (e.key === "ArrowLeft") goPrev()
    }
    window.addEventListener("keydown", handleKey)
    document.body.style.overflow = "hidden"
    return () => {
      window.removeEventListener("keydown", handleKey)
      document.body.style.overflow = ""
    }
  }, [lightboxIndex, goNext, goPrev])

  // Touch swipe support
  const touchStartX = useRef<number | null>(null)
  const touchEndX = useRef<number | null>(null)

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
    touchEndX.current = null
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX
  }

  const handleTouchEnd = () => {
    if (touchStartX.current === null || touchEndX.current === null) return
    const diff = touchStartX.current - touchEndX.current
    if (Math.abs(diff) > 50) {
      if (diff > 0) goNext()
      else goPrev()
    }
    touchStartX.current = null
    touchEndX.current = null
  }

  return (
    <section
      ref={sectionRef}
      id="gallery"
      className="scrapbook-page relative mx-auto w-full max-w-6xl overflow-hidden px-8 py-24 sm:px-12 sm:py-32"
    >
      {/* Decorative flower */}
      <img 
        src="/decorations/flower-1.png" 
        alt="" 
        className="flower-decoration absolute top-20 right-10 w-20 h-20 opacity-80 sm:w-28 sm:h-28"
      />
      {/* Decorative leaf */}
      <img 
        src="/decorations/leaf-1.png" 
        alt="" 
        className="absolute bottom-32 left-5 w-24 h-24 opacity-70 sm:w-32 sm:h-32"
        style={{ transform: 'scaleX(-1)' }}
      />

      {/* Section header */}
      <div className="mb-16 text-center sm:mb-20">
        <h2 className="text-balance text-5xl font-bold text-foreground sm:text-6xl" style={{ fontFamily: 'var(--font-caveat)' }}>
          Our favorite memories
        </h2>
        <p className="mt-3 handwritten-caption text-xl text-[#8B7B72]">Those special moments we cherish forever 💕</p>
      </div>

      {visible.length > 0 ? (
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((photo, i) => (
            <figure
              key={photo.src}
              className="tape-photo group relative block w-full overflow-visible"
              style={{ transform: `rotate(${i % 2 === 0 ? -2 : 2}deg)` }}
            >
              <button
                type="button"
                onClick={() => openLightbox(i)}
                className="block w-full cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2"
                aria-label={`Open photo: ${photo.caption}`}
              >
                <img
                  src={photo.src}
                  alt={photo.caption}
                  loading="eager"
                  className="w-full bg-white object-cover shadow-lg transition-transform duration-500 ease-out group-hover:scale-[1.02]"
                  style={{ height: i % 2 === 0 ? '350px' : '300px' }}
                  onError={() => setErrored((prev) => ({ ...prev, [photo.src]: true }))}
                />
              </button>
              {/* Handwritten caption below photo */}
              <figcaption className="mt-3 handwritten-caption text-center text-sm italic text-[#8B7B72]">
                {photo.caption}
              </figcaption>
            </figure>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-[var(--champagne-deep)]/30 bg-white/50 px-6 py-16 text-center">
          <p className="font-serif text-2xl text-foreground">Our photos will live here</p>
          <p className="mt-2 max-w-md text-pretty leading-relaxed text-muted-foreground">
            Add your photos to the <code className="text-xs">/public/photos/</code> folder and they&apos;ll appear here.
          </p>
        </div>
      )}

      {/* ── Lightbox ─────────────────────────────────────── */}
      {lightboxIndex !== null && visible[lightboxIndex] && (
        <div
          className="lightbox-backdrop fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm"
          onClick={closeLightbox}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          role="dialog"
          aria-modal="true"
          aria-label="Photo viewer"
        >
          {/* Close button */}
          <button
            onClick={closeLightbox}
            className="absolute right-4 top-4 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-md transition-colors duration-300 hover:bg-white/25 sm:h-12 sm:w-12"
            aria-label="Close photo viewer"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Previous */}
          {visible.length > 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); goPrev() }}
              className="absolute left-2 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-md transition-colors duration-300 hover:bg-white/25 sm:left-4 sm:h-12 sm:w-12"
              aria-label="Previous photo"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
          )}

          {/* Image */}
          <div
            className="lightbox-image relative max-h-[85vh] max-w-[92vw] overflow-hidden rounded-2xl sm:rounded-3xl"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={visible[lightboxIndex].src}
              alt={visible[lightboxIndex].caption}
              loading="eager"
              className="max-h-[85vh] w-auto max-w-[92vw] object-contain"
            />
            <p className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-4 pb-5 text-center font-serif text-lg text-white">
              {visible[lightboxIndex].caption}
            </p>
          </div>

          {/* Next */}
          {visible.length > 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); goNext() }}
              className="absolute right-2 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-md transition-colors duration-300 hover:bg-white/25 sm:right-4 sm:h-12 sm:w-12"
              aria-label="Next photo"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          )}

          {/* Counter */}
          {visible.length > 1 && (
            <span className="absolute bottom-5 left-1/2 -translate-x-1/2 rounded-full bg-white/15 px-4 py-1.5 text-sm text-white backdrop-blur-md">
              {lightboxIndex + 1} / {visible.length}
            </span>
          )}
        </div>
      )}
    </section>
  )
}
