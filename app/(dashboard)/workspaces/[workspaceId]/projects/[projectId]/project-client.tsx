"use client"

import { useState } from "react"
import Link from "next/link"
import { LayoutDashboard, ListTodo, Calendar, Settings } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TaskKanban } from "@/components/tasks/task-kanban"
import { TaskTable } from "@/components/tasks/task-table"
import { TaskCalendar } from "@/components/tasks/task-calendar"
import { Button } from "@/components/ui/button"
import { useCreateTaskModal } from "@/features/tasks/hooks/use-create-task-modal"
import { useEditTaskModal } from "@/features/tasks/hooks/use-edit-task-modal"

interface ProjectClientProps {
  initialProject: {
    id: string
    name: string
    workspaceId: string
  }
  initialTasks: any[]
  projects: {
    id: string
    name: string
  }[]
  users: {
    id: string
    name: string | null
    image: string | null
  }[]
  workspaceId: string
}

export const ProjectClient = ({ 
    initialProject, 
    initialTasks, 
    projects, 
    users, 
    workspaceId 
}: ProjectClientProps) => {
  const [tasks, setTasks] = useState(initialTasks)
  const { open: openCreate } = useCreateTaskModal()
  const { open: openEdit } = useEditTaskModal()

  return (
    <div className="flex flex-col gap-y-4 h-full overflow-hidden">
      <div className="flex items-center justify-between shrink-0">
        <div className="flex items-center gap-x-2">
            <h1 className="text-2xl font-bold">{initialProject.name}</h1>
        </div>
        <div className="flex items-center gap-x-2">
            <Button onClick={() => openCreate(initialProject.id)} size="sm">
                Add Task
            </Button>
            <Link href={`/workspaces/${workspaceId}/projects/${initialProject.id}/settings`}>
                <Button variant="secondary" size="icon" className="size-8">
                    <Settings className="size-4" />
                </Button>
            </Link>
        </div>
      </div>

      <Tabs defaultValue="board" className="flex-1 flex flex-col overflow-hidden">
        <TabsList className="w-fit shrink-0">
            <TabsTrigger value="board" className="flex items-center gap-x-2">
                <LayoutDashboard className="size-4" />
                Board
            </TabsTrigger>
            <TabsTrigger value="list" className="flex items-center gap-x-2">
                <ListTodo className="size-4" />
                List
            </TabsTrigger>
            <TabsTrigger value="calendar" className="flex items-center gap-x-2">
                <Calendar className="size-4" />
                Calendar
            </TabsTrigger>
        </TabsList>

        <div className="flex-1 overflow-hidden mt-4">
            <TabsContent value="board" className="h-full mt-0">
                <TaskKanban 
                    tasks={tasks} 
                    workspaceId={workspaceId} 
                    projects={projects} 
                    users={users} 
                    onAddTask={() => openCreate(initialProject.id)}
                    onEditTask={openEdit}
                />
            </TabsContent>
            <TabsContent value="list" className="h-full mt-0">
                <TaskTable 
                    tasks={tasks} 
                    workspaceId={workspaceId} 
                    projects={projects} 
                    users={users} 
                    onEditTask={openEdit}
                />
            </TabsContent>
            <TabsContent value="calendar" className="h-full mt-0">
                <TaskCalendar 
                    tasks={tasks} 
                    workspaceId={workspaceId} 
                    onAddTask={() => openCreate(initialProject.id)}
                    onEditTask={openEdit}
                />
            </TabsContent>
        </div>
      </Tabs>
    </div>
  )
}
