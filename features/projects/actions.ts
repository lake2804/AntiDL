"use server"

import { db } from "@/lib/db"
import { auth } from "@/lib/auth"
import { revalidatePath } from "next/cache"

export const getProjects = async (workspaceId: string) => {
    const session = await auth()
    if (!session) return []

    const projects = await db.project.findMany({
        where: { workspaceId },
        orderBy: { createdAt: "desc" }
    })

    return projects
}
export const createProject = async (data: {
    name: string
    workspaceId: string
    imageUrl?: string
}) => {
    const session = await auth()
    if (!session) throw new Error("Unauthorized")
    if (data.workspaceId === "undefined") throw new Error("Invalid workspace ID")

    const project = await db.project.create({
        data
    })

    revalidatePath("/")
    return project
}

export const getProject = async (projectId: string) => {
    const session = await auth()
    if (!session) return null

    const project = await db.project.findUnique({
        where: { id: projectId },
        include: { workspace: true }
    })

    return project
}

export const updateProject = async (projectId: string, name: string) => {
    const session = await auth()
    if (!session?.user?.id) throw new Error("Unauthorized")

    const project = await db.project.findUnique({
        where: { id: projectId }
    })

    if (!project) throw new Error("Project not found")

    await db.project.update({
        where: { id: projectId },
        data: { name }
    })

    revalidatePath(`/workspaces/${project.workspaceId}/projects/${projectId}`)
}

export const deleteProject = async (projectId: string) => {
    const session = await auth()
    if (!session?.user?.id) throw new Error("Unauthorized")

    const project = await db.project.findUnique({
        where: { id: projectId }
    })

    if (!project) throw new Error("Project not found")

    await db.project.delete({
        where: { id: projectId }
    })

    revalidatePath(`/workspaces/${project.workspaceId}`)
}
