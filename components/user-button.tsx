"use client"

import { cn } from "@/lib/utils"

import { logout } from "@/features/auth/actions"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { LogOut, Settings, User } from "lucide-react"

interface UserButtonProps {
    user: {
        name?: string | null
        email?: string | null
        image?: string | null
    }
    isCollapsed?: boolean
}

export const UserButton = ({ user, isCollapsed }: UserButtonProps) => {
    const handleSignOut = async () => {
        await logout()
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button className={cn(
                    "w-full flex items-center p-3 hover:bg-muted rounded-md transition-colors group border border-transparent hover:border-border/50",
                    isCollapsed ? "justify-center gap-x-0 px-0" : "gap-x-3"
                )}>
                    <Avatar className="size-10 border-2 border-transparent group-hover:border-primary/20 transition-all shadow-sm shrink-0">
                        <AvatarImage src={user.image || ""} />
                        <AvatarFallback className="bg-primary text-primary-foreground font-bold">
                            {user.name?.charAt(0) || user.email?.charAt(0) || "U"}
                        </AvatarFallback>
                    </Avatar>
                    {!isCollapsed && (
                        <div className="flex flex-col items-start flex-1 min-w-0">
                            <p className="text-sm font-semibold truncate w-full text-foreground">{user.name || "User"}</p>
                            <p className="text-xs text-muted-foreground truncate w-full">{user.email}</p>
                        </div>
                    )}
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64 bg-popover border-border shadow-md">
                <div className="flex items-center gap-x-3 p-3">
                    <Avatar className="size-10 border border-border">
                        <AvatarImage src={user.image || ""} />
                        <AvatarFallback className="bg-primary text-primary-foreground text-xs font-bold">
                            {user.name?.charAt(0) || "U"}
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col flex-1 min-w-0">
                        <p className="text-sm font-bold truncate text-foreground">{user.name}</p>
                        <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                    </div>
                </div>
                <DropdownMenuSeparator className="bg-border" />
                <DropdownMenuItem className="py-2.5 transition-colors cursor-pointer focus:bg-accent focus:text-accent-foreground">
                    <User className="size-4 mr-3 text-muted-foreground" />
                    <span className="text-sm">Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="py-2.5 transition-colors cursor-pointer focus:bg-accent focus:text-accent-foreground">
                    <Settings className="size-4 mr-3 text-muted-foreground" />
                    <span className="text-sm">Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-border" />
                <DropdownMenuItem onClick={handleSignOut} className="py-2.5 text-destructive focus:text-destructive transition-colors cursor-pointer focus:bg-destructive/10">
                    <LogOut className="size-4 mr-3" />
                    <span className="text-sm font-medium">Sign Out</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
