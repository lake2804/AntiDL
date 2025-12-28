import { db } from "@/lib/db"
import { auth } from "@/lib/auth"
import { formatDistanceToNow } from "date-fns"
import Link from "next/link"

export const AssignedTasks = async ({ workspaceId }: { workspaceId: string }) => {
    const session = await auth()
    if (!session?.user?.id) return null

    const tasks = await db.task.findMany({
        where: {
            project: { workspaceId },
            assigneeId: session.user.id,
            status: { not: "DONE" }
        },
        take: 5,
        orderBy: { dueDate: "asc" },
        include: { project: true }
    })

    if (tasks.length === 0) {
        return (
            <div className="bg-card p-4 rounded-lg border border-border shadow-sm flex flex-col h-full">
                <div className="flex items-center justify-between mb-4">
                     <p className="font-bold text-lg text-foreground">Assigned Tasks (0)</p>
                </div>
                <div className="flex flex-col items-center justify-center h-full text-muted-foreground text-sm">
                    No tasks assigned directly to you
                </div>
            </div>
        )
    }

    return (
        <div className="bg-card p-4 rounded-lg border border-border shadow-sm flex flex-col">
            <div className="flex items-center justify-between mb-4">
                 <p className="font-bold text-lg text-foreground">Assigned Tasks ({tasks.length})</p>
                 <Link href={`/workspaces/${workspaceId}/tasks`} className="text-xs hover:underline text-primary">Show All</Link>
            </div>
            <div className="flex flex-col gap-y-3">
                {tasks.map(task => {
                    const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== "DONE";
                    return (
                        <Link key={task.id} href={`/workspaces/${workspaceId}/tasks/${task.id}`}>
                            <div className="p-4 bg-muted/30 hover:bg-muted/60 dark:bg-muted/10 dark:hover:bg-muted/20 rounded-xl border border-border shadow-sm flex flex-col gap-y-1.5 transition-all hover:scale-[1.01] active:scale-[0.99] group relative overflow-hidden">
                                {isOverdue && (
                                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-destructive" />
                                )}
                                <div className="flex items-center justify-between gap-x-2">
                                    <p className="font-bold text-sm truncate text-foreground group-hover:text-primary transition-colors">{task.title}</p>
                                    <span className="shrink-0 text-[10px] font-bold uppercase tracking-wider text-muted-foreground/60">
                                        {task.project.name.charAt(0)}
                                    </span>
                                </div>
                                <div className="flex items-center gap-x-2 text-[11px] text-muted-foreground font-medium">
                                     <span className="truncate max-w-[120px] text-foreground/70">{task.project.name}</span>
                                     <span className="text-muted-foreground/30">•</span>
                                     <span className={isOverdue ? "text-destructive font-bold" : ""}>
                                        {task.dueDate ? formatDistanceToNow(task.dueDate, { addSuffix: true }) : "No due date"}
                                     </span>
                                </div>
                            </div>
                        </Link>
                    )
                })}
            </div>
        </div>
    )
}
