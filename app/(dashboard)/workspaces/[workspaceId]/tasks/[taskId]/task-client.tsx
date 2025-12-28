"use client"

import { format } from "date-fns"
import { ArrowLeft, Calendar, CheckCircle2, MoreVertical, Trash2 } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { deleteTask } from "@/features/tasks/actions"
import { useRouter } from "next/navigation"

interface TaskClientProps {
  initialData: {
    id: string
    title: string
    description: string | null
    status: string
    priority: string
    dueDate: string | null
    createdAt: string
    project: {
        id: string
        name: string
        workspaceId: string
    }
    assignee: {
        id: string
        name: string | null
        image: string | null
    }
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
    
    return (
        <Badge className={`${statusColors[status] || "bg-muted"} text-white border-transparent`}>
            {status}
        </Badge>
    )
}

export const TaskClient = ({ initialData }: TaskClientProps) => {
  const router = useRouter()

  const onDelete = async () => {
    if (!confirm("Are you sure you want to delete this task?")) return
    try {
        await deleteTask(initialData.id)
        router.push(`/workspaces/${initialData.project.workspaceId}/tasks`)
        router.refresh()
    } catch (error) {
        console.error(error)
    }
  }

  return (
    <div className="max-w-4xl mx-auto w-full py-6 flex flex-col gap-y-6">
      <div className="flex items-center gap-x-2">
        <Link href={`/workspaces/${initialData.project.workspaceId}/tasks`}>
            <Button variant="ghost" size="sm" className="gap-x-2">
                <ArrowLeft className="size-4" />
                Back to Tasks
            </Button>
        </Link>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-y-1">
            <div className="flex items-center gap-x-2">
                <h1 className="text-3xl font-bold">{initialData.title}</h1>
                {getStatusBadge(initialData.status)}
            </div>
            <p className="text-muted-foreground">in project <span className="text-primary font-medium">{initialData.project.name}</span></p>
        </div>
        <div className="flex items-center gap-x-2">
            <Button variant="destructive" size="sm" onClick={onDelete}>
                <Trash2 className="size-4 mr-2" />
                Delete Task
            </Button>
            <Button variant="outline" size="icon">
                <MoreVertical className="size-4" />
            </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 flex flex-col gap-y-6">
            <div className="bg-card border border-border rounded-lg p-6">
                <h2 className="text-lg font-semibold mb-4">Description</h2>
                <div className="text-sm text-foreground/80 leading-relaxed whitespace-pre-wrap">
                    {initialData.description || "No description provided."}
                </div>
            </div>

            {/* Placeholder for comments or activity */}
            <div className="bg-card border border-border rounded-lg p-6">
                <h2 className="text-lg font-semibold mb-4">Activity</h2>
                <div className="text-sm text-muted-foreground italic">
                    Task created on {format(new Date(initialData.createdAt), "PPP")}
                </div>
            </div>
        </div>

        <div className="flex flex-col gap-y-6">
            <div className="bg-card border border-border rounded-lg p-6 space-y-4">
                <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Details</h2>
                
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Assignee</span>
                        <div className="flex items-center gap-x-2">
                            <Avatar className="size-6">
                                <AvatarImage src={initialData.assignee.image || ""} />
                                <AvatarFallback className="text-[10px]">
                                    {initialData.assignee.name?.charAt(0)}
                                </AvatarFallback>
                            </Avatar>
                            <span className="text-sm font-medium">{initialData.assignee.name}</span>
                        </div>
                    </div>

                    <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Priority</span>
                        <Badge variant="outline">{initialData.priority || "MEDIUM"}</Badge>
                    </div>

                    <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Due Date</span>
                        <div className="flex items-center gap-x-2 text-sm">
                            <Calendar className="size-4 text-muted-foreground" />
                            <span>{initialData.dueDate ? format(new Date(initialData.dueDate), "PPP") : "No due date"}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  )
}
