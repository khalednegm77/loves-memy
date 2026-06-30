"use client"

import Image from "next/image"
import { useState } from "react"
import { useContent } from "./content-context"

const photos = [
  { src: "/photos/us-3.jpg", caption: "Resting my head where I feel safest" },
  { src: "/photos/us-1.jpg", caption: "Just us, soaking up the sun" },
  { src: "/photos/us-5.jpg", caption: "Coffee dates with my favorite person" },
  { src: "/photos/us-8.jpg", caption: "Silly together, even with our little one" },
  { src: "/photos/us-4.jpg", caption: "Every elevator ride is a photoshoot" },
  { src: "/photos/us-2.jpg", caption: "You make me laugh like no one else" },
  { src: "/photos/us-6.jpg", caption: "Always better when we match" },
  { src: "/photos/us-7.jpg", caption: "My reason to smile" },
]

export function Gallery() {
  const { content } = useContent()
  const gallery = content.gallery || {}
  const [errored, setErrored] = useState<Record<string, boolean>>({})

  const visible = photos.filter((p) => !errored[p.src])

  return (
    <section id="gallery" className="mx-auto w-full max-w-6xl px-6 py-20 sm:py-28">
      <div className="mb-12 text-center">
        <p className="mb-3 text-sm uppercase tracking-[0.3em] text-accent-foreground">
          {gallery.subtitle as string}
        </p>
        <h2 className="text-balance font-serif text-4xl font-semibold text-foreground sm:text-5xl">
          {gallery.title as string}
        </h2>
      </div>

      {visible.length > 0 ? (
        <div className="columns-1 gap-4 sm:columns-2 lg:columns-3 [&>*]:mb-4">
          {visible.map((photo, i) => (
            <figure
              key={photo.src}
              className="group relative break-inside-avoid overflow-hidden rounded-2xl border border-border bg-card shadow-sm"
            >
              <Image
                src={photo.src}
                alt={photo.caption}
                width={600}
                height={i % 2 === 0 ? 800 : 600}
                className="h-auto w-full object-cover transition-transform duration-500 group-hover:scale-105"
                onError={() => setErrored((prev) => ({ ...prev, [photo.src]: true }))}
              />
              <figcaption className="absolute inset-x-0 bottom-0 translate-y-2 bg-gradient-to-t from-foreground/70 to-transparent p-4 font-serif text-lg text-background opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                {photo.caption}
              </figcaption>
            </figure>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card/60 px-6 py-16 text-center">
          <p className="font-serif text-2xl text-foreground">Our photos will live here</p>
          <p className="mt-2 max-w-md text-pretty leading-relaxed text-muted-foreground">
            Add your photos to the <code className="text-xs">/public/photos/</code> folder named{" "}
            <code className="text-xs">us-1.jpg</code> through{" "}
            <code className="text-xs">us-8.jpg</code> and they&apos;ll appear here.
          </p>
        </div>
      )}
    </section>
  )
}
