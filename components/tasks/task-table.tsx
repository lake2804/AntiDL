"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { formatDistanceToNow } from "date-fns"
import { MoreVertical } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { deleteTask, updateTask } from "@/features/tasks/actions"

interface TaskTableProps {
    tasks: any[]
    workspaceId: string
    projects: any[]
    users: any[]
    onEditTask: (id: string) => void
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

export const TaskTable = ({ tasks, workspaceId, projects, users, onEditTask }: TaskTableProps) => {
    const router = useRouter()
    const [selectedTasks, setSelectedTasks] = useState<string[]>([])
    const [statusFilter, setStatusFilter] = useState("all")
    const [assigneeFilter, setAssigneeFilter] = useState("all")
    const [projectFilter, setProjectFilter] = useState("all")

    const filteredTasks = tasks.filter(task => {
        if (statusFilter !== "all" && task.status !== statusFilter) return false
        if (assigneeFilter !== "all" && task.assigneeId !== assigneeFilter) return false
        if (projectFilter !== "all" && task.projectId !== projectFilter) return false
        return true
    })

    const uniqueProjects = Array.from(new Set(tasks.map(t => t.project)))
    const uniqueAssignees = Array.from(new Set(tasks.map(t => t.assignee)))

    const handleDelete = async (taskId: string, e: React.MouseEvent) => {
        e.stopPropagation()
        if (confirm("Are you sure you want to delete this task?")) {
            await deleteTask(taskId)
            router.refresh()
        }
    }

    const handleRowClick = (taskId: string) => {
        onEditTask(taskId)
    }

    return (
        <div className="flex flex-col gap-y-4 bg-card rounded-lg border border-border p-4 transition-colors h-full">
            {/* Filters */}
            <div className="flex items-center gap-x-2">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[150px] bg-background border-border">
                        <SelectValue placeholder="All statuses" />
                    </SelectTrigger>
                    <SelectContent className="bg-popover border-border">
                        <SelectItem value="all">All statuses</SelectItem>
                        <SelectItem value="BACKLOG">Backlog</SelectItem>
                        <SelectItem value="TODO">Todo</SelectItem>
                        <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                        <SelectItem value="IN_REVIEW">In Review</SelectItem>
                        <SelectItem value="DONE">Done</SelectItem>
                    </SelectContent>
                </Select>

                <Select value={assigneeFilter} onValueChange={setAssigneeFilter}>
                    <SelectTrigger className="w-[150px] bg-background border-border">
                        <SelectValue placeholder="All assignees" />
                    </SelectTrigger>
                    <SelectContent className="bg-popover border-border">
                        <SelectItem value="all">All assignees</SelectItem>
                        {users.map((user: any) => (
                            <SelectItem key={user.id} value={user.id}>
                                {user.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <Select value={projectFilter} onValueChange={setProjectFilter}>
                    <SelectTrigger className="w-[150px] bg-background border-border">
                        <SelectValue placeholder="All projects" />
                    </SelectTrigger>
                    <SelectContent className="bg-popover border-border">
                        <SelectItem value="all">All projects</SelectItem>
                        {projects.map((project: any) => (
                            <SelectItem key={project.id} value={project.id}>
                                {project.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {/* Table */}
            <div className="border border-border rounded-md overflow-hidden bg-background flex-1">
                <div className="h-full overflow-y-auto">
                    <Table>
                    <TableHeader className="bg-muted/50">
                        <TableRow className="hover:bg-transparent border-border">
                            <TableHead className="w-12">
                                <Checkbox />
                            </TableHead>
                            <TableHead className="text-muted-foreground font-semibold">Task Name</TableHead>
                            <TableHead className="text-muted-foreground font-semibold">Project</TableHead>
                            <TableHead className="text-muted-foreground font-semibold">Assignee</TableHead>
                            <TableHead className="text-muted-foreground font-semibold">Due Date</TableHead>
                            <TableHead className="text-muted-foreground font-semibold">Status</TableHead>
                            <TableHead className="w-12"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredTasks.map(task => (
                            <TableRow 
                                key={task.id}
                                className={`cursor-pointer hover:bg-muted/50 border-border transition-colors group ${task.status === "DONE" ? "line-through text-muted-foreground/60" : ""}`}
                                onClick={() => handleRowClick(task.id)}
                            >
                                <TableCell onClick={(e) => e.stopPropagation()}>
                                    <Checkbox
                                        checked={task.status === "DONE"}
                                        onCheckedChange={async (checked) => {
                                            const newStatus = checked ? "DONE" : "TODO";
                                            await updateTask(task.id, { status: newStatus });
                                            router.refresh();
                                        }}
                                    />
                                </TableCell>
                                <TableCell className="font-semibold text-inherit">
                                    <div className="flex items-center gap-x-2">
                                        {task.color && task.color !== "#ffffff" && (
                                            <div className="size-2 rounded-full border border-black/10 dark:border-white/20 shadow-sm" style={{ backgroundColor: task.color }} />
                                        )}
                                        {task.title}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-x-2">
                                        <div className="size-5 bg-primary rounded text-primary-foreground flex items-center justify-center text-[10px] font-bold">
                                            {task.project.name.charAt(0)}
                                        </div>
                                        <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">{task.project.name}</span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-x-2">
                                        <Avatar className="size-6 border border-border transition-all">
                                            <AvatarImage src={task.assignee.image || ""} />
                                            <AvatarFallback className="text-[10px] bg-muted text-muted-foreground">
                                                {task.assignee.name?.charAt(0)}
                                            </AvatarFallback>
                                        </Avatar>
                                        <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">{task.assignee.name}</span>
                                    </div>
                                </TableCell>
                                <TableCell className="text-sm text-destructive font-medium">
                                    {task.dueDate ? formatDistanceToNow(new Date(task.dueDate), { addSuffix: false }) : "–"}
                                </TableCell>
                                <TableCell>{getStatusBadge(task.status)}</TableCell>
                                <TableCell onClick={(e) => e.stopPropagation()}>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon" className="hover:bg-muted">
                                                <MoreVertical className="size-4 text-muted-foreground" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="bg-popover border-border">
                                            <DropdownMenuItem onClick={() => handleRowClick(task.id)} className="transition-colors">Edit</DropdownMenuItem>
                                            <DropdownMenuItem 
                                                className="text-destructive focus:text-destructive transition-colors"
                                                onClick={(e) => handleDelete(task.id, e as any)}
                                            >
                                                Delete
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                </div>
            </div>

            {filteredTasks.length === 0 && (
                <div className="text-center py-12 text-muted-foreground border-2 border-dashed border-border rounded-lg">
                    No tasks found matching your filters
                </div>
            )}

            <div className="text-xs text-muted-foreground italic">
                {selectedTasks.length} of {filteredTasks.length} row(s) selected.
            </div>
        </div>
    )
}
