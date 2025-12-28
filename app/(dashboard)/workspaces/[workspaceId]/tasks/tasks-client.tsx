"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TaskTable } from "@/components/tasks/task-table"
import { TaskKanban } from "@/components/tasks/task-kanban"
import { TaskCalendar } from "@/components/tasks/task-calendar"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { CreateTaskModal } from "@/components/tasks/create-task-modal"
import { EditTaskModal } from "@/components/tasks/edit-task-modal"

interface TasksClientProps {
    tasks: any[]
    workspaceId: string
    projects: any[]
    users: any[]
}

export const TasksClient = ({ tasks, workspaceId, projects, users }: TasksClientProps) => {
    const [view, setView] = useState("table")
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null)
    const [initialValues, setInitialValues] = useState<{ status?: string; startDate?: Date; dueDate?: Date } | undefined>()

    const openCreateModal = (values?: { status?: string; startDate?: Date; dueDate?: Date }) => {
        setInitialValues(values)
        setIsCreateModalOpen(true)
    }

    const openEditModal = (taskId: string) => {
        setSelectedTaskId(taskId)
        setIsEditModalOpen(true)
    }

    const selectedTask = tasks.find(t => t.id === selectedTaskId)

    return (
        <div className="flex flex-col gap-y-4 flex-1 h-full overflow-hidden">
            <div className="flex items-center justify-between">
                <Tabs value={view} onValueChange={setView} className="w-auto">
                    <TabsList>
                        <TabsTrigger value="table">Table</TabsTrigger>
                        <TabsTrigger value="kanban">Kanban</TabsTrigger>
                        <TabsTrigger value="calendar">Calendar</TabsTrigger>
                    </TabsList>
                </Tabs>
                <Button onClick={() => openCreateModal()}>
                    <Plus className="size-4 mr-2" />
                    New Task
                </Button>
            </div>

            <div className="flex-1 overflow-hidden flex flex-col">
                {view === "table" && (
                    <TaskTable 
                        tasks={tasks} 
                        workspaceId={workspaceId} 
                        projects={projects}
                        users={users}
                        onEditTask={openEditModal}
                    />
                )}
                {view === "kanban" && (
                    <TaskKanban 
                        tasks={tasks} 
                        workspaceId={workspaceId} 
                        projects={projects}
                        users={users}
                        onAddTask={openCreateModal}
                        onEditTask={openEditModal}
                    />
                )}
                {view === "calendar" && (
                    <TaskCalendar 
                        tasks={tasks} 
                        workspaceId={workspaceId} 
                        onAddTask={openCreateModal}
                        onEditTask={openEditModal}
                    />
                )}
            </div>

            <CreateTaskModal 
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                workspaceId={workspaceId}
                projects={projects}
                users={users}
                initialValues={initialValues}
            />

            <EditTaskModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                workspaceId={workspaceId}
                projects={projects}
                users={users}
                task={selectedTask}
            />
        </div>
    )
}
