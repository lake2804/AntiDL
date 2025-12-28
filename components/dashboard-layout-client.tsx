"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { cn } from "@/lib/utils"

interface DashboardLayoutClientProps {
    children: React.ReactNode
    workspaces: any[]
    workspaceId: string
    projects: any[]
    session: any
}

export const DashboardLayoutClient = ({ 
    children, 
    workspaces, 
    workspaceId,
    projects,
    session
}: DashboardLayoutClientProps) => {
    const [isCollapsed, setIsCollapsed] = useState(false)

    return (
        <div className="flex w-full h-full">
            <div className={cn(
                "fixed left-0 top-0 hidden lg:block h-full z-[49] border-r dark:border-neutral-800 bg-white dark:bg-[#121212] transition-all duration-300",
                isCollapsed ? "w-[72px]" : "w-[264px]"
            )}>
                <Sidebar 
                    workspaces={workspaces} 
                    workspaceId={workspaceId} 
                    projects={projects} 
                    session={session}
                    isCollapsed={isCollapsed}
                    onToggle={() => setIsCollapsed(!isCollapsed)}
                />
            </div>
            <div className={cn(
                "flex-1 h-full flex flex-col overflow-hidden transition-all duration-300",
                isCollapsed ? "lg:pl-[72px]" : "lg:pl-[264px]"
            )}>
                <div className="mx-auto max-w-screen-2xl h-full w-full flex flex-col overflow-hidden">
                    <main className="h-full py-3 px-6 flex flex-col overflow-hidden">
                        {children}
                    </main>
                </div>
            </div>
        </div>
    )
}
