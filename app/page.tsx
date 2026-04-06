"use client"

import { DeckHeader } from "@/components/deck-header"
import { FlashcardTable } from "@/components/flashcard-table"
import { DeckSettingsDialog } from "@/components/deck-settings-dialog"
import { useState } from "react"

export default function DeckPage() {
  const [settingsOpen, setSettingsOpen] = useState(false)

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <DeckHeader onSettingsClick={() => setSettingsOpen(true)} />
        <FlashcardTable />
        <DeckSettingsDialog open={settingsOpen} onOpenChange={setSettingsOpen} />
      </div>
    </main>
  )
}
