"use client"

import { useState, useMemo, useCallback } from "react"
import { Calendar, dateFnsLocalizer, View } from "react-big-calendar"
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop"
import { format, parse, startOfWeek, getDay, addMinutes } from "date-fns"
import { enUS } from "date-fns/locale"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { updateTask } from "@/features/tasks/actions"
import { useRouter } from "next/navigation"

import "react-big-calendar/lib/addons/dragAndDrop/styles.css"
import "react-big-calendar/lib/css/react-big-calendar.css"
import "./calendar.css"

const DnDCalendar = withDragAndDrop(Calendar)

interface TaskCalendarProps {
    tasks: any[]
    workspaceId: string
    onAddTask: (values: { startDate: Date; dueDate: Date }) => void
    onEditTask: (id: string) => void
}

const locales = {
    "en-US": enUS,
}

const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek,
    getDay,
    locales,
})

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

const customFormats = {
    timeGutterFormat: (date: Date, culture: any, localizer: any) => {
        const hours = date.getHours()
        const minutes = date.getMinutes()
        if (hours === 0 && minutes === 0) {
            return "0:00 AM"
        }
        return localizer.format(date, "h:mm a", culture)
    }
}

const EventComponent = ({ event }: any) => {
    const task = event.resource
    const priorityColors: Record<string, string> = {
        "URGENT": "#ea4335", // Google Red
        "HIGH": "#fbbc04",   // Google Yellow/Orange
        "MEDIUM": "#1a73e8", // Google Blue
        "LOW": "#9aa0a6",    // Google Gray
    }
    const statusColors: Record<string, string> = {
        "BACKLOG": "#70757a",
        "TODO": "#1a73e8",
        "IN_PROGRESS": "#f9ab00",
        "IN_REVIEW": "#a142f4",
        "DONE": "#1e8e3e",
    }

    const stripeColor = statusColors[task.status] || priorityColors[task.priority] || "#1a73e8"
    const bodyColor = task.color || "#ffffff"
    const isWhite = bodyColor.toLowerCase() === "#ffffff" || bodyColor.toLowerCase() === "#fff" || bodyColor.toLowerCase() === "white"
    
    // In dark mode, if the body is white, we make it slightly off-white to reduce glare 
    // but keep it "solid" as requested.
    const isDarkGlobal = document.documentElement.classList.contains('dark')
    const finalBodyColor = isWhite && isDarkGlobal ? "#e8eaed" : bodyColor

    // Determine text color based on background brightness
    // For simplicity, if it's white/light, use dark text. Otherwise white.
    const textColor = isWhite ? 'text-slate-900' : 'text-white'
    const mutedTextColor = isWhite ? 'text-slate-500' : 'text-white/80'

    return (
        <div 
            className={`flex flex-col gap-y-0.5 p-1.5 rounded-md shadow-sm h-full overflow-hidden transition-all hover:brightness-105 active:scale-[0.98] relative group ${isWhite ? 'border border-slate-200' : 'border-none'}`}
            style={{ 
                backgroundColor: finalBodyColor,
            }}
        >
            {/* The Priority/Status Stripe */}
            <div 
                className="absolute left-0 top-0 bottom-0 w-1.5 transition-all group-hover:w-2"
                style={{ backgroundColor: stripeColor }}
            />
            
            <div className="flex flex-col gap-y-0.5 pl-2 overflow-hidden relative z-10">
                <p className={`text-[11px] font-bold leading-tight truncate ${textColor}`}>
                    {task.title}
                </p>
                <div className="flex items-center gap-x-1">
                    <span className={`text-[9px] font-medium truncate ${mutedTextColor}`}>
                        {format(new Date(event.start), "h:mm a")}
                    </span>
                    <span className={`text-[9px] ${isWhite ? 'text-slate-300' : 'text-white/30'}`}>•</span>
                    <span className={`text-[9px] font-medium truncate ${mutedTextColor}`}>
                        {task.project?.name || "No Project"}
                    </span>
                </div>
            </div>
            
            <div className="absolute right-1 bottom-1 opacity-0 group-hover:opacity-100 transition-opacity z-20">
                <Avatar className={`size-4 border shadow-sm ${isWhite ? 'border-slate-200' : 'border-white/20'}`}>
                    <AvatarImage src={task.assignee?.image || ""} />
                    <AvatarFallback className={`text-[6px] font-bold ${isWhite ? 'bg-slate-100 text-slate-500' : 'bg-white/20 text-white'}`}>
                        {task.assignee?.name?.charAt(0) || "U"}
                    </AvatarFallback>
                </Avatar>
            </div>
        </div>
    )
}

interface CalendarEvent {
    id: string
    title: string
    start: Date
    end: Date
    resource: any
}

export const TaskCalendar = ({ tasks, workspaceId, onAddTask, onEditTask }: TaskCalendarProps) => {
    const router = useRouter()
    const [view, setView] = useState<View>("week")
    const [date, setDate] = useState(new Date())

    const events = useMemo((): CalendarEvent[] => {
        return tasks
            .filter((task: any) => task.dueDate)
            .map((task: any) => ({
                id: task.id,
                title: task.title,
                start: new Date(task.startDate || task.dueDate),
                end: new Date(task.dueDate),
                resource: task,
            }))
    }, [tasks])

    const handleEventDrop = useCallback(async ({ event, start, end }: any) => {
        try {
            await updateTask(event.id, {
                startDate: new Date(start),
                dueDate: new Date(end),
            })
            router.refresh()
        } catch (error) {
            console.error("Failed to update task sequence", error)
        }
    }, [router])

    const handleSelectEvent = useCallback((event: any) => {
        onEditTask(event.id)
    }, [onEditTask])

    const handleSelectSlot = useCallback(({ start, end }: { start: Date; end: Date }) => {
        onAddTask({ startDate: start, dueDate: end })
    }, [onAddTask])

    return (
        <div className="flex-1 bg-transparent relative overflow-hidden">
            <DnDCalendar
                localizer={localizer}
                events={events}
                startAccessor={(event: any) => event.start}
                endAccessor={(event: any) => event.end}
                allDayAccessor={() => false}
                view={view}
                onView={setView}
                date={date}
                onNavigate={setDate}
                draggable
                resizable
                selectable
                onEventDrop={handleEventDrop}
                onEventResize={handleEventDrop}
                onSelectEvent={handleSelectEvent}
                onSelectSlot={handleSelectSlot}
                step={30}
                timeslots={2}
                formats={customFormats}
                scrollToTime={new Date(new Date().setHours(8, 0, 0))}
                max={new Date(new Date().setHours(23, 59, 59))}
                views={['month', 'week', 'work_week', 'day']}
                messages={{
                    work_week: '5 Days',
                }}
                style={{ height: "100%" }}
                components={{
                    event: EventComponent
                }}
                {...({ draggable: true, resizable: true } as any)}
            />
        </div>
    )
}
