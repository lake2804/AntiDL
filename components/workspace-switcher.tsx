"use client"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Plus } from "lucide-react"
import { CreateWorkspaceModal } from "@/components/create-workspace-modal"
import { useState } from "react"
import { cn } from "@/lib/utils"

interface WorkspaceSwitcherProps {
  workspaces: any[] // Replace with Type
  currentWorkspaceId: string
  isCollapsed?: boolean
}

export const WorkspaceSwitcher = ({ workspaces, currentWorkspaceId, isCollapsed }: WorkspaceSwitcherProps) => {
  const router = useRouter()
  const [isWorkspaceModalOpen, setIsWorkspaceModalOpen] = useState(false)

  const onSelect = (id: string) => {
     router.push(`/workspaces/${id}`)
     router.refresh()
  }
  
  const activeWorkspace = workspaces.find(w => w.id === currentWorkspaceId)

  return (
    <div className="flex flex-col gap-y-2">
        {!isCollapsed && (
            <div className="flex items-center justify-between px-2">
                <p className="text-[11px] uppercase text-muted-foreground font-bold tracking-widest">Workspaces</p>
                <button 
                    type="button"
                    onClick={() => setIsWorkspaceModalOpen(true)}
                    className="size-5 bg-muted rounded-md flex items-center justify-center hover:bg-accent transition border border-border/50"
                >
                    <Plus className="size-3 text-muted-foreground" />
                </button>
            </div>
        )}

        <Select onValueChange={onSelect} value={currentWorkspaceId}>
            <SelectTrigger className={cn(
                "w-full bg-muted/50 border-border font-medium h-auto hover:bg-muted transition-colors",
                isCollapsed ? "px-2 py-2" : "px-2 py-2"
            )}>
                <SelectValue>
                    <div className="flex items-center gap-x-2">
                        <div className="size-5 relative overflow-hidden rounded-sm shrink-0">
                             {activeWorkspace?.imageUrl ? (
                                <Image src={activeWorkspace.imageUrl} fill alt="logo" className="object-cover" />
                             ) : (
                                 <div className="size-full bg-primary text-primary-foreground flex items-center justify-center text-[10px] font-extrabold">
                                     {activeWorkspace?.name.charAt(0)}
                                 </div>
                             )}
                        </div>
                        {!isCollapsed && <span className="truncate text-sm text-foreground">{activeWorkspace?.name}</span>}
                    </div>
                </SelectValue>
            </SelectTrigger>
            <SelectContent position="popper" className="w-[var(--radix-select-trigger-width)]">
                {workspaces.map((workspace) => (
                    <SelectItem key={workspace.id} value={workspace.id}>
                        {workspace.name}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>

        <CreateWorkspaceModal 
            isOpen={isWorkspaceModalOpen} 
            onClose={() => setIsWorkspaceModalOpen(false)} 
        />
    </div>
  )
}
