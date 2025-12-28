"use client"

import { Plus } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { CreateProjectModal } from "@/components/projects/create-project-modal"

interface ProjectGridProps {
    workspaceId: string
    projects: {
        id: string
        name: string
    }[]
}

export const ProjectGrid = ({ workspaceId, projects }: ProjectGridProps) => {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <div className="bg-card p-4 rounded-lg border border-border shadow-sm flex flex-col col-span-2 md:col-span-1">
             <div className="flex items-center justify-between mb-4">
                 <p className="font-bold text-lg text-foreground">Projects ({projects.length})</p>
                 <button 
                    onClick={() => setIsOpen(true)}
                    className="size-6 rounded-full hover:bg-muted flex items-center justify-center transition-colors border border-transparent hover:border-border/50"
                >
                     <Plus className="size-4" />
                 </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {projects.map(project => (
                    <Link key={project.id} href={`/workspaces/${workspaceId}/projects/${project.id}`}>
                        <div className="flex items-center gap-x-4 p-4 bg-muted/20 hover:bg-muted/50 dark:bg-muted/5 dark:hover:bg-muted/10 border border-border rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98] shadow-sm group">
                            <div className="size-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center font-bold text-xl shadow-inner border border-primary/20 shrink-0">
                                {project.name.charAt(0)}
                            </div>
                            <div className="flex flex-col min-w-0">
                                <p className="font-bold truncate text-foreground group-hover:text-primary transition-colors tracking-tight">{project.name}</p>
                                <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest mt-0.5 opacity-60">View Board</p>
                            </div>
                        </div>
                    </Link>
                ))}
                {projects.length === 0 && (
                    <div className="col-span-full flex flex-col items-center justify-center py-8 bg-muted/10 rounded-xl border border-dashed border-border">
                        <p className="text-sm text-muted-foreground">No projects created yet</p>
                    </div>
                )}
            </div>

            <CreateProjectModal 
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                workspaceId={workspaceId}
            />
        </div>
    )
}
