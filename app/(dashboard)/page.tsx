import { auth } from "@/lib/auth"
import { getWorkspaces } from "@/features/workspaces/actions"
import { redirect } from "next/navigation"
import { CreateWorkspaceForm } from "@/components/create-workspace-form"
import { UserButton } from "@/components/user-button"

export default async function DashboardPage() {
  const session = await auth()
  if (!session) redirect("/sign-in")
  
  const workspaces = await getWorkspaces()
  if (workspaces.length === 0) {
      return (
        <div className="min-h-screen flex flex-col bg-neutral-50">
          {/* Header with user profile */}
          <div className="border-b bg-white">
            <div className="max-w-md mx-auto px-6 py-4 flex items-center justify-between">
              <h2 className="font-bold text-lg">JiraClone</h2>
              {session.user && (
                <div className="scale-90">
                  <UserButton user={session.user} />
                </div>
              )}
            </div>
          </div>
          
          {/* Main content */}
          <div className="flex-1 flex items-center justify-center p-6">
            <div className="w-full max-w-md space-y-6">
              <div className="text-center space-y-2">
                <h1 className="text-3xl font-bold">Welcome to JiraClone!</h1>
                <p className="text-muted-foreground">Create your first workspace to get started</p>
              </div>
              <CreateWorkspaceForm />
            </div>
          </div>
        </div>
      )
  }
  
  redirect(`/workspaces/${workspaces[0].id}`)
}
