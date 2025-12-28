"use client"

import { useState } from "react"
import { MoreVertical, ShieldAlert, Trash, UserMinus } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { deleteMember, updateMember } from "@/features/workspaces/actions"
import { useRouter } from "next/navigation"

interface Member {
  id: string
  role: string
  user: {
    id: string
    name: string | null
    email: string | null
    image: string | null
  }
}

interface MembersClientProps {
  initialMembers: any[]
  workspaceId: string
  isAdmin: boolean
}

export const MembersClient = ({ initialMembers, workspaceId, isAdmin }: MembersClientProps) => {
  const router = useRouter()
  const [members, setMembers] = useState(initialMembers)

  const handleRemove = async (memberId: string) => {
    if (!confirm("Are you sure you want to remove this member?")) return
    
    try {
        await deleteMember(memberId)
        setMembers(prev => prev.filter(m => m.id !== memberId))
        router.refresh()
    } catch (error) {
        console.error("Failed to remove member:", error)
    }
  }

  const handleRoleChange = async (memberId: string, role: string) => {
    try {
        await updateMember(memberId, role)
        setMembers(prev => prev.map(m => m.id === memberId ? { ...m, role } : m))
        router.refresh()
    } catch (error) {
        console.error("Failed to update member role:", error)
    }
  }

  return (
    <div className="max-w-4xl mx-auto w-full py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Workspace Members</h1>
        <p className="text-muted-foreground text-sm">{members.length} members in this workspace</p>
      </div>

      <div className="bg-card border border-border rounded-lg overflow-hidden shadow-sm">
        <div className="divide-y divide-border">
          {members.map((member) => (
            <div key={member.id} className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors">
              <div className="flex items-center gap-x-3">
                <Avatar className="size-10">
                  <AvatarImage src={member.user.image || ""} />
                  <AvatarFallback className="bg-primary text-primary-foreground font-bold">
                    {member.user.name?.charAt(0) || member.user.email?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <p className="text-sm font-semibold text-foreground">{member.user.name || "User"}</p>
                  <p className="text-xs text-muted-foreground">{member.user.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-x-2">
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                  member.role === "ADMIN" 
                    ? "bg-primary/10 text-primary border border-primary/20" 
                    : "bg-muted text-muted-foreground border border-border/50"
                }`}>
                  {member.role}
                </span>

                {isAdmin && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="size-8">
                          <MoreVertical className="size-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleRoleChange(member.id, member.role === "ADMIN" ? "MEMBER" : "ADMIN")}>
                          <ShieldAlert className="size-4 mr-2" />
                          Set as {member.role === "ADMIN" ? "Member" : "Admin"}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleRemove(member.id)} className="text-destructive">
                          <UserMinus className="size-4 mr-2" />
                          Remove from workspace
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
