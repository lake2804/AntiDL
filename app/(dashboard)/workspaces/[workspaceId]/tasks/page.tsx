import { getTasks } from "@/features/tasks/actions"
import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { TasksClient } from "./tasks-client"
import { db } from "@/lib/db"

export default async function TasksPage({ params }: { params: Promise<{ workspaceId: string }> }) {
    const session = await auth()
    if (!session) redirect("/sign-in")

    const { workspaceId } = await params

    const [tasks, projects, members] = await Promise.all([
        getTasks(workspaceId),
        db.project.findMany({
            where: { workspaceId }
        }),
        db.member.findMany({
            where: { workspaceId },
            include: { user: true }
        })
    ])

    const users = members.map((m: any) => m.user)

    return (
        <div className="flex flex-col gap-y-4 h-full overflow-hidden">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">My Tasks</h1>
                    <p className="text-muted-foreground text-sm">View all of your tasks here</p>
                </div>
            </div>
            <TasksClient 
                tasks={tasks} 
                workspaceId={workspaceId}
                projects={projects}
                users={users}
            />
        </div>
    )
}
