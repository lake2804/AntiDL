import { db } from "@/lib/db"
import { Settings } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from "next/link"

export const MembersList = async ({ workspaceId }: { workspaceId: string }) => {
    const members = await db.member.findMany({
        where: { workspaceId },
        include: { user: true },
        take: 5
    })

    return (
        <div className="bg-card p-4 rounded-lg border border-border shadow-sm flex flex-col h-full">
            <div className="flex items-center justify-between mb-4">
                 <p className="font-bold text-lg text-foreground">People ({members.length})</p>
                 <Link href={`/workspaces/${workspaceId}/members`}>
                    <button className="size-6 rounded-full hover:bg-muted flex items-center justify-center transition-colors border border-transparent hover:border-border/50">
                        <Settings className="size-4" />
                    </button>
                 </Link>
            </div>
            <div className="flex items-center gap-x-6 overflow-x-auto pb-4 scrollbar-none">
                 {members.map(member => (
                     <div key={member.id} className="flex flex-col items-center gap-y-2 min-w-[90px] group cursor-default">
                         <div className="relative">
                            <Avatar className="size-16 border-2 border-border transition-all group-hover:border-primary/50 group-hover:scale-105 shadow-sm">
                                <AvatarImage src={member.user.image || ""} />
                                <AvatarFallback className="bg-muted font-bold text-xl text-muted-foreground">
                                    {member.user.name?.charAt(0) || "U"}
                                </AvatarFallback>
                            </Avatar>
                            <div className="absolute bottom-0 right-0 size-4 bg-emerald-500 border-2 border-background rounded-full shadow-sm" />
                         </div>
                         <div className="flex flex-col items-center text-center px-1">
                             <p className="text-sm font-semibold truncate w-full tracking-tight text-foreground/90">{member.user.name?.split(" ")[0]}</p>
                             <p className="text-[10px] text-muted-foreground/70 truncate w-full max-w-[85px] font-medium">{member.user.email}</p>
                         </div>
                     </div>
                 ))}
                 {members.length >= 5 && (
                    <div className="flex flex-col items-center gap-y-2 min-w-[90px] group">
                        <Link href={`/workspaces/${workspaceId}/members`} className="flex flex-col items-center gap-y-2">
                             <div className="size-16 rounded-full border-2 border-dashed border-border flex items-center justify-center text-muted-foreground group-hover:border-primary group-hover:text-primary transition-all hover:bg-muted/30">
                                <span className="text-xs font-bold uppercase tracking-widest">More</span>
                             </div>
                             <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground transition-colors group-hover:text-primary">View All</p>
                        </Link>
                    </div>
                 )}
             </div>
        </div>
    )
}
