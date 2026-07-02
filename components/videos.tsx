"use client"

import { useRef, useState, useEffect } from "react"
import { Film, Volume2, VolumeX, VolumeOff } from "lucide-react"
import { useContent } from "./content-context"

const allVideos: { src: string; caption: string }[] = [
  { src: "/videos/Snapchat-1109714542.mp4", caption: "Us, in motion" },
  { src: "/videos/Snapchat-1198825990.mp4", caption: "Caught mid-laugh" },
  { src: "/videos/Snapchat-1416293601.mp4", caption: "Just being us" },
  { src: "/videos/Snapchat-1712190426.mp4", caption: "Silly little moments" },
  { src: "/videos/Snapchat-1762725773.mp4", caption: "Our kind of fun" },
  { src: "/videos/Snapchat-285810565.mp4", caption: "Never a dull second" },
  { src: "/videos/Snapchat-386119415.mp4", caption: "Forever like this" },
  { src: "/videos/Snapchat-444916219.mp4", caption: "My favorite person" },
  { src: "/videos/Snapchat-460482894.mp4", caption: "Always you and me" },
  { src: "/videos/Snapchat-524881199.mp4", caption: "My favorite view" },
  { src: "/videos/VID-20260701-WA0010.mp4", caption: "Together, always" },
]

export function Videos() {
  const { content } = useContent()
  const videosContent = content.videos || {}
  const [errored, setErrored] = useState<Record<string, boolean>>({})
  const videos = allVideos.filter((v) => !errored[v.src])

  const videoRefs = useRef<(HTMLVideoElement | null)[]>([])
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const [allMuted, setAllMuted] = useState(true)

  useEffect(() => {
    videoRefs.current.forEach((video) => {
      if (video) video.muted = true
    })
  }, [])

  function handleToggleSound(index: number) {
    const video = videoRefs.current[index]
    if (!video) return

    if (activeIndex === index && !video.muted) {
      video.muted = true
      setActiveIndex(null)
      setAllMuted(true)
    } else {
      videoRefs.current.forEach((v, i) => {
        if (v) v.muted = i !== index
      })
      video.muted = false
      video.volume = 1
      void video.play()
      setActiveIndex(index)
      setAllMuted(false)
    }
  }

  function handleMuteAll() {
    videoRefs.current.forEach((video) => {
      if (video) video.muted = true
    })
    setActiveIndex(null)
    setAllMuted(true)
  }

  return (
    <section id="videos" className="mx-auto w-full max-w-6xl px-6 py-20 sm:py-28">
      <div className="mb-12 text-center">
        <p className="mb-3 text-sm uppercase tracking-[0.3em] text-accent-foreground">
          {videosContent.subtitle as string}
        </p>
        <h2 className="text-balance font-serif text-4xl font-semibold text-foreground sm:text-5xl">
          {videosContent.title as string}
        </h2>
        {videos.length > 0 && (
          <p className="mt-3 text-pretty leading-relaxed text-muted-foreground">
            {videosContent.description as string}
          </p>
        )}
      </div>

      {videos.length > 0 ? (
        <>
          <div className="mb-6 flex justify-end">
            <button
              onClick={handleMuteAll}
              disabled={allMuted}
              className="flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-sm text-muted-foreground transition-colors hover:border-primary hover:text-primary disabled:opacity-50 disabled:hover:border-border disabled:hover:text-muted-foreground"
            >
              {allMuted ? (
                <VolumeOff className="h-4 w-4" aria-hidden="true" />
              ) : (
                <VolumeX className="h-4 w-4" aria-hidden="true" />
              )}
              {allMuted ? "All muted" : "Mute all videos"}
            </button>
          </div>

          <div className="grid grid-cols-2 gap-5 sm:grid-cols-3">
            {videos.map((video, index) => {
              const isActive = activeIndex === index
              return (
                <figure
                  key={video.src}
                  className="group relative overflow-hidden rounded-2xl border border-border bg-card shadow-sm"
                >
                  <button
                    type="button"
                    onClick={() => handleToggleSound(index)}
                    className="block w-full cursor-pointer text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    aria-label={isActive ? `Mute ${video.caption}` : `Play ${video.caption} with sound`}
                  >
                    <video
                      ref={(el) => { videoRefs.current[index] = el }}
                      src={video.src}
                      autoPlay
                      muted
                      loop
                      playsInline
                      preload="metadata"
                      className="aspect-[9/16] h-full w-full object-cover"
                      onError={() => setErrored((prev) => ({ ...prev, [video.src]: true }))}
                    />
                    <span className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full bg-foreground/55 text-background backdrop-blur-sm transition-colors group-hover:bg-foreground/70">
                      {isActive ? (
                        <Volume2 className="h-5 w-5" aria-hidden="true" />
                      ) : (
                        <VolumeX className="h-5 w-5" aria-hidden="true" />
                      )}
                    </span>
                  </button>
                  <figcaption className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-foreground/70 to-transparent p-4 font-serif text-lg text-background">
                    {video.caption}
                  </figcaption>
                </figure>
              )
            })}
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card/60 px-6 py-16 text-center">
          <span className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-secondary text-primary">
            <Film className="h-7 w-7" aria-hidden="true" />
          </span>
          <p className="font-serif text-2xl text-foreground">Your clips will live here</p>
          <p className="mt-2 max-w-md text-pretty leading-relaxed text-muted-foreground">
            Add your video clips to the <code className="text-xs">/public/videos/</code> folder named{" "}
            <code className="text-xs">clip-1.mp4</code> through{" "}
            <code className="text-xs">clip-9.mp4</code> and they&apos;ll appear here.
          </p>
        </div>
      )}
    </section>
  )
}
