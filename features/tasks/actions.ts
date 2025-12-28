"use server"

import { db } from "@/lib/db"
import { auth } from "@/lib/auth"
import { revalidatePath } from "next/cache"

export const getTasks = async (workspaceId: string) => {
    const session = await auth()
    if (!session) return []

    const tasks = await db.task.findMany({
        where: {
            project: { workspaceId }
        },
        include: {
            project: true,
            assignee: true
        },
        orderBy: { createdAt: "desc" }
    })

    return tasks
}

export const getProjectTasks = async (projectId: string) => {
    const session = await auth()
    if (!session) return []

    const tasks = await db.task.findMany({
        where: { projectId },
        include: {
            project: true,
            assignee: true
        },
        orderBy: { position: "asc" }
    })

    return tasks
}

export const createTask = async (data: {
    title: string
    description?: string
    status: string
    priority?: string
    startDate?: Date
    dueDate?: Date
    projectId: string
    assigneeId: string
    color?: string
}) => {
    const session = await auth()
    if (!session) throw new Error("Unauthorized")

    const maxPosition = await db.task.findFirst({
        where: { projectId: data.projectId, status: data.status },
        orderBy: { position: "desc" }
    })

    const task = await db.task.create({
        data: {
            ...data,
            position: (maxPosition?.position ?? 0) + 1000
        }
    })

    revalidatePath("/")
    return task
}

export const updateTask = async (id: string, data: Partial<{
    title: string
    description: string
    status: string
    priority: string
    startDate: Date | null
    dueDate: Date | null
    assigneeId: string
    position: number
    color: string
}>) => {
    const session = await auth()
    if (!session) throw new Error("Unauthorized")

    const task = await db.task.update({
        where: { id },
        data
    })

    revalidatePath("/")
    return task
}

export const deleteTask = async (id: string) => {
    const session = await auth()
    if (!session) throw new Error("Unauthorized")

    await db.task.delete({ where: { id } })

    revalidatePath("/")
    return { success: true }
}

export const getDashboardStats = async (workspaceId: string) => {
    const session = await auth()
    if (!session || !session.user || !session.user.id) {
        return null
    }
    const userId = session.user.id

    const projectCount = await db.project.count({ where: { workspaceId } })
    const totalTasks = await db.task.count({ where: { project: { workspaceId } } })
    const assignedTasks = await db.task.count({ where: { project: { workspaceId }, assigneeId: userId } })
    const completedTasks = await db.task.count({ where: { project: { workspaceId }, status: "DONE" } })
    const overdueTasks = await db.task.count({ where: { project: { workspaceId }, dueDate: { lt: new Date() }, status: { not: "DONE" } } })

    return {
        projectCount,
        totalTasks,
        assignedTasks,
        completedTasks,
        overdueTasks
    }
}

export const updateTaskStatus = async (id: string, status: string, newPosition: number) => {
    const session = await auth()
    if (!session) throw new Error("Unauthorized")

    await db.task.update({
        where: { id },
        data: { status, position: newPosition }
    })

    revalidatePath("/")
    return { success: true }
}

export const getTask = async (taskId: string) => {
    const session = await auth()
    if (!session) return null

    const task = await db.task.findUnique({
        where: { id: taskId },
        include: {
            project: true,
            assignee: true
        }
    })

    return task
}
