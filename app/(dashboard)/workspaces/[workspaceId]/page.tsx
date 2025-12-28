import { auth } from "@/lib/auth"
import { getDashboardStats } from "@/features/tasks/actions"
import { redirect } from "next/navigation"
import { AssignedTasks } from "@/components/dashboard/assigned-tasks"
import { ProjectGrid } from "@/components/dashboard/project-grid"
import { db } from "@/lib/db"
import { MembersList } from "@/components/dashboard/members-list"

export default async function WorkspaceDashboardPage({
    params
}: {
    params: Promise<{ workspaceId: string }>
}) {
    const session = await auth()
    if (!session) redirect("/sign-in")

    const { workspaceId } = await params
    const stats = await getDashboardStats(workspaceId)
    const projects = await db.project.findMany({
        where: { workspaceId },
        orderBy: { createdAt: "desc" },
        take: 4
    })

    if (!stats) return <div>Failed to load stats</div>

    return (
        <div className="flex flex-col gap-y-6 h-full overflow-y-auto pr-2 scrollbar-none">
            <div className="flex flex-col gap-y-1">
                <h1 className="text-3xl font-bold tracking-tight">Home</h1>
                <p className="text-muted-foreground">Monitor all of your projects and tasks across the workspace</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <div className="bg-card p-5 rounded-xl border border-border shadow-sm flex flex-col items-center text-center transition-all hover:shadow-md">
                     <span className="text-muted-foreground text-xs font-bold uppercase tracking-widest">Projects</span>
                     <span className="text-3xl font-bold mt-2 text-primary">{stats.projectCount}</span>
                </div>
                 <div className="bg-card p-5 rounded-xl border border-border shadow-sm flex flex-col items-center text-center transition-all hover:shadow-md">
                     <span className="text-muted-foreground text-xs font-bold uppercase tracking-widest">Tasks</span>
                     <span className="text-3xl font-bold mt-2">{stats.totalTasks}</span>
                </div>
                 <div className="bg-card p-5 rounded-xl border border-border shadow-sm flex flex-col items-center text-center transition-all hover:shadow-md">
                     <span className="text-muted-foreground text-xs font-bold uppercase tracking-widest">Assigned</span>
                     <span className="text-3xl font-bold mt-2 text-blue-500">{stats.assignedTasks}</span>
                </div>
                 <div className="bg-card p-5 rounded-xl border border-border shadow-sm flex flex-col items-center text-center transition-all hover:shadow-md">
                     <span className="text-muted-foreground text-xs font-bold uppercase tracking-widest">Completed</span>
                     <span className="text-3xl font-bold mt-2 text-emerald-500">{stats.completedTasks}</span>
                </div>
                 <div className="bg-card p-5 rounded-xl border border-border bg-destructive/[0.02] border-destructive/20 shadow-sm flex flex-col items-center text-center transition-all hover:shadow-md">
                     <span className="text-destructive/80 text-xs font-bold uppercase tracking-widest">Overdue</span>
                     <span className="text-3xl font-bold mt-2 text-destructive">{stats.overdueTasks}</span>
                </div>
            </div>
            
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                <div className="flex flex-col gap-y-2">
                    <h2 className="text-lg font-semibold px-1">Recent Projects</h2>
                    <ProjectGrid workspaceId={workspaceId} projects={projects} />
                </div>
                <div className="flex flex-col gap-y-2">
                    <h2 className="text-lg font-semibold px-1">My Tasks</h2>
                    <AssignedTasks workspaceId={workspaceId} />
                </div>
            </div>
            
            <div className="flex flex-col gap-y-2 mb-6">
                 <h2 className="text-lg font-semibold px-1">Workspace Members</h2>
                 <MembersList workspaceId={workspaceId} />
            </div>
        </div>
    )
}
