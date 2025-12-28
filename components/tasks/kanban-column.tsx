"use client"

import { useDroppable } from "@dnd-kit/core"
import { Plus } from "lucide-react"

interface KanbanColumnProps {
    id: string
    title: string
    count: number
    children: React.ReactNode
}

export const KanbanColumn = ({ id, title, count, children }: KanbanColumnProps) => {
    const { setNodeRef } = useDroppable({ id })

    return (
        <div
            ref={setNodeRef}
            className="flex flex-col flex-1 min-w-[200px] bg-muted/30 border border-border/50 rounded-xl p-4 h-full transition-all"
        >
            <div className="flex items-center justify-between mb-4 px-1">
                <div className="flex items-center gap-x-3">
                    <div className="size-2.5 rounded-full bg-muted-foreground/30" />
                    <h3 className="font-bold text-[15px] text-foreground/90">{title}</h3>
                    <span className="flex items-center justify-center h-5 px-1.5 rounded-full bg-muted border border-border/50 text-[10px] font-bold text-muted-foreground">
                        {count}
                    </span>
                </div>
                <button className="size-8 rounded-lg hover:bg-muted/80 flex items-center justify-center transition-colors text-muted-foreground hover:text-foreground">
                    <Plus className="size-5" />
                </button>
            </div>
            <div className="flex-1 overflow-y-auto">
                {children}
            </div>
        </div>
    )
}
