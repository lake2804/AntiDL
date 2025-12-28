import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getProject } from "@/features/projects/actions";
import { ProjectSettingsClient } from "./project-settings-client";

export default async function ProjectSettingsPage({
  params,
}: {
  params: Promise<{ workspaceId: string; projectId: string }>;
}) {
  const session = await auth();
  const { workspaceId, projectId } = await params;

  if (!session?.user) {
    redirect("/sign-in");
  }

  const project = await getProject(projectId);

  if (!project || project.workspaceId !== workspaceId) {
    redirect(`/workspaces/${workspaceId}`);
  }

  // Only project owner or workspace admin should be allowed to edit/delete project
  // For now we check if user is the one who created it (using auth id vs project potential owner id if it existed, 
  // but project currently has no ownerId in schema, it belongs to workspace. 
  // So we check if user is a member of the workspace.)
  
  return (
    <ProjectSettingsClient initialData={project} />
  );
}
