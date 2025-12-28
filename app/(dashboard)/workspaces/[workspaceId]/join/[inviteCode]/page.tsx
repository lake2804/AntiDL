import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getWorkspace } from "@/features/workspaces/actions";
import { JoinClient } from "./join-client";

export default async function JoinWorkspacePage({
  params,
}: {
  params: Promise<{ workspaceId: string; inviteCode: string }>;
}) {
  const session = await auth();
  const { workspaceId, inviteCode } = await params;

  if (!session?.user) {
    redirect(`/sign-in?callbackUrl=/workspaces/${workspaceId}/join/${inviteCode}`);
  }

  const workspace = await getWorkspace(workspaceId);

  if (!workspace) {
    redirect("/");
  }

  if (workspace.inviteCode !== inviteCode) {
    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="bg-card border border-border p-8 rounded-lg text-center shadow-lg">
                <h1 className="text-2xl font-bold text-destructive mb-2">Invalid Link</h1>
                <p className="text-muted-foreground">This invite link is either invalid or has expired.</p>
            </div>
        </div>
    )
  }

  return (
    <JoinClient workspaceName={workspace.name} workspaceId={workspaceId} inviteCode={inviteCode} />
  );
}
