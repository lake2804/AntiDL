"use client"

import { useState } from "react"
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent, PointerSensor, useSensor, useSensors } from "@dnd-kit/core"
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { KanbanColumn } from "./kanban-column"
import { KanbanCard } from "./kanban-card"
import { updateTaskStatus } from "@/features/tasks/actions"
import { useRouter } from "next/navigation"
import { Plus } from "lucide-react"
import { CreateTaskModal } from "./create-task-modal"

interface TaskKanbanProps {
    tasks: any[]
    workspaceId: string
    projects: any[]
    users: any[]
    onAddTask: (values: { status: string }) => void
    onEditTask: (id: string) => void
}

const columns = [
    { id: "BACKLOG", title: "Backlog", count: 0 },
    { id: "TODO", title: "Todo", count: 0 },
    { id: "IN_PROGRESS", title: "In Progress", count: 0 },
    { id: "IN_REVIEW", title: "In Review", count: 0 },
    { id: "DONE", title: "Done", count: 0 },
]

export const TaskKanban = ({ tasks, workspaceId, projects, users, onAddTask, onEditTask }: TaskKanbanProps) => {
    const router = useRouter()
    const [activeId, setActiveId] = useState<string | null>(null)
    
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        })
    )

    const tasksByStatus = tasks.reduce((acc, task) => {
        if (!acc[task.status]) acc[task.status] = []
        acc[task.status].push(task)
        return acc
    }, {} as Record<string, any[]>)

    const handleDragStart = (event: DragStartEvent) => {
        setActiveId(event.active.id as string)
    }

    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event
        setActiveId(null)

        if (!over) return

        const taskId = active.id as string
        const overId = over.id as string

        // Find the task being dragged
        const task = tasks.find(t => t.id === taskId)
        if (!task) return

        // Resolve the new status
        // If overId is a status, use it. If it's a task ID, find that task's status.
        let newStatus = overId
        const isStatus = columns.some(c => c.id === overId)
        
        if (!isStatus) {
            const overTask = tasks.find(t => t.id === overId)
            if (overTask) {
                newStatus = overTask.status
            }
        }

        // Only update if status actually changed
        if (task.status !== newStatus) {
            // Optimistic update
            await updateTaskStatus(taskId, newStatus, task.position)
            router.refresh()
        }
    }

    const handleAddTask = (status: string) => {
        onAddTask({ status })
    }

    const activeTask = activeId ? tasks.find(t => t.id === activeId) : null

    return (
        <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
            <div className="flex gap-x-4 overflow-x-auto pb-4 h-full w-full">
                {columns.map(column => {
                    const columnTasks = tasksByStatus[column.id] || []
                    return (
                        <KanbanColumn
                            key={column.id}
                            id={column.id}
                            title={column.title}
                            count={columnTasks.length}
                        >
                                <SortableContext
                                    items={columnTasks.map((t: any) => t.id)}
                                    strategy={verticalListSortingStrategy}
                                >
                                    <div className="flex flex-col gap-y-2">
                                        {columnTasks.map((task: any) => (
                                            <KanbanCard key={task.id} task={task} onEditTask={onEditTask} />
                                        ))}
                                    </div>
                                </SortableContext>
                            <button 
                                onClick={() => handleAddTask(column.id)}
                                className="w-full p-2 text-sm text-muted-foreground hover:bg-muted rounded-md flex items-center gap-x-2 mt-2 transition-colors border border-transparent hover:border-border/50"
                            >
                                <Plus className="size-4" />
                                Add task
                            </button>
                        </KanbanColumn>
                    )
                })}
            </div>
            <DragOverlay>
                {activeTask && <KanbanCard task={activeTask} isOverlay />}
            </DragOverlay>
        </DndContext>
    )
}
