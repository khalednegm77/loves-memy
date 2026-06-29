"use client"

import { useState } from "react"
import { X, Save, Settings } from "lucide-react"
import { useContent } from "./content-context"
import { useAuth } from "./auth-context"
import { supabase } from "@/lib/supabase-client"

export function ContentEditorButton() {
  const { user } = useAuth()
  const [isOpen, setIsOpen] = useState(false)

  if (!user) return null

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-20 right-6 flex h-12 w-12 items-center justify-center rounded-full bg-card shadow-lg border border-border text-foreground transition-transform hover:scale-110"
        aria-label="Edit site content"
      >
        <Settings className="h-5 w-5" />
      </button>

      <ContentEditorModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  )
}

type ContentEditorModalProps = {
  isOpen: boolean
  onClose: () => void
}

function ContentEditorModal({ isOpen, onClose }: ContentEditorModalProps) {
  const { content, refreshContent } = useContent()
  const [editingKey, setEditingKey] = useState<string | null>(null)
  const [editValue, setEditValue] = useState<string>("")
  const [saving, setSaving] = useState(false)

  if (!isOpen) return null

  const handleEdit = (section: string, key: string, currentValue: unknown) => {
    setEditingKey(`${section}.${key}`)
    setEditValue(typeof currentValue === "string" ? currentValue : JSON.stringify(currentValue, null, 2))
  }

  const handleSave = async () => {
    if (!editingKey) return

    const [section, key] = editingKey.split(".")
    setSaving(true)

    try {
      const currentSection = content[section] || {}
      let parsedValue: unknown

      try {
        parsedValue = JSON.parse(editValue)
      } catch {
        parsedValue = editValue
      }

      const updatedContent = { ...currentSection, [key]: parsedValue }

      const { error } = await supabase
        .from("site_content")
        .upsert({ section, content: updatedContent }, { onConflict: "section" })

      if (error) throw error

      await refreshContent()
      setEditingKey(null)
    } catch (err) {
      console.error("Failed to save:", err)
      alert("Failed to save changes")
    } finally {
      setSaving(false)
    }
  }

  const sections = [
    { key: "hero", label: "Hero Section" },
    { key: "counter", label: "Love Counter" },
    { key: "gallery", label: "Gallery" },
    { key: "videos", label: "Videos" },
    { key: "reasons", label: "Reasons I Love You" },
    { key: "closing", label: "Closing" },
  ]

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-background/80 backdrop-blur-sm">
      <div className="mx-auto max-w-4xl p-6 pb-20">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="font-serif text-2xl font-semibold">Edit Site Content</h2>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-6">
          {sections.map(({ key, label }) => {
            const sectionContent = content[key]
            if (!sectionContent) return null

            return (
              <div key={key} className="rounded-xl border border-border bg-card p-5">
                <h3 className="mb-4 font-serif text-lg font-medium">{label}</h3>
                <div className="space-y-3">
                  {Object.entries(sectionContent).map(([itemKey, value]) => {
                    const fullKey = `${key}.${itemKey}`
                    const isEditing = editingKey === fullKey

                    return (
                      <div key={itemKey} className="space-y-1">
                        <label className="text-sm font-medium text-muted-foreground">
                          {itemKey}
                        </label>
                        {isEditing ? (
                          <div className="flex gap-2">
                            <textarea
                              value={editValue}
                              onChange={(e) => setEditValue(e.target.value)}
                              className="min-h-[100px] w-full rounded-lg border border-input bg-background p-3 text-sm focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/20"
                            />
                            <div className="flex flex-col gap-2">
                              <button
                                onClick={handleSave}
                                disabled={saving}
                                className="rounded-lg bg-primary p-2 text-primary-foreground hover:opacity-90 disabled:opacity-50"
                              >
                                <Save className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => setEditingKey(null)}
                                className="rounded-lg bg-muted p-2 text-foreground hover:bg-secondary"
                              >
                                <X className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        ) : (
                          <button
                            onClick={() => handleEdit(key, itemKey, value)}
                            className="w-full rounded-lg border border-input bg-background p-3 text-left text-sm hover:border-ring focus:outline-none focus:ring-2 focus:ring-ring/20"
                          >
                            {typeof value === "string" ? value : JSON.stringify(value, null, 2)}
                          </button>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
