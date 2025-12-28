"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createWorkspace } from "@/features/workspaces/actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export const CreateWorkspaceForm = () => {
    const router = useRouter()
    const [name, setName] = useState("")
    const [loading, setLoading] = useState(false)

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!name.trim()) return

        setLoading(true)
        try {
            const workspace = await createWorkspace(name)
            router.push(`/workspaces/${workspace.id}`)
            router.refresh()
        } catch (error) {
            console.error(error)
            alert("Failed to create workspace")
            setLoading(false)
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Create Workspace</CardTitle>
                <CardDescription>
                    A workspace is where your team collaborates on projects and tasks
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={onSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Workspace Name</Label>
                        <Input
                            id="name"
                            type="text"
                            placeholder="e.g. Acme Corp"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            disabled={loading}
                            autoFocus
                        />
                    </div>
                    <Button type="submit" className="w-full" disabled={loading}>
                        {loading ? "Creating..." : "Create Workspace"}
                    </Button>
                </form>
            </CardContent>
        </Card>
    )
}
