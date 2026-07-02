"use client"

import Image from "next/image"
import { useState } from "react"
import { useContent } from "./content-context"

const photos = [
  { src: "/photo/Snapchat-56070109.jpg", caption: "bahbk ya meemy" },
  { src: "/photo/Snapchat-409129044.jpg", caption: "mbhb4 8erek" },
  { src: "/photo/Snapchat-627390407.jpg", caption: "ya rb atgwzek💍" },
  { src: "/photo/Snapchat-883938423.jpg", caption: "b34\" hlawtek" },
  { src: "/photo/Snapchat-973548843.jpg", caption: "ya khlathoo 3leky🥹" },
  { src: "/photo/Snapchat-996879705.jpg", caption: "aywa ya 8azaal😉👄" },
  { src: "/photo/Snapchat-1077329272.jpg", caption: "7ook4a el kalb😘🦮" },
  { src: "/photo/Snapchat-1137848570.jpg", caption: "ykhrbeet gmalak🥵" },
  { src: "/photo/Snapchat-1391196933.jpg", caption: "ykhrbeet hlawtek😲" },
  { src: "/photo/Snapchat-1415068960.jpg", caption: "a8la ma lya" },
  { src: "/photo/Snapchat-1574178237.jpg", caption: "b34\" kol haga feky" },
  { src: "/photo/Snapchat-1614855115.jpg", caption: "om el 3yal🫶🏻" },
  { src: "/photo/IMG-20260701-WA0005.jpg", caption: "a7la ayam hyaty btb\"a m3aky" },
  { src: "/photo/Snapchat-1797008326.jpg", caption: "mhd4 bywhshny adek bgd" },
  { src: "/photo/Snapchat-1931337413.jpg", caption: "bmoot feky ya meemy😍" },
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
