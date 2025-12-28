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
import { createTask } from "@/features/tasks/actions"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

interface CreateTaskModalProps {
    isOpen: boolean
    onClose: () => void
    workspaceId: string
    projects: any[]
    users: any[]
    initialValues?: {
        status?: string
        startDate?: Date
        dueDate?: Date
    }
}

export const CreateTaskModal = ({ isOpen, onClose, workspaceId, projects, users, initialValues }: CreateTaskModalProps) => {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [status, setStatus] = useState(initialValues?.status || "TODO")
    const [priority, setPriority] = useState("MEDIUM")
    const [projectId, setProjectId] = useState("")
    const [assigneeId, setAssigneeId] = useState("")
    const [startDate, setStartDate] = useState<Date | undefined>(initialValues?.startDate)
    const [startTime, setStartTime] = useState(initialValues?.startDate ? format(initialValues.startDate, "HH:mm") : "09:00")
    const [dueDate, setDueDate] = useState<Date | undefined>(initialValues?.dueDate)
    const [endTime, setEndTime] = useState(initialValues?.dueDate ? format(initialValues.dueDate, "10:00") : "10:00")
    const [color, setColor] = useState("#ffffff")

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

    // Sync state when initialValues change or modal opens
    useEffect(() => {
        if (isOpen) {
            setStatus(initialValues?.status || "TODO")
            setStartDate(initialValues?.startDate)
            setStartTime(initialValues?.startDate ? format(initialValues.startDate, "HH:mm") : "09:00")
            setDueDate(initialValues?.dueDate)
            setEndTime(initialValues?.dueDate ? format(initialValues.dueDate, "HH:mm") : "10:00")
        }
    }, [isOpen, initialValues])

    const combineDateAndTime = (date: Date | undefined, time: string) => {
        if (!date) return undefined
        const [hours, minutes] = time.split(":").map(Number)
        const combined = new Date(date)
        combined.setHours(hours, minutes, 0, 0)
        return combined
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!title || !projectId || !assigneeId) return

        const finalStartDate = combineDateAndTime(startDate, startTime)
        const finalDueDate = combineDateAndTime(dueDate, endTime)

        setIsLoading(true)
        try {
            await createTask({
                title,
                description,
                status,
                priority,
                projectId,
                assigneeId,
                startDate: finalStartDate,
                dueDate: finalDueDate,
                color
            })
            router.refresh()
            onClose()
            // Reset form
            setTitle("")
            setDescription("")
            setPriority("MEDIUM")
            setProjectId("")
            setAssigneeId("")
            setStartTime("09:00")
            setEndTime("10:00")
        } catch (error) {
            console.error("Failed to create task:", error)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-lg p-0 overflow-hidden border-border bg-card shadow-2xl rounded-xl">
                <div className="p-7">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-bold text-foreground">
                            Create a new task
                        </DialogTitle>
                    </DialogHeader>
                </div>
                
                <div className="px-7 pb-7">
                    <div className="border-t border-dashed border-border mb-8" />
                    
                    <form onSubmit={handleSubmit} className="space-y-7">
                        <div className="space-y-2.5">
                            <Label htmlFor="title" className="text-[14px] font-semibold text-muted-foreground">
                                Task Name
                            </Label>
                            <Input
                                id="title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Enter task name"
                                required
                                className="h-12 bg-background border-border focus:border-primary focus:ring-0 rounded-lg transition-all placeholder:text-muted-foreground/60"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2.5">
                                <Label className="text-[14px] font-semibold text-muted-foreground">
                                    Start Date & Time
                                </Label>
                                <div className="flex flex-col gap-y-2">
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button 
                                                variant="outline" 
                                                className="w-full h-12 justify-start text-left font-normal border-border rounded-lg hover:bg-muted transition-all"
                                            >
                                                <CalendarIcon className="mr-2.5 h-4 w-4 text-muted-foreground" />
                                                {startDate ? (
                                                    <span className="text-foreground">{format(startDate, "PPP")}</span>
                                                ) : (
                                                    <span className="text-muted-foreground/60">Select date</span>
                                                )}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0 bg-popover border-border" align="start">
                                            <Calendar
                                                mode="single"
                                                selected={startDate}
                                                onSelect={setStartDate}
                                                initialFocus
                                            />
                                        </PopoverContent>
                                    </Popover>
                                    <Input 
                                        type="time"
                                        value={startTime}
                                        onChange={(e) => setStartTime(e.target.value)}
                                        className="h-12 bg-background border-border rounded-lg focus:border-primary focus:ring-0 transition-all"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2.5">
                                <Label className="text-[14px] font-semibold text-muted-foreground">
                                    Due Date & Time
                                </Label>
                                <div className="flex flex-col gap-y-2">
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button 
                                                variant="outline" 
                                                className="w-full h-12 justify-start text-left font-normal border-border rounded-lg hover:bg-muted transition-all"
                                            >
                                                <CalendarIcon className="mr-2.5 h-4 w-4 text-muted-foreground" />
                                                {dueDate ? (
                                                    <span className="text-foreground">{format(dueDate, "PPP")}</span>
                                                ) : (
                                                    <span className="text-muted-foreground/60">Select date</span>
                                                )}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0 bg-popover border-border" align="start">
                                            <Calendar
                                                mode="single"
                                                selected={dueDate}
                                                onSelect={setDueDate}
                                                initialFocus
                                            />
                                        </PopoverContent>
                                    </Popover>
                                    <Input 
                                        type="time"
                                        value={endTime}
                                        onChange={(e) => setEndTime(e.target.value)}
                                        className="h-12 bg-background border-border rounded-lg focus:border-primary focus:ring-0 transition-all"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2.5">
                            <Label htmlFor="assignee" className="text-[14px] font-semibold text-muted-foreground">
                                Assignee
                            </Label>
                            <Select value={assigneeId} onValueChange={setAssigneeId} required>
                                <SelectTrigger className="h-12 bg-background border-border rounded-lg focus:ring-0 transition-all text-foreground">
                                    <SelectValue placeholder="Select assignee" />
                                </SelectTrigger>
                                <SelectContent className="rounded-xl shadow-xl border-border bg-popover">
                                    {users.map(user => (
                                        <SelectItem key={user.id} value={user.id} className="cursor-pointer py-2.5">
                                            <div className="flex items-center gap-x-2.5">
                                                <Avatar className="size-6">
                                                    <AvatarImage src={user.image || ""} />
                                                    <AvatarFallback className="text-[10px] bg-muted">
                                                        {user.name?.charAt(0)}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <span className="text-[14px] font-medium">{user.name}</span>
                                            </div>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2.5">
                            <Label htmlFor="status" className="text-[14px] font-semibold text-muted-foreground">
                                Status
                            </Label>
                            <Select value={status} onValueChange={setStatus}>
                                <SelectTrigger className="h-12 bg-background border-border rounded-lg focus:ring-0 transition-all text-foreground">
                                    <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent className="rounded-xl shadow-xl border-border bg-popover">
                                    <SelectItem value="BACKLOG" className="cursor-pointer py-2.5">Backlog</SelectItem>
                                    <SelectItem value="TODO" className="cursor-pointer py-2.5">Todo</SelectItem>
                                    <SelectItem value="IN_PROGRESS" className="cursor-pointer py-2.5">In Progress</SelectItem>
                                    <SelectItem value="IN_REVIEW" className="cursor-pointer py-2.5">In Review</SelectItem>
                                    <SelectItem value="DONE" className="cursor-pointer py-2.5">Done</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2.5">
                            <Label htmlFor="project" className="text-[14px] font-semibold text-muted-foreground">
                                Project
                            </Label>
                            <Select value={projectId} onValueChange={setProjectId} required>
                                <SelectTrigger className="h-12 bg-background border-border rounded-lg focus:ring-0 transition-all text-foreground">
                                    <SelectValue placeholder="Select project" />
                                </SelectTrigger>
                                <SelectContent className="rounded-xl shadow-xl border-border bg-popover">
                                    {projects.map(project => (
                                        <SelectItem key={project.id} value={project.id} className="cursor-pointer py-2.5">
                                            <div className="flex items-center gap-x-2.5">
                                                <div className="size-6 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-[10px] font-bold">
                                                    {project.name.charAt(0)}
                                                </div>
                                                <span className="text-[14px] font-medium">{project.name}</span>
                                            </div>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-3">
                            <Label className="text-[14px] font-semibold text-muted-foreground">
                                Task Theme Color
                            </Label>
                            <div className="flex flex-wrap gap-3">
                                {colors.map((c) => (
                                    <button
                                        key={c.value}
                                        type="button"
                                        onClick={() => setColor(c.value)}
                                        className={`size-8 rounded-full border-2 transition-all ${color === c.value ? 'border-primary rotate-0 scale-110 shadow-md' : 'border-transparent hover:scale-105'}`}
                                        style={{ backgroundColor: c.value }}
                                        title={c.name}
                                    />
                                ))}
                            </div>
                        </div>

                        <div className="pt-4">
                            <div className="border-t border-dashed border-border mb-8" />
                            <div className="flex items-center justify-between">
                                <Button 
                                    type="button" 
                                    variant="ghost" 
                                    onClick={onClose}
                                    className="px-10 h-12 text-muted-foreground hover:bg-muted hover:text-foreground font-medium rounded-lg transition-all"
                                >
                                    Cancel
                                </Button>
                                <Button 
                                    type="submit" 
                                    disabled={isLoading}
                                    className="px-10 h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-lg shadow-lg shadow-primary/20 transition-all"
                                >
                                    {isLoading ? "Creating..." : "Create Task"}
                                </Button>
                            </div>
                        </div>
                    </form>
                </div>
            </DialogContent>
        </Dialog>
    )
}
