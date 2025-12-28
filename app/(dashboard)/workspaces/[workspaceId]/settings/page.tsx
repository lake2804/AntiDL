import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getWorkspace } from "@/features/workspaces/actions";
import { SettingsClient } from "./settings-client";

export default async function WorkspaceSettingsPage({
  params,
}: {
  params: Promise<{ workspaceId: string }>;
}) {
  const session = await auth();
  const { workspaceId } = await params;

  if (!session?.user) {
    redirect("/sign-in");
  }

  const workspace = await getWorkspace(workspaceId);

  if (!workspace || workspace.ownerId !== session.user.id) {
    redirect(`/workspaces/${workspaceId}`);
  }

  return (
    <div className="flex flex-col gap-y-4">
      <SettingsClient initialData={workspace} />
    </div>
  );
}
