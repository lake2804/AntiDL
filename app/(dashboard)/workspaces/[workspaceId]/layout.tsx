import { auth } from "@/lib/auth";
import { getWorkspaces } from "@/features/workspaces/actions";
import { getProjects } from "@/features/projects/actions";
import { redirect } from "next/navigation";
import { DashboardLayoutClient } from "@/components/dashboard-layout-client";

export default async function WorkspaceLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ workspaceId: string }>;
}) {
  const session = await auth();
  const { workspaceId } = await params;
  if (workspaceId === "undefined") redirect("/");

  const [workspaces, projects] = await Promise.all([
    getWorkspaces(),
    getProjects(workspaceId)
  ]);

  return (
    <div className="h-screen overflow-hidden bg-white dark:bg-[#0a0a0a] transition-colors">
      <DashboardLayoutClient
        workspaces={workspaces}
        workspaceId={workspaceId}
        projects={projects}
        session={session}
      >
        {children}
      </DashboardLayoutClient>
    </div>
  );
}
