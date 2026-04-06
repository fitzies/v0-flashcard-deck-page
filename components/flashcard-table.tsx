"use client"

import { useState, useMemo } from "react"
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
  type ColumnDef,
  type SortingState,
} from "@tanstack/react-table"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import {
  GripVertical,
  MoreHorizontal,
  ArrowUpDown,
  Search,
  Sparkles,
  AlertCircle,
  XCircle,
  Image,
  RotateCcw,
  FileText,
  Brackets,
  Edit,
  Trash2,
  Copy,
  Eye,
} from "lucide-react"
import { type Flashcard, type CardType, type CardState, sampleFlashcards } from "@/lib/flashcard-data"
import { cn } from "@/lib/utils"

const cardTypeIcons: Record<CardType, React.ReactNode> = {
  basic: <FileText className="size-3.5" />,
  "basic-reversed": <RotateCcw className="size-3.5" />,
  "image-occlusion": <Image className="size-3.5" />,
  cloze: <Brackets className="size-3.5" />,
}

const cardTypeLabels: Record<CardType, string> = {
  basic: "Basic",
  "basic-reversed": "Basic (Reversed)",
  "image-occlusion": "Image Occlusion",
  cloze: "Cloze",
}

const stateStyles: Record<CardState, { bg: string; text: string; label: string }> = {
  new: { bg: "bg-muted", text: "text-muted-foreground", label: "New" },
  learning: { bg: "bg-warning/15", text: "text-warning", label: "Learning" },
  review: { bg: "bg-success/15", text: "text-success", label: "Review" },
  relearning: { bg: "bg-warning/15", text: "text-warning", label: "Relearning" },
  suspended: { bg: "bg-muted", text: "text-muted-foreground", label: "Suspended" },
  buried: { bg: "bg-muted", text: "text-muted-foreground", label: "Buried" },
}

function formatDueDate(date: Date | null): string {
  if (!date) return "—"
  const now = new Date()
  const diff = date.getTime() - now.getTime()
  
  if (diff < 0) return "Overdue"
  if (diff < 1000 * 60 * 60) {
    const minutes = Math.round(diff / (1000 * 60))
    return `${minutes}m`
  }
  if (diff < 1000 * 60 * 60 * 24) {
    const hours = Math.round(diff / (1000 * 60 * 60))
    return `${hours}h`
  }
  const days = Math.round(diff / (1000 * 60 * 60 * 24))
  return `${days}d`
}

function AIQualityBadge({ quality }: { quality: Flashcard["aiQuality"] }) {
  if (!quality) return <span className="text-muted-foreground">—</span>
  
  const styles = {
    good: { icon: <Sparkles className="size-3" />, className: "bg-success/15 text-success border-success/20" },
    "needs-review": { icon: <AlertCircle className="size-3" />, className: "bg-warning/15 text-warning border-warning/20" },
    poor: { icon: <XCircle className="size-3" />, className: "bg-destructive/15 text-destructive border-destructive/20" },
  }
  
  const style = styles[quality]
  
  return (
    <Badge variant="outline" className={cn("gap-1 text-xs capitalize", style.className)}>
      {style.icon}
      {quality === "needs-review" ? "Review" : quality}
    </Badge>
  )
}

function StabilityBar({ value }: { value: number }) {
  const getColor = (v: number) => {
    if (v >= 80) return "bg-success"
    if (v >= 50) return "bg-warning"
    return "bg-destructive"
  }
  
  return (
    <div className="flex items-center gap-2">
      <div className="h-1.5 w-16 rounded-full bg-muted">
        <div
          className={cn("h-full rounded-full transition-all", getColor(value))}
          style={{ width: `${value}%` }}
        />
      </div>
      <span className="text-xs text-muted-foreground tabular-nums">{value}%</span>
    </div>
  )
}

export function FlashcardTable() {
  const [data, setData] = useState<Flashcard[]>(sampleFlashcards)
  const [sorting, setSorting] = useState<SortingState>([])
  const [globalFilter, setGlobalFilter] = useState("")
  const [draggedRow, setDraggedRow] = useState<string | null>(null)

  const columns = useMemo<ColumnDef<Flashcard>[]>(
    () => [
      {
        id: "drag",
        header: () => null,
        cell: ({ row }) => (
          <div
            className="cursor-grab touch-none p-1 text-muted-foreground hover:text-foreground active:cursor-grabbing"
            draggable
            onDragStart={() => setDraggedRow(row.original.id)}
            onDragEnd={() => setDraggedRow(null)}
          >
            <GripVertical className="size-4" />
          </div>
        ),
        size: 40,
        enableSorting: false,
      },
      {
        accessorKey: "order",
        header: ({ column }) => (
          <Button
            variant="ghost"
            size="sm"
            className="-ml-3 h-8 data-[state=open]:bg-accent"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            #
            <ArrowUpDown className="ml-1 size-3" />
          </Button>
        ),
        cell: ({ row }) => (
          <span className="text-muted-foreground tabular-nums">{row.original.order}</span>
        ),
        size: 60,
      },
      {
        accessorKey: "type",
        header: "Type",
        cell: ({ row }) => (
          <div className="flex items-center gap-2 text-muted-foreground">
            {cardTypeIcons[row.original.type]}
            <span className="text-xs">{cardTypeLabels[row.original.type]}</span>
          </div>
        ),
        size: 140,
      },
      {
        accessorKey: "front",
        header: "Front",
        cell: ({ row }) => (
          <div className="max-w-[200px] truncate font-medium" title={row.original.front}>
            {row.original.front}
          </div>
        ),
        size: 200,
      },
      {
        accessorKey: "back",
        header: "Back",
        cell: ({ row }) => (
          <div className="max-w-[200px] truncate text-muted-foreground" title={row.original.back}>
            {row.original.back}
          </div>
        ),
        size: 200,
      },
      {
        accessorKey: "state",
        header: "State",
        cell: ({ row }) => {
          const style = stateStyles[row.original.state]
          return (
            <Badge variant="secondary" className={cn("text-xs", style.bg, style.text)}>
              {style.label}
            </Badge>
          )
        },
        size: 100,
      },
      {
        accessorKey: "dueDate",
        header: ({ column }) => (
          <Button
            variant="ghost"
            size="sm"
            className="-ml-3 h-8 data-[state=open]:bg-accent"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Due
            <ArrowUpDown className="ml-1 size-3" />
          </Button>
        ),
        cell: ({ row }) => {
          const due = formatDueDate(row.original.dueDate)
          const isOverdue = due === "Overdue"
          return (
            <span className={cn("text-sm tabular-nums", isOverdue && "text-destructive font-medium")}>
              {due}
            </span>
          )
        },
        size: 80,
        sortingFn: (rowA, rowB) => {
          const a = rowA.original.dueDate?.getTime() ?? Infinity
          const b = rowB.original.dueDate?.getTime() ?? Infinity
          return a - b
        },
      },
      {
        accessorKey: "stability",
        header: ({ column }) => (
          <Button
            variant="ghost"
            size="sm"
            className="-ml-3 h-8 data-[state=open]:bg-accent"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Stability
            <ArrowUpDown className="ml-1 size-3" />
          </Button>
        ),
        cell: ({ row }) => <StabilityBar value={row.original.stability} />,
        size: 120,
      },
      {
        accessorKey: "aiQuality",
        header: "AI Quality",
        cell: ({ row }) => <AIQualityBadge quality={row.original.aiQuality} />,
        size: 100,
      },
      {
        id: "actions",
        header: () => null,
        cell: ({ row }) => (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon-sm" className="text-muted-foreground">
                <MoreHorizontal className="size-4" />
                <span className="sr-only">Actions</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuItem>
                <Eye className="mr-2 size-4" />
                Preview
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Edit className="mr-2 size-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Copy className="mr-2 size-4" />
                Duplicate
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem variant="destructive">
                <Trash2 className="mr-2 size-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ),
        size: 50,
      },
    ],
    []
  )

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      globalFilter,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    globalFilterFn: "includesString",
  })

  const handleDragOver = (e: React.DragEvent, targetId: string) => {
    e.preventDefault()
    if (!draggedRow || draggedRow === targetId) return
    
    const draggedIndex = data.findIndex((d) => d.id === draggedRow)
    const targetIndex = data.findIndex((d) => d.id === targetId)
    
    if (draggedIndex === -1 || targetIndex === -1) return
    
    const newData = [...data]
    const [removed] = newData.splice(draggedIndex, 1)
    newData.splice(targetIndex, 0, removed)
    
    // Update order numbers
    const reordered = newData.map((item, index) => ({
      ...item,
      order: index + 1,
    }))
    
    setData(reordered)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search cards..."
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="text-sm text-muted-foreground">
          {table.getFilteredRowModel().rows.length} cards
        </div>
      </div>

      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="hover:bg-transparent">
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    style={{ width: header.getSize() }}
                    className="bg-muted/30"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className={cn(
                    "transition-colors",
                    draggedRow === row.original.id && "opacity-50 bg-accent"
                  )}
                  onDragOver={(e) => handleDragOver(e, row.original.id)}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center text-muted-foreground">
                  No cards found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
