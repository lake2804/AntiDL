import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getMembers } from "@/features/workspaces/actions";
import { MembersClient } from "./members-client";

export default async function WorkspaceMembersPage({
  params,
}: {
  params: Promise<{ workspaceId: string }>;
}) {
  const session = await auth();
  const { workspaceId } = await params;

  if (!session?.user) {
    redirect("/sign-in");
  }

  const members = await getMembers(workspaceId);

  return (
    <div className="flex flex-col gap-y-4">
      <MembersClient 
        initialMembers={members} 
        workspaceId={workspaceId}
        isAdmin={true} // Simplified check: in a real app, check if session user is ADMIN in this workspace
      />
    </div>
  );
}
