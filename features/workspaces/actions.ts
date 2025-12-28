"use server"

import { db } from "@/lib/db"
import { auth } from "@/lib/auth"
import { revalidatePath } from "next/cache"

export const getWorkspaces = async () => {
    const session = await auth()
    console.log("getWorkspaces - Session user ID:", session?.user?.id)
    
    if (!session?.user?.id) {
        return []
    }

    const workspaces = await db.workspace.findMany({
        where: {
            OR: [
                { ownerId: session.user.id },
                { members: { some: { userId: session.user.id } } }
            ]
        },
        orderBy: { createdAt: "desc" }
    })

    console.log("getWorkspaces - Found workspaces:", workspaces.length, workspaces.map(w => ({ id: w.id, name: w.name, ownerId: w.ownerId })))

    return workspaces.map(w => ({
        id: w.id,
        name: w.name,
        imageUrl: w.imageUrl,
        ownerId: w.ownerId
    }))
}

export const getWorkspace = async (workspaceId: string) => {
    const session = await auth()
    if (!session?.user?.id) return null

    const workspace = await db.workspace.findUnique({
        where: { id: workspaceId }
    })

    return workspace
}

export const createWorkspace = async (name: string) => {
    const session = await auth()
    
    // Debug logging
    console.log("Session:", session)
    console.log("Session user:", session?.user)
    console.log("User ID:", session?.user?.id)
    
    if (!session?.user) {
        throw new Error("Not authenticated - please sign in again")
    }

    // Fallback: if user.id is missing from session, get it from database
    let userId = session.user.id
    if (!userId && session.user.email) {
        const user = await db.user.findUnique({
            where: { email: session.user.email }
        })
        if (user) {
            userId = user.id
        }
    }
    
    if (!userId) {
        throw new Error("User ID not found - please sign out and sign in again")
    }

    const workspace = await db.workspace.create({
        data: {
            name,
            ownerId: userId,
            inviteCode: Math.random().toString(36).substring(2, 10).toUpperCase(),
            members: {
                create: {
                    userId: userId,
                    role: "ADMIN"
                }
            }
        }
    })

    revalidatePath("/")
    return {
        id: workspace.id,
        name: workspace.name
    }
}

export const getMembers = async (workspaceId: string) => {
    const session = await auth()
    if (!session?.user?.id) return []

    const members = await db.member.findMany({
        where: { workspaceId },
        include: { user: true },
        orderBy: { joinedAt: "desc" }
    })

    return members
}

export const deleteMember = async (memberId: string) => {
    const session = await auth()
    if (!session?.user?.id) throw new Error("Unauthorized")

    const memberToDelete = await db.member.findUnique({
        where: { id: memberId },
        include: { workspace: true }
    })

    if (!memberToDelete) throw new Error("Member not found")

    // Only owner or admin can delete members (simplified for now)
    if (memberToDelete.workspace.ownerId !== session.user.id) {
        throw new Error("Unauthorized")
    }

    await db.member.delete({
        where: { id: memberId }
    })

    revalidatePath(`/workspaces/${memberToDelete.workspaceId}/members`)
}

export const updateMember = async (memberId: string, role: string) => {
    const session = await auth()
    if (!session?.user?.id) throw new Error("Unauthorized")

    const memberToUpdate = await db.member.findUnique({
        where: { id: memberId },
        include: { workspace: true }
    })

    if (!memberToUpdate) throw new Error("Member not found")

    if (memberToUpdate.workspace.ownerId !== session.user.id) {
        throw new Error("Unauthorized")
    }

    await db.member.update({
        where: { id: memberId },
        data: { role }
    })

    revalidatePath(`/workspaces/${memberToUpdate.workspaceId}/members`)
}

export const updateWorkspace = async (workspaceId: string, name: string) => {
    const session = await auth()
    if (!session?.user?.id) throw new Error("Unauthorized")

    const workspace = await db.workspace.findUnique({
        where: { id: workspaceId }
    })

    if (!workspace || workspace.ownerId !== session.user.id) {
        throw new Error("Unauthorized")
    }

    await db.workspace.update({
        where: { id: workspaceId },
        data: { name }
    })

    revalidatePath(`/workspaces/${workspaceId}`)
    revalidatePath(`/workspaces/${workspaceId}/settings`)
}

export const deleteWorkspace = async (workspaceId: string) => {
    const session = await auth()
    if (!session?.user?.id) throw new Error("Unauthorized")

    const workspace = await db.workspace.findUnique({
        where: { id: workspaceId }
    })

    if (!workspace || workspace.ownerId !== session.user.id) {
        throw new Error("Unauthorized")
    }

    await db.workspace.delete({
        where: { id: workspaceId }
    })

    revalidatePath("/")
}

export const resetInviteCode = async (workspaceId: string) => {
    const session = await auth()
    if (!session?.user?.id) throw new Error("Unauthorized")

    const workspace = await db.workspace.findUnique({
        where: { id: workspaceId }
    })

    if (!workspace || workspace.ownerId !== session.user.id) {
        throw new Error("Unauthorized")
    }

    const newInviteCode = Math.random().toString(36).substring(2, 10).toUpperCase()

    await db.workspace.update({
        where: { id: workspaceId },
        data: { inviteCode: newInviteCode }
    })

    revalidatePath(`/workspaces/${workspaceId}/settings`)
}

export const joinWorkspace = async (workspaceId: string, inviteCode: string) => {
    const session = await auth()
    if (!session?.user?.id) throw new Error("Unauthorized")

    const workspace = await db.workspace.findUnique({
        where: { id: workspaceId }
    })

    if (!workspace || workspace.inviteCode !== inviteCode) {
        throw new Error("Invalid invite code")
    }

    const existingMember = await db.member.findUnique({
        where: {
            userId_workspaceId: {
                userId: session.user.id,
                workspaceId: workspaceId
            }
        }
    })

    if (existingMember) {
        return { success: true, workspaceId }
    }

    await db.member.create({
        data: {
            userId: session.user.id,
            workspaceId,
            role: "MEMBER"
        }
    })

    revalidatePath("/")
    revalidatePath(`/workspaces/${workspaceId}`)
    
    return { success: true, workspaceId }
}
