"use client"

import Link from "next/link"
import Image from "next/image"
import { WorkspaceSwitcher } from "@/components/workspace-switcher"
import { HomeIcon, CheckSquare, Settings, Users, ChevronLeft, ChevronRight } from "lucide-react"
import { UserButton } from "@/components/user-button"
import { ThemeToggle } from "@/components/theme-toggle"
import { NavigationProjects } from "@/components/navigation-projects"
import { cn } from "@/lib/utils"

interface SidebarProps {
    workspaces: {
        id: string
        name: string
        imageUrl: string | null
    }[]
    workspaceId: string
    projects: {
        id: string
        name: string
    }[]
    session: {
        user: {
            id: string
            name: string | null
            email: string | null
            image: string | null
        }
    } | null
    isCollapsed: boolean
    onToggle: () => void
}

export const Sidebar = ({ 
    workspaces, 
    workspaceId, 
    projects, 
    session,
    isCollapsed,
    onToggle
}: SidebarProps) => {

  return (
    <aside className={cn(
        "h-full bg-card flex flex-col transition-all duration-300 relative border-r border-border",
        isCollapsed ? "w-[72px]" : "w-[264px]"
    )}>
       <button 
         onClick={onToggle}
         className="absolute -right-4 top-10 size-8 bg-background border border-border rounded-full flex items-center justify-center hover:bg-muted transition-colors shadow-md z-[100] text-foreground cursor-pointer"
       >
         {isCollapsed ? <ChevronRight className="size-4" /> : <ChevronLeft className="size-4" />}
       </button>

       <div className="flex-1 flex flex-col gap-y-4 p-4 overflow-y-auto scrollbar-none">
           <Link href="/">
             <div className={cn(
                 "flex items-center gap-x-2",
                 isCollapsed ? "justify-center" : ""
             )}>
                <Image src="/logo.svg" alt="logo" width={30} height={30} className="shrink-0" />
                {!isCollapsed && (
                    <span className="font-bold text-xl text-foreground tracking-tight truncate">AntiDL</span>
                )}
             </div>
           </Link>
           <div className="bg-border h-px my-2" />
           
           <WorkspaceSwitcher workspaces={workspaces} currentWorkspaceId={workspaceId} isCollapsed={isCollapsed} />
           
           <div className="flex flex-col gap-y-1">
                <Link href={`/workspaces/${workspaceId}`}>
                    <div className={cn(
                        "flex items-center gap-x-2 p-2 hover:bg-muted rounded-md cursor-pointer transition-colors group",
                        isCollapsed ? "justify-center" : ""
                    )}>
                        <HomeIcon className="size-5 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
                        {!isCollapsed && (
                            <span className="text-sm font-medium text-muted-foreground group-hover:text-foreground">Home</span>
                        )}
                    </div>
                </Link>
                <Link href={`/workspaces/${workspaceId}/tasks`}>
                    <div className={cn(
                        "flex items-center gap-x-2 p-2 hover:bg-muted rounded-md cursor-pointer transition-colors group",
                        isCollapsed ? "justify-center" : ""
                    )}>
                        <CheckSquare className="size-5 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
                        {!isCollapsed && (
                            <span className="text-sm font-medium text-muted-foreground group-hover:text-foreground">My Tasks</span>
                        )}
                    </div>
                </Link>
                <Link href={`/workspaces/${workspaceId}/settings`}>
                    <div className={cn(
                        "flex items-center gap-x-2 p-2 hover:bg-muted rounded-md cursor-pointer transition-colors group",
                        isCollapsed ? "justify-center" : ""
                    )}>
                        <Settings className="size-5 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
                        {!isCollapsed && (
                            <span className="text-sm font-medium text-muted-foreground group-hover:text-foreground">Settings</span>
                        )}
                    </div>
                </Link>
                <Link href={`/workspaces/${workspaceId}/members`}>
                    <div className={cn(
                        "flex items-center gap-x-2 p-2 hover:bg-muted rounded-md cursor-pointer transition-colors group",
                        isCollapsed ? "justify-center" : ""
                    )}>
                        <Users className="size-5 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
                        {!isCollapsed && (
                            <span className="text-sm font-medium text-muted-foreground group-hover:text-foreground">Members</span>
                        )}
                    </div>
                </Link>
           </div>
           
           <NavigationProjects projects={projects} workspaceId={workspaceId} isCollapsed={isCollapsed} />

           {/* Footer section with Theme Toggle and User Button */}
           <div className="mt-auto pt-4 flex flex-col gap-y-4">
              <div className="bg-border h-px" />
              
              <div className={cn(
                  "flex items-center",
                  isCollapsed ? "justify-center" : "justify-center w-full"
              )}>
                 <ThemeToggle />
              </div>

              <div className="bg-border h-px" />
              {session?.user && <UserButton user={session.user} isCollapsed={isCollapsed} />}
           </div>
       </div>
    </aside>
  )
}
