"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"

interface DeckSettingsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function DeckSettingsDialog({ open, onOpenChange }: DeckSettingsDialogProps) {
  const [deckName, setDeckName] = useState("Japanese Vocabulary")
  const [newCardsPerDay, setNewCardsPerDay] = useState(20)
  const [reviewsPerDay, setReviewsPerDay] = useState(100)
  const [autoPlayAudio, setAutoPlayAudio] = useState(true)
  const [showTimer, setShowTimer] = useState(false)
  const [aiAssistEnabled, setAiAssistEnabled] = useState(true)
  const [learningSteps, setLearningSteps] = useState("1m 10m")
  const [graduatingInterval, setGraduatingInterval] = useState(1)
  const [easyInterval, setEasyInterval] = useState(4)
  const [startingEase, setStartingEase] = useState([250])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Deck Settings</DialogTitle>
          <DialogDescription>
            Configure learning parameters and preferences for this deck.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="general" className="mt-2">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="learning">Learning</TabsTrigger>
            <TabsTrigger value="ai">AI</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="deck-name">Deck Name</Label>
              <Input
                id="deck-name"
                value={deckName}
                onChange={(e) => setDeckName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="new-cards">New Cards per Day</Label>
              <Input
                id="new-cards"
                type="number"
                value={newCardsPerDay}
                onChange={(e) => setNewCardsPerDay(Number(e.target.value))}
                min={0}
                max={999}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="reviews">Maximum Reviews per Day</Label>
              <Input
                id="reviews"
                type="number"
                value={reviewsPerDay}
                onChange={(e) => setReviewsPerDay(Number(e.target.value))}
                min={0}
                max={9999}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="auto-audio">Auto-play Audio</Label>
                <p className="text-xs text-muted-foreground">
                  Automatically play audio when showing cards
                </p>
              </div>
              <Switch
                id="auto-audio"
                checked={autoPlayAudio}
                onCheckedChange={setAutoPlayAudio}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="show-timer">Show Timer</Label>
                <p className="text-xs text-muted-foreground">
                  Display elapsed time during reviews
                </p>
              </div>
              <Switch
                id="show-timer"
                checked={showTimer}
                onCheckedChange={setShowTimer}
              />
            </div>
          </TabsContent>

          <TabsContent value="learning" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="learning-steps">Learning Steps</Label>
              <Input
                id="learning-steps"
                value={learningSteps}
                onChange={(e) => setLearningSteps(e.target.value)}
                placeholder="e.g., 1m 10m 1d"
              />
              <p className="text-xs text-muted-foreground">
                Intervals for cards in the learning phase (m = minutes, d = days)
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="graduating">Graduating Interval (days)</Label>
              <Input
                id="graduating"
                type="number"
                value={graduatingInterval}
                onChange={(e) => setGraduatingInterval(Number(e.target.value))}
                min={1}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="easy">Easy Interval (days)</Label>
              <Input
                id="easy"
                type="number"
                value={easyInterval}
                onChange={(e) => setEasyInterval(Number(e.target.value))}
                min={1}
              />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Starting Ease</Label>
                <span className="text-sm text-muted-foreground tabular-nums">
                  {startingEase[0]}%
                </span>
              </div>
              <Slider
                value={startingEase}
                onValueChange={setStartingEase}
                min={130}
                max={500}
                step={10}
                className="w-full"
              />
              <p className="text-xs text-muted-foreground">
                Initial ease factor for new cards (130% - 500%)
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="order">New Card Order</Label>
              <Select defaultValue="sequential">
                <SelectTrigger id="order">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sequential">Sequential (oldest first)</SelectItem>
                  <SelectItem value="random">Random</SelectItem>
                  <SelectItem value="added">Added date</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </TabsContent>

          <TabsContent value="ai" className="space-y-4 mt-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="ai-assist">AI Card Quality Check</Label>
                <p className="text-xs text-muted-foreground">
                  Automatically evaluate card quality using AI
                </p>
              </div>
              <Switch
                id="ai-assist"
                checked={aiAssistEnabled}
                onCheckedChange={setAiAssistEnabled}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="ai-model">AI Model</Label>
              <Select defaultValue="gpt4">
                <SelectTrigger id="ai-model" disabled={!aiAssistEnabled}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gpt4">GPT-4</SelectItem>
                  <SelectItem value="gpt35">GPT-3.5 Turbo</SelectItem>
                  <SelectItem value="claude">Claude 3</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="ai-check">Auto-check Frequency</Label>
              <Select defaultValue="new" disabled={!aiAssistEnabled}>
                <SelectTrigger id="ai-check">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="new">New cards only</SelectItem>
                  <SelectItem value="all">All cards</SelectItem>
                  <SelectItem value="manual">Manual only</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="rounded-lg border bg-muted/30 p-3">
              <p className="text-xs text-muted-foreground">
                AI will analyze cards for common issues like ambiguity, spelling errors,
                missing context, and suboptimal question formatting. Cards marked as
                &quot;needs review&quot; or &quot;poor&quot; should be edited for better retention.
              </p>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={() => onOpenChange(false)}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
