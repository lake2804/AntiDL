"use server"

import { signIn, signOut } from "@/lib/auth"
import { db } from "@/lib/db"
import bcrypt from "bcryptjs"
import { AuthError } from "next-auth"

export const login = async (email: string, password: string) => {
    try {
        await signIn("credentials", {
            email,
            password,
            redirect: false,
        })
        return { success: true }
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case "CredentialsSignin":
                    return { error: "Invalid credentials!" }
                default:
                    return { error: "Something went wrong!" }
            }
        }
        throw error
    }
}

export const register = async (name: string, email: string, password: string) => {
    const hashedPassword = await bcrypt.hash(password, 10)

    const existingUser = await db.user.findUnique({ where: { email } })

    if (existingUser) {
        return { error: "Email already in use!" }
    }

    // Create user
    const user = await db.user.create({
        data: {
            name,
            email,
            password: hashedPassword,
        },
    })

    // Auto-create a default workspace for the new user
    await db.workspace.create({
        data: {
            name: `${name}'s Workspace`,
            ownerId: user.id,
            inviteCode: Math.random().toString(36).substring(2, 10).toUpperCase(),
            members: {
                create: {
                    userId: user.id,
                    role: "ADMIN"
                }
            }
        }
    })

    return { success: true }
}

export const logout = async () => {
    await signOut({ redirectTo: "/sign-in" })
}
