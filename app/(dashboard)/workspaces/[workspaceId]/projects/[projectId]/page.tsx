import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getProject, getProjects } from "@/features/projects/actions";
import { getProjectTasks } from "@/features/tasks/actions";
import { getMembers } from "@/features/workspaces/actions";
import { ProjectClient } from "./project-client";

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ workspaceId: string; projectId: string }>;
}) {
  const session = await auth();
  const { workspaceId, projectId } = await params;

  if (!session?.user) {
    redirect("/sign-in");
  }

  const [project, projects, members, tasks] = await Promise.all([
    getProject(projectId),
    getProjects(workspaceId),
    getMembers(workspaceId),
    getProjectTasks(projectId)
  ]);

  if (!project || project.workspaceId !== workspaceId) {
    redirect(`/workspaces/${workspaceId}`);
  }

  const users = members.map(m => m.user);

  return (
    <ProjectClient 
        initialProject={project} 
        initialTasks={tasks}
        projects={projects}
        users={users}
        workspaceId={workspaceId}
    />
  );
}
