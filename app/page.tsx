"use client"

import { ContentProvider } from "@/components/content-context"
import { AppWrapper } from "@/components/app-wrapper"

export default function Page() {
  return (
    <ContentProvider>
      <AppWrapper />
    </ContentProvider>
  )
}
