"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createWorkspace } from "@/features/workspaces/actions"

interface CreateWorkspaceModalProps {
    isOpen: boolean
    onClose: () => void
}

export const CreateWorkspaceModal = ({ isOpen, onClose }: CreateWorkspaceModalProps) => {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [name, setName] = useState("")

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!name) return

        setIsLoading(true)
        try {
            const workspace = await createWorkspace(name)
            router.push(`/workspaces/${workspace.id}`)
            onClose()
            setName("")
        } catch (error) {
            console.error("Failed to create workspace:", error)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>Create New Workspace</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Workspace Name</Label>
                        <Input
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Enter workspace name"
                            required
                            disabled={isLoading}
                        />
                    </div>
                    <div className="flex justify-end gap-x-2">
                        <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? "Creating..." : "Create Workspace"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
