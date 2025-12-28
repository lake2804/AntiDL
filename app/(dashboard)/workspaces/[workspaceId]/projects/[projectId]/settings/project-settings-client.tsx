"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { updateProject, deleteProject } from "@/features/projects/actions"
import { ArrowLeft, Trash2, Save, Loader2 } from "lucide-react"
import Link from "next/link"

interface ProjectSettingsClientProps {
  initialData: {
    id: string
    name: string
    workspaceId: string
  }
}

export const ProjectSettingsClient = ({ initialData }: ProjectSettingsClientProps) => {
  const router = useRouter()
  const [name, setName] = useState(initialData.name)
  const [isLoading, setIsLoading] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const onUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
        await updateProject(initialData.id, name)
        router.refresh()
    } catch (error) {
        console.error(error)
        alert("Failed to update project")
    } finally {
        setIsLoading(false)
    }
  }

  const onDelete = async () => {
    if (!confirm("Are you sure you want to delete this project? All tasks will be permanently removed.")) return
    setIsDeleting(true)
    try {
        await deleteProject(initialData.id)
        router.push(`/workspaces/${initialData.workspaceId}`)
        router.refresh()
    } catch (error) {
        console.error(error)
        alert("Failed to delete project")
    } finally {
        setIsDeleting(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto w-full py-10 flex flex-col gap-y-8 px-4">
      <div className="flex items-center gap-x-2">
        <Link href={`/workspaces/${initialData.workspaceId}/projects/${initialData.id}`}>
            <Button variant="ghost" size="sm" className="gap-x-2 text-muted-foreground hover:text-foreground transition-colors">
                <ArrowLeft className="size-4" />
                Back to Project
            </Button>
        </Link>
      </div>

      <div className="flex flex-col gap-y-1">
        <h1 className="text-3xl font-bold tracking-tight">Project Settings</h1>
        <p className="text-muted-foreground">Manage your project preferences and settings</p>
      </div>

      <div className="grid gap-8">
        <Card className="border-border shadow-md">
            <CardHeader>
                <CardTitle>Project Name</CardTitle>
                <CardDescription>Update the name of your project</CardDescription>
            </CardHeader>
            <form onSubmit={onUpdate}>
                <CardContent>
                    <div className="space-y-2">
                        <Label htmlFor="name">Project Name</Label>
                        <Input 
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Enter project name"
                            required
                            className="bg-background border-border"
                            disabled={isLoading}
                        />
                    </div>
                </CardContent>
                <CardFooter className="border-t border-border bg-muted/30 pt-6">
                    <Button type="submit" disabled={isLoading || name === initialData.name} className="gap-x-2 shadow-sm">
                        {isLoading ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
                        Save Changes
                    </Button>
                </CardFooter>
            </form>
        </Card>

        <Card className="border-destructive/20 shadow-md bg-destructive/[0.02]">
            <CardHeader>
                <CardTitle className="text-destructive">Danger Zone</CardTitle>
                <CardDescription>Permanently delete this project and all its data. This action cannot be undone.</CardDescription>
            </CardHeader>
            <CardContent>
                <p className="text-sm text-muted-foreground bg-destructive/5 p-4 rounded-lg border border-destructive/10">
                    Deleting a project will also remove all associated tasks, comments, and attachments. Please be certain before proceeding.
                </p>
            </CardContent>
            <CardFooter className="border-t border-destructive/10 pt-6">
                <Button 
                    variant="destructive" 
                    onClick={onDelete} 
                    disabled={isDeleting}
                    className="gap-x-2 shadow-sm font-semibold"
                >
                    {isDeleting ? <Loader2 className="size-4 animate-spin" /> : <Trash2 className="size-4" />}
                    Delete Project
                </Button>
            </CardFooter>
        </Card>
      </div>
    </div>
  )
}
