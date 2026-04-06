"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Settings, Plus, Play } from "lucide-react"

interface DeckHeaderProps {
  onSettingsClick: () => void
}

export function DeckHeader({ onSettingsClick }: DeckHeaderProps) {
  return (
    <div className="mb-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-semibold text-foreground">Japanese Vocabulary</h1>
          <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
            248 cards
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-2">
            <Plus className="size-4" />
            Add Card
          </Button>
          <Button size="sm" className="gap-2">
            <Play className="size-4" />
            Study Now
          </Button>
          <Button variant="ghost" size="icon-sm" onClick={onSettingsClick}>
            <Settings className="size-4" />
            <span className="sr-only">Deck Settings</span>
          </Button>
        </div>
      </div>
      
      <div className="mt-4 flex flex-wrap gap-4 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <span className="size-2 rounded-full bg-success" />
          <span>42 due today</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="size-2 rounded-full bg-warning" />
          <span>12 learning</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="size-2 rounded-full bg-info" />
          <span>194 mature</span>
        </div>
      </div>
    </div>
  )
}
