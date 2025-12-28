import Link from "next/link"
import { useState } from "react"
import { Plus } from "lucide-react"
import { CreateProjectModal } from "@/components/projects/create-project-modal"
import { cn } from "@/lib/utils"

interface NavigationProjectsProps {
    projects: {
        id: string
        name: string
    }[]
    workspaceId: string
    isCollapsed?: boolean
}

export const NavigationProjects = ({ projects, workspaceId, isCollapsed }: NavigationProjectsProps) => {
    const [isModalOpen, setIsModalOpen] = useState(false)

    return (
        <div className="flex flex-col gap-y-2 mt-4">
            {!isCollapsed && (
                <div className="flex items-center justify-between">
                    <p className="text-[11px] uppercase text-muted-foreground font-bold tracking-widest">Projects</p>
                    <button 
                        onClick={() => setIsModalOpen(true)}
                        className="size-5 bg-muted rounded-md flex items-center justify-center hover:bg-accent transition border border-border/50"
                    >
                        <Plus className="size-3 text-muted-foreground" />
                    </button>
                </div>
            )}
            
            <CreateProjectModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                workspaceId={workspaceId} 
            />

            <div className="flex flex-col gap-y-1">
                {projects.map(project => (
                    <Link key={project.id} href={`/workspaces/${workspaceId}/projects/${project.id}`}>
                        <div className={cn(
                            "flex items-center gap-x-2 p-2 hover:bg-muted rounded-md cursor-pointer transition-colors group",
                            isCollapsed ? "justify-center" : ""
                        )}>
                            <div className="size-6 bg-primary rounded-md text-primary-foreground flex items-center justify-center text-[10px] font-bold shadow-sm shrink-0">
                                {project.name.charAt(0)}
                            </div>
                            {!isCollapsed && (
                                <span className="text-sm font-medium truncate text-muted-foreground group-hover:text-foreground">{project.name}</span>
                            )}
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    )
}
