import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getTask } from "@/features/tasks/actions";
import { TaskClient } from "./task-client";

export default async function TaskPage({
  params,
}: {
  params: Promise<{ workspaceId: string; taskId: string }>;
}) {
  const session = await auth();
  const { workspaceId, taskId } = await params;

  if (!session?.user) {
    redirect("/sign-in");
  }

  const task = await getTask(taskId);

  if (!task || task.project.workspaceId !== workspaceId) {
    redirect(`/workspaces/${workspaceId}/tasks`);
  }

  return (
    <TaskClient initialData={task} />
  );
}
