"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { updateTask, deleteTask } from "@/features/tasks/actions"
import { format } from "date-fns"
import { Pencil, Trash2 } from "lucide-react"
import Link from "next/link"

interface TaskDetailClientProps {
    task: any
    users: any[]
    workspaceId: string
}

export const TaskDetailClient = ({ task, users, workspaceId }: TaskDetailClientProps) => {
    const router = useRouter()
    
    const handleDelete = async () => {
        if (confirm("Are you sure you want to delete this task?")) {
            await deleteTask(task.id)
            router.push(`/workspaces/${workspaceId}/tasks`)
            router.refresh()
        }
    }

    const getStatusBadge = (status: string) => {
        const statusColors: Record<string, string> = {
            "BACKLOG": "bg-slate-500 hover:bg-slate-600",
            "TODO": "bg-blue-600 hover:bg-blue-700",
            "IN_PROGRESS": "bg-yellow-500 hover:bg-yellow-600",
            "IN_REVIEW": "bg-purple-500 hover:bg-purple-600",
            "DONE": "bg-emerald-600 hover:bg-emerald-700",
        }
        const labels: Record<string, string> = {
            "BACKLOG": "Backlog",
            "TODO": "Todo",
            "IN_PROGRESS": "In Progress",
            "IN_REVIEW": "In Review",
            "DONE": "Done",
        }
        
        return (
            <Badge className={`${statusColors[status] || statusColors["TODO"]} text-white border-transparent`}>
                {labels[status] || status}
            </Badge>
        )
    }

    return (
        <div className="flex flex-col gap-y-6">
            {/* Breadcrumb */}
            <div className="flex items-center gap-x-2 text-sm text-muted-foreground">
                <Link href={`/workspaces/${workspaceId}/tasks`} className="hover:text-foreground transition-colors">
                    <div className="flex items-center gap-x-2">
                        <div className="size-5 bg-primary rounded text-primary-foreground flex items-center justify-center text-[10px] font-bold">
                            {task.project.name.charAt(0)}
                        </div>
                        <span>{task.project.name}</span>
                    </div>
                </Link>
                <span>/</span>
                <span className="font-semibold text-foreground">{task.title}</span>
            </div>

            {/* Header */}
            <div className="flex items-start justify-between">
                <h1 className="text-3xl font-extrabold tracking-tight text-foreground">{task.title}</h1>
                <Button variant="destructive" size="sm" onClick={handleDelete} className="shadow-sm">
                    <Trash2 className="size-4 mr-2" />
                    Delete Task
                </Button>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {/* Left Column - Overview */}
                <div className="bg-card rounded-xl border border-border p-6 shadow-sm flex flex-col gap-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-bold text-foreground">Overview</h2>
                        <Button variant="ghost" size="sm" className="hover:bg-muted">
                            <Pencil className="size-4 mr-2" />
                            Edit
                        </Button>
                    </div>

                    <Separator className="bg-border" />

                    <div className="flex flex-col gap-y-4">
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-muted-foreground">Assigned to</span>
                            <div className="flex items-center gap-x-2">
                                <Avatar className="size-7 border border-border">
                                    <AvatarImage src={task.assignee.image || ""} />
                                    <AvatarFallback className="text-xs bg-muted text-muted-foreground font-bold">
                                        {task.assignee.name?.charAt(0)}
                                    </AvatarFallback>
                                </Avatar>
                                <span className="text-sm font-semibold text-foreground">{task.assignee.name}</span>
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-muted-foreground">Due Date</span>
                            <span className="text-sm font-bold text-destructive">
                                {task.dueDate ? format(new Date(task.dueDate), "MMMM do, yyyy") : "No date set"}
                            </span>
                        </div>

                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-muted-foreground">Status</span>
                            {getStatusBadge(task.status)}
                        </div>

                        {task.priority && (
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-muted-foreground">Priority</span>
                                <Badge variant="outline" className="border-border text-foreground font-semibold">
                                    {task.priority}
                                </Badge>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Column - Description */}
                <div className="bg-card rounded-xl border border-border p-6 shadow-sm flex flex-col gap-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-bold text-foreground">Description</h2>
                        <Button variant="ghost" size="sm" className="hover:bg-muted">
                            <Pencil className="size-4 mr-2" />
                            Edit
                        </Button>
                    </div>

                    <Separator className="bg-border" />

                    <div className="text-sm leading-relaxed text-muted-foreground bg-muted/30 p-4 rounded-lg border border-border/50">
                        {task.description || "This is a task for " + task.project.name}
                    </div>
                </div>
            </div>
        </div>
    )
}
