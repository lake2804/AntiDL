"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { updateTask, deleteTask } from "@/features/tasks/actions"
import { CalendarIcon, Trash2, X } from "lucide-react"
import { format } from "date-fns"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

interface EditTaskModalProps {
    isOpen: boolean
    onClose: () => void
    workspaceId: string
    projects: any[]
    users: any[]
    task: any
}

export const EditTaskModal = ({ isOpen, onClose, workspaceId, projects, users, task }: EditTaskModalProps) => {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [title, setTitle] = useState(task?.title || "")
    const [description, setDescription] = useState(task?.description || "")
    const [status, setStatus] = useState(task?.status || "TODO")
    const [priority, setPriority] = useState(task?.priority || "MEDIUM")
    const [projectId, setProjectId] = useState(task?.projectId || "")
    const [assigneeId, setAssigneeId] = useState(task?.assigneeId || "")
    const [startDate, setStartDate] = useState<Date | undefined>(task?.startDate ? new Date(task.startDate) : undefined)
    const [startTime, setStartTime] = useState(task?.startDate ? format(new Date(task.startDate), "HH:mm") : "09:00")
    const [dueDate, setDueDate] = useState<Date | undefined>(task?.dueDate ? new Date(task.dueDate) : undefined)
    const [endTime, setEndTime] = useState(task?.dueDate ? format(new Date(task.dueDate), "HH:mm") : "10:00")
    const [color, setColor] = useState(task?.color || "#ffffff")

    const colors = [
        { name: "None", value: "#ffffff" },
        { name: "Blue", value: "#3b82f6" },
        { name: "Green", value: "#22c55e" },
        { name: "Yellow", value: "#eab308" },
        { name: "Purple", value: "#a855f7" },
        { name: "Pink", value: "#ec4899" },
        { name: "Orange", value: "#f97316" },
        { name: "Dark Gray", value: "#3c4043" },
        { name: "Slate", value: "#1e293b" },
    ]

    useEffect(() => {
        if (task) {
            setTitle(task.title)
            setDescription(task.description || "")
            setStatus(task.status)
            setPriority(task.priority || "MEDIUM")
            setProjectId(task.projectId)
            setAssigneeId(task.assigneeId)
            setStartDate(task.startDate ? new Date(task.startDate) : undefined)
            setStartTime(task.startDate ? format(new Date(task.startDate), "HH:mm") : "09:00")
            setDueDate(task.dueDate ? new Date(task.dueDate) : undefined)
            setEndTime(task.dueDate ? format(new Date(task.dueDate), "HH:mm") : "10:00")
            setColor(task.color || "#ffffff")
        }
    }, [task])

    const combineDateAndTime = (date: Date | undefined, time: string) => {
        if (!date) return undefined
        const [hours, minutes] = time.split(":").map(Number)
        const combined = new Date(date)
        combined.setHours(hours, minutes, 0, 0)
        return combined
    }

    const handleUpdate = async (updates: any) => {
        if (!task) return
        try {
            await updateTask(task.id, updates)
            router.refresh()
        } catch (error) {
            console.error("Failed to update task:", error)
        }
    }

    const handleDelete = async () => {
        if (!task) return
        if (confirm("Are you sure you want to delete this task?")) {
            setIsLoading(true)
            try {
                await deleteTask(task.id)
                router.refresh()
                onClose()
            } catch (error) {
                console.error("Failed to delete task:", error)
            } finally {
                setIsLoading(false)
            }
        }
    }

    if (!task) return null

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl p-0 overflow-hidden border-border bg-card shadow-2xl rounded-xl">
                <div className="flex h-[85vh]">
                    {/* Left Column: Main Content */}
                    <div className="flex-1 p-8 overflow-y-auto bg-card scrollbar-hide">
                        <DialogHeader className="mb-10">
                            <div className="flex items-center justify-between">
                                <Badge variant="outline" className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground border-border px-2 py-0.5 rounded-sm">
                                    {projects.find(p => p.id === projectId)?.name || "Task"}
                                </Badge>
                                <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full size-8 hover:bg-muted transition-colors">
                                    <X className="size-4" />
                                </Button>
                            </div>
                            <Input
                                value={title}
                                onChange={(e) => {
                                    setTitle(e.target.value)
                                    handleUpdate({ title: e.target.value })
                                }}
                                className="text-4xl font-extrabold border-none px-0 focus-visible:ring-0 h-auto mt-6 bg-transparent text-foreground placeholder:text-muted-foreground/30 transition-all"
                                placeholder="Task title"
                            />
                        </DialogHeader>

                        <div className="space-y-8">
                            <div className="space-y-3">
                                <Label className="text-[14px] font-bold text-foreground flex items-center gap-x-2">
                                    <span className="size-1.5 rounded-full bg-primary" />
                                    Description
                                </Label>
                                <Textarea
                                    value={description}
                                    onChange={(e) => {
                                        setDescription(e.target.value)
                                        handleUpdate({ description: e.target.value })
                                    }}
                                    placeholder="Add more detailed description..."
                                    className="min-h-[300px] resize-none border px-4 py-3 focus-visible:ring-1 focus-visible:ring-primary/20 text-[15px] leading-relaxed bg-muted/20 border-border/50 rounded-xl transition-all"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Sidebar Properties */}
                    <div className="w-[340px] bg-muted/30 border-l border-border p-8 flex flex-col gap-y-8 overflow-y-auto scrollbar-hide">
                        <div className="space-y-8">
                            <div className="space-y-4">
                                <Label className="text-[11px] font-black uppercase text-muted-foreground tracking-widest opacity-80">Properties</Label>
                                <div className="space-y-5 pt-2">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium text-muted-foreground">Assignee</span>
                                        <Select value={assigneeId} onValueChange={(val) => {
                                            setAssigneeId(val)
                                            handleUpdate({ assigneeId: val })
                                        }}>
                                            <SelectTrigger className="w-auto border-none bg-transparent hover:bg-muted h-9 gap-2.5 focus:ring-0 rounded-lg pr-3 transition-colors">
                                                <Avatar className="size-6.5 border border-border shadow-sm">
                                                    <AvatarImage src={users.find(u => u.id === assigneeId)?.image || ""} />
                                                    <AvatarFallback className="text-[10px] font-bold bg-muted text-muted-foreground">
                                                        {users.find(u => u.id === assigneeId)?.name?.charAt(0)}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <SelectValue className="font-semibold text-foreground" />
                                            </SelectTrigger>
                                            <SelectContent className="bg-popover border-border rounded-xl shadow-xl">
                                                {users.map(u => (
                                                    <SelectItem key={u.id} value={u.id} className="cursor-pointer font-medium">
                                                        {u.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium text-muted-foreground">Status</span>
                                        <Select value={status} onValueChange={(val) => {
                                            setStatus(val)
                                            handleUpdate({ status: val })
                                        }}>
                                            <SelectTrigger className="w-auto border-none bg-transparent hover:bg-muted h-8 gap-2 focus:ring-0 px-2 rounded-md transition-colors font-bold text-foreground uppercase text-[11px]">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent className="bg-popover border-border rounded-xl">
                                                <SelectItem value="BACKLOG" className="font-bold">BACKLOG</SelectItem>
                                                <SelectItem value="TODO" className="font-bold">TODO</SelectItem>
                                                <SelectItem value="IN_PROGRESS" className="font-bold">IN PROGRESS</SelectItem>
                                                <SelectItem value="IN_REVIEW" className="font-bold">IN REVIEW</SelectItem>
                                                <SelectItem value="DONE" className="font-bold text-emerald-500">DONE</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium text-muted-foreground">Priority</span>
                                        <Select value={priority} onValueChange={(val) => {
                                            setPriority(val)
                                            handleUpdate({ priority: val })
                                        }}>
                                            <SelectTrigger className="w-auto border-none bg-transparent hover:bg-muted h-8 gap-2 focus:ring-0 px-2 rounded-md transition-colors font-bold text-foreground text-[11px]">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent className="bg-popover border-border rounded-xl">
                                                <SelectItem value="LOW" className="font-bold">LOW</SelectItem>
                                                <SelectItem value="MEDIUM" className="font-bold">MEDIUM</SelectItem>
                                                <SelectItem value="HIGH" className="font-bold text-orange-500">HIGH</SelectItem>
                                                <SelectItem value="URGENT" className="font-bold text-rose-500">URGENT</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="flex flex-col gap-y-4 pt-2">
                                        <span className="text-sm font-medium text-muted-foreground">Theme Color</span>
                                        <div className="flex flex-wrap gap-2.5">
                                            {colors.map((c) => (
                                                <button
                                                    key={c.value}
                                                    type="button"
                                                    onClick={() => {
                                                        setColor(c.value)
                                                        handleUpdate({ color: c.value })
                                                    }}
                                                    className={`size-6 rounded-full border shadow-sm transition-all ${color === c.value ? 'ring-2 ring-primary ring-offset-2 ring-offset-background scale-110' : 'border-border/50 hover:scale-110'}`}
                                                    style={{ backgroundColor: c.value }}
                                                    title={c.name}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <Separator className="bg-border/50" />

                            <div className="space-y-6">
                                <div className="space-y-3">
                                    <Label className="text-[11px] font-black uppercase text-muted-foreground tracking-widest opacity-80">Timeline</Label>
                                    <div className="pt-2 space-y-6">
                                        <div className="flex flex-col gap-y-2">
                                            <span className="text-xs font-bold text-muted-foreground/60 uppercase ml-1">Start</span>
                                            <div className="flex items-center gap-x-2">
                                                <Popover>
                                                    <PopoverTrigger asChild>
                                                        <Button variant="ghost" size="sm" className="h-9 px-3 font-semibold hover:bg-muted bg-muted/50 text-foreground border border-border/50 rounded-lg flex-1">
                                                            {startDate ? format(startDate, "MMM d, yyyy") : "Add date"}
                                                        </Button>
                                                    </PopoverTrigger>
                                                    <PopoverContent className="w-auto p-0 bg-popover border-border shadow-2xl" align="end">
                                                        <Calendar
                                                            mode="single"
                                                            selected={startDate}
                                                            onSelect={(d) => {
                                                                setStartDate(d)
                                                                const combined = combineDateAndTime(d, startTime)
                                                                handleUpdate({ startDate: combined })
                                                            }}
                                                        />
                                                    </PopoverContent>
                                                </Popover>
                                                <Input 
                                                    type="time"
                                                    value={startTime}
                                                    onChange={(e) => {
                                                        setStartTime(e.target.value)
                                                        const combined = combineDateAndTime(startDate, e.target.value)
                                                        if (combined) handleUpdate({ startDate: combined })
                                                    }}
                                                    className="h-9 w-24 border-border/50 bg-muted/50 hover:bg-muted focus-visible:ring-1 focus-visible:ring-primary/20 px-2 text-xs font-bold rounded-lg transition-all"
                                                />
                                            </div>
                                        </div>

                                        <div className="flex flex-col gap-y-2">
                                            <span className="text-xs font-bold text-rose-500/80 uppercase ml-1">Deadline</span>
                                            <div className="flex items-center gap-x-2">
                                                <Popover>
                                                    <PopoverTrigger asChild>
                                                        <Button variant="ghost" size="sm" className="h-9 px-3 font-semibold hover:bg-muted bg-muted/50 text-foreground border border-border/50 rounded-lg flex-1">
                                                            {dueDate ? format(dueDate, "MMM d, yyyy") : "Add deadline"}
                                                        </Button>
                                                    </PopoverTrigger>
                                                    <PopoverContent className="w-auto p-0 bg-popover border-border shadow-2xl" align="end">
                                                        <Calendar
                                                            mode="single"
                                                            selected={dueDate}
                                                            onSelect={(d) => {
                                                                setDueDate(d)
                                                                const combined = combineDateAndTime(d, endTime)
                                                                handleUpdate({ dueDate: combined })
                                                            }}
                                                        />
                                                    </PopoverContent>
                                                </Popover>
                                                <Input 
                                                    type="time"
                                                    value={endTime}
                                                    onChange={(e) => {
                                                        setEndTime(e.target.value)
                                                        const combined = combineDateAndTime(dueDate, e.target.value)
                                                        if (combined) handleUpdate({ dueDate: combined })
                                                    }}
                                                    className="h-9 w-24 border-border/50 bg-muted/50 hover:bg-muted focus-visible:ring-1 focus-visible:ring-primary/20 px-2 text-xs font-bold rounded-lg transition-all"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-auto pt-8">
                            <Button 
                                variant="destructive" 
                                size="sm" 
                                className="w-full justify-center bg-rose-500/10 hover:bg-rose-500 text-rose-500 hover:text-white border border-rose-500/20 shadow-none font-bold h-11 transition-all rounded-xl"
                                onClick={handleDelete}
                                disabled={isLoading}
                            >
                                <Trash2 className="size-4 mr-2" />
                                Delete Task
                            </Button>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
