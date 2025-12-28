"use client"

import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { formatDistanceToNow } from "date-fns"
import { MoreHorizontal } from "lucide-react"

const priorityColors: Record<string, string> = {
    "URGENT": "#ef4444",
    "HIGH": "#f97316",
    "MEDIUM": "#3b82f6",
    "LOW": "#94a3b8",
}

const statusColors: Record<string, string> = {
    "BACKLOG": "#64748b",
    "TODO": "#3b82f6",
    "IN_PROGRESS": "#eab308",
    "IN_REVIEW": "#a855f7",
    "DONE": "#10b981",
}

interface KanbanCardProps {
    task: any
    isOverlay?: boolean
    onEditTask?: (id: string) => void
}

export const KanbanCard = ({ task, isOverlay, onEditTask }: KanbanCardProps) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: task.id })

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    }

    const stripeColor = priorityColors[task.priority] || statusColors[task.status] || "#3b82f6"
    const bgColor = task.color || "#ffffff"
    const isWhite = bgColor === "#ffffff"

    return (
        <div
            ref={setNodeRef}
            style={{ 
                ...style, 
                backgroundColor: isWhite ? undefined : bgColor,
                opacity: isDragging ? 0.6 : 1
            }}
            {...attributes}
            {...listeners}
            onClick={() => onEditTask?.(task.id)}
            className={`p-3 rounded-lg border shadow-sm cursor-grab active:cursor-grabbing transition-all relative overflow-hidden group mb-3 ${isOverlay ? 'rotate-3 shadow-lg' : ''} ${isWhite ? 'bg-card border-border hover:bg-accent/40' : 'border-transparent hover:brightness-105 active:brightness-95'} dark:${isWhite ? 'hover:bg-accent/20' : 'brightness-90 hover:brightness-100'}`}
        >
            <div 
                className={`absolute left-0 top-0 bottom-0 transition-all group-hover:w-1.5 ${isWhite ? 'w-1' : 'w-0.5'}`}
                style={{ backgroundColor: isWhite ? stripeColor : 'rgba(255,255,255,0.4)' }}
            />
            <div className={`flex flex-col gap-y-2 pl-1.5 ${isWhite ? '' : 'text-white'}`}>
                <div className="flex items-start justify-between gap-x-2">
                    <p className={`font-bold text-sm flex-1 ${isWhite ? 'text-foreground' : 'text-white'}`}>{task.title}</p>
                    <button className={`size-5 rounded flex items-center justify-center transition-colors ${isWhite ? 'hover:bg-muted' : 'hover:bg-white/20'}`}>
                        <MoreHorizontal className={`size-3 ${isWhite ? 'text-muted-foreground' : 'text-white'}`} />
                    </button>
                </div>
                
                {task.description && (
                    <p className={`text-xs line-clamp-2 ${isWhite ? 'text-muted-foreground' : 'text-white/80'}`}>{task.description}</p>
                )}

                <div className="flex items-center justify-between mt-1">
                    <div className="flex items-center gap-x-1 text-[10px]">
                        {task.dueDate && (
                            <>
                                <span className={isWhite ? 'text-destructive font-bold' : 'text-white/90 font-bold'}>
                                    {formatDistanceToNow(new Date(task.dueDate), { addSuffix: false })}
                                </span>
                                <span className={isWhite ? 'text-border' : 'text-white/40'}>•</span>
                            </>
                        )}
                        <div className="flex items-center gap-x-1">
                            <div className={`size-3 rounded-sm flex items-center justify-center text-[7px] font-bold ${isWhite ? 'bg-primary text-primary-foreground' : 'bg-white/20 text-white'}`}>
                                {task.project.name.charAt(0)}
                            </div>
                            <span className={`truncate max-w-[80px] font-medium ${isWhite ? 'text-muted-foreground' : 'text-white/80'}`}>{task.project.name}</span>
                        </div>
                    </div>
                    
                    <Avatar className={`size-5 border shadow-sm ${isWhite ? 'border-border' : 'border-white/20'}`}>
                        <AvatarImage src={task.assignee.image || ""} />
                        <AvatarFallback className={`text-[8px] font-bold ${isWhite ? 'bg-muted text-muted-foreground' : 'bg-white/20 text-white'}`}>
                            {task.assignee.name?.charAt(0)}
                        </AvatarFallback>
                    </Avatar>
                </div>
            </div>
        </div>
    )
}
