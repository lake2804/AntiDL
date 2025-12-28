"use client"

import { useState } from "react"
import { Copy, RefreshCw, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { updateWorkspace, deleteWorkspace, resetInviteCode } from "@/features/workspaces/actions"
import { useRouter } from "next/navigation"

interface SettingsClientProps {
  initialData: {
    id: string
    name: string
    inviteCode: string
  }
}

export const SettingsClient = ({ initialData }: SettingsClientProps) => {
  const router = useRouter()
  const [name, setName] = useState(initialData.name)
  const [isUpdating, setIsUpdating] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isResetting, setIsResetting] = useState(false)

  const handleUpdate = async () => {
    if (!name.trim()) return
    setIsUpdating(true)
    try {
        await updateWorkspace(initialData.id, name)
        router.refresh()
    } catch (error) {
        console.error(error)
    } finally {
        setIsUpdating(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this workspace? This action is irreversible.")) return
    setIsDeleting(true)
    try {
        await deleteWorkspace(initialData.id)
        router.push("/")
        router.refresh()
    } catch (error) {
        console.error(error)
    } finally {
        setIsDeleting(false)
    }
  }

  const onResetInvite = async () => {
    setIsResetting(true)
    try {
        await resetInviteCode(initialData.id)
        router.refresh()
    } catch (error) {
        console.error(error)
    } finally {
        setIsResetting(false)
    }
  }

  const fullInviteUrl = `${window.location.origin}/workspaces/${initialData.id}/join/${initialData.inviteCode}`

  const onCopyInviteUrl = () => {
    navigator.clipboard.writeText(fullInviteUrl)
    alert("Invite URL copied to clipboard")
  }

  return (
    <div className="max-w-4xl mx-auto w-full py-6 flex flex-col gap-y-8">
      <div>
        <h1 className="text-2xl font-bold">Workspace Settings</h1>
        <p className="text-muted-foreground text-sm">Manage your workspace's profile and settings</p>
      </div>

      <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
        <h2 className="text-lg font-semibold mb-4">Workspace Information</h2>
        <div className="space-y-4 max-w-md">
            <div className="space-y-2">
                <label className="text-sm font-medium">Workspace Name</label>
                <Input 
                    value={name} 
                    onChange={(e) => setName(e.target.value)} 
                    placeholder="Workspace Name"
                    disabled={isUpdating}
                />
            </div>
            <Button onClick={handleUpdate} disabled={isUpdating || name === initialData.name}>
                {isUpdating ? "Saving..." : "Save Changes"}
            </Button>
        </div>
      </div>

      <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
        <h2 className="text-lg font-semibold mb-1">Invite Information</h2>
        <p className="text-sm text-muted-foreground mb-4">Share this link to invite members to your workspace</p>
        <div className="flex items-center gap-x-2">
            <Input value={fullInviteUrl} readOnly className="bg-muted" />
            <Button variant="secondary" onClick={onCopyInviteUrl} size="icon">
                <Copy className="size-4" />
            </Button>
            <Button variant="outline" onClick={onResetInvite} disabled={isResetting} size="icon">
                <RefreshCw className={isResetting ? "animate-spin size-4" : "size-4"} />
            </Button>
        </div>
      </div>

      <div className="bg-card border border-destructive/20 bg-destructive/5 rounded-lg p-6">
        <h2 className="text-lg font-semibold text-destructive mb-1">Danger Zone</h2>
        <p className="text-sm text-muted-foreground mb-4">Once you delete a workspace, there is no going back. Please be certain.</p>
        <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
           <Trash2 className="size-4 mr-2" />
           {isDeleting ? "Deleting..." : "Delete Workspace"}
        </Button>
      </div>
    </div>
  )
}
