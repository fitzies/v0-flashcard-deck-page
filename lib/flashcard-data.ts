export type CardType = "basic" | "basic-reversed" | "image-occlusion" | "cloze"

export type CardState = "new" | "learning" | "review" | "relearning" | "suspended" | "buried"

export interface Flashcard {
  id: string
  order: number
  type: CardType
  front: string
  back: string
  state: CardState
  dueDate: Date | null
  stability: number // 0-100 percentage
  aiQuality: "good" | "needs-review" | "poor" | null
  createdAt: Date
  lastReviewed: Date | null
}

export const sampleFlashcards: Flashcard[] = [
  {
    id: "1",
    order: 1,
    type: "basic",
    front: "こんにちは",
    back: "Hello",
    state: "review",
    dueDate: new Date(),
    stability: 92,
    aiQuality: "good",
    createdAt: new Date("2024-01-15"),
    lastReviewed: new Date("2024-04-01"),
  },
  {
    id: "2",
    order: 2,
    type: "basic-reversed",
    front: "Good morning",
    back: "おはようございます",
    state: "learning",
    dueDate: new Date(Date.now() + 1000 * 60 * 10),
    stability: 45,
    aiQuality: "good",
    createdAt: new Date("2024-02-20"),
    lastReviewed: new Date("2024-04-05"),
  },
  {
    id: "3",
    order: 3,
    type: "cloze",
    front: "私は{{c1::りんご}}を食べます",
    back: "I eat an apple",
    state: "new",
    dueDate: null,
    stability: 0,
    aiQuality: null,
    createdAt: new Date("2024-03-10"),
    lastReviewed: null,
  },
  {
    id: "4",
    order: 4,
    type: "image-occlusion",
    front: "[Image: Kanji strokes for 木]",
    back: "Tree (ki)",
    state: "review",
    dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 2),
    stability: 78,
    aiQuality: "needs-review",
    createdAt: new Date("2024-01-28"),
    lastReviewed: new Date("2024-04-03"),
  },
  {
    id: "5",
    order: 5,
    type: "basic",
    front: "ありがとう",
    back: "Thank you",
    state: "review",
    dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 5),
    stability: 95,
    aiQuality: "good",
    createdAt: new Date("2024-01-10"),
    lastReviewed: new Date("2024-04-02"),
  },
  {
    id: "6",
    order: 6,
    type: "cloze",
    front: "{{c1::猫}}が好きです",
    back: "I like cats",
    state: "relearning",
    dueDate: new Date(Date.now() + 1000 * 60 * 5),
    stability: 32,
    aiQuality: "poor",
    createdAt: new Date("2024-02-14"),
    lastReviewed: new Date("2024-04-05"),
  },
  {
    id: "7",
    order: 7,
    type: "basic-reversed",
    front: "Water",
    back: "水 (mizu)",
    state: "suspended",
    dueDate: null,
    stability: 88,
    aiQuality: "good",
    createdAt: new Date("2024-01-20"),
    lastReviewed: new Date("2024-03-28"),
  },
  {
    id: "8",
    order: 8,
    type: "image-occlusion",
    front: "[Image: Hiragana chart section あ-お]",
    back: "a, i, u, e, o",
    state: "review",
    dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
    stability: 99,
    aiQuality: "good",
    createdAt: new Date("2024-01-05"),
    lastReviewed: new Date("2024-04-04"),
  },
  {
    id: "9",
    order: 9,
    type: "basic",
    front: "さようなら",
    back: "Goodbye",
    state: "buried",
    dueDate: null,
    stability: 72,
    aiQuality: "needs-review",
    createdAt: new Date("2024-02-01"),
    lastReviewed: new Date("2024-03-25"),
  },
  {
    id: "10",
    order: 10,
    type: "cloze",
    front: "今日は{{c1::月曜日}}です",
    back: "Today is Monday",
    state: "learning",
    dueDate: new Date(Date.now() + 1000 * 60 * 30),
    stability: 28,
    aiQuality: "good",
    createdAt: new Date("2024-03-20"),
    lastReviewed: new Date("2024-04-05"),
  },
]
