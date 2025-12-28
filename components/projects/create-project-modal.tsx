"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createProject } from "@/features/projects/actions"

interface CreateProjectModalProps {
    isOpen: boolean
    onClose: () => void
    workspaceId: string
}

export const CreateProjectModal = ({ isOpen, onClose, workspaceId }: CreateProjectModalProps) => {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [name, setName] = useState("")

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!name) return

        setIsLoading(true)
        try {
            await createProject({
                name,
                workspaceId
            })
            router.refresh()
            onClose()
            setName("")
        } catch (error) {
            console.error("Failed to create project:", error)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>Create New Project</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Project Name</Label>
                        <Input
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Enter project name"
                            required
                            disabled={isLoading}
                        />
                    </div>
                    <div className="flex justify-end gap-x-2">
                        <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? "Creating..." : "Create Project"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
