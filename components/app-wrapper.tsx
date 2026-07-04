"use client"

import { Hero } from "./hero"
import { LoveCounter } from "./love-counter"
import { AnniversaryCountdown } from "./anniversary-countdown"
import { Gallery } from "./gallery"
import { Videos } from "./videos"
import { Reasons } from "./reasons"
import { LoveLetterSection } from "./love-letter-section"
import { OurTimeline } from "./our-timeline"
import { BucketListSection } from "./bucket-list-section"
import { Closing } from "./closing"
import { DayLikeToday } from "./day-like-today"
import { ContentEditorButton } from "./content-editor-modal"

export function AppWrapper() {
  return (
    <>
      <main className="min-h-screen bg-background">
        <Hero />
        <LoveCounter />
        <AnniversaryCountdown />
        <Gallery />
        <Videos />
        <Reasons />
        <LoveLetterSection />
        <OurTimeline />
        <BucketListSection />
        <Closing />
      </main>

      <DayLikeToday />

      {/* Floating action button */}
      <ContentEditorButton />
    </>
  )
}
