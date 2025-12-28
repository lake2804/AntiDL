"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { joinWorkspace } from "@/features/workspaces/actions"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"

interface JoinClientProps {
  workspaceName: string
  workspaceId: string
  inviteCode: string
}

export const JoinClient = ({ workspaceName, workspaceId, inviteCode }: JoinClientProps) => {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const onJoin = async () => {
    setIsLoading(true)
    try {
        const result = await joinWorkspace(workspaceId, inviteCode)
        if (result.success) {
            router.push(`/workspaces/${workspaceId}`)
            router.refresh()
        }
    } catch (error) {
        console.error(error)
        alert("Failed to join workspace")
    } finally {
        setIsLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
      <div className="max-w-md w-full bg-card border border-border p-8 rounded-xl shadow-xl text-center flex flex-col items-center gap-y-6">
        <div className="size-16 bg-primary rounded-2xl flex items-center justify-center text-primary-foreground text-3xl font-bold shadow-lg">
            {workspaceName.charAt(0)}
        </div>
        <div>
            <h1 className="text-3xl font-bold tracking-tight">Join Workspace</h1>
            <p className="text-muted-foreground mt-2">
                You've been invited to join <span className="font-bold text-foreground">{workspaceName}</span>
            </p>
        </div>
        <div className="flex flex-col w-full gap-y-2 mt-4">
            <Button onClick={onJoin} size="lg" disabled={isLoading} className="w-full text-lg h-12 shadow-md">
                {isLoading ? <Loader2 className="size-5 animate-spin" /> : "Join Workspace"}
            </Button>
            <Button variant="ghost" onClick={() => router.push("/")} disabled={isLoading} className="w-full font-medium">
                Maybe later
            </Button>
        </div>
      </div>
    </div>
  )
}
