import NextAuth from "next-auth"
import { authConfig } from "./auth.config"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { db } from "@/lib/db"
import Credentials from "next-auth/providers/credentials"
import { z } from "zod"
import bcrypt from "bcryptjs"

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" },
  providers: [
    Credentials({
      async authorize(credentials) {
        const validatedFields = z.object({
          email: z.string().email(),
          password: z.string().min(1),
        }).safeParse(credentials)

        if (validatedFields.success) {
          const { email, password } = validatedFields.data
          const user = await db.user.findUnique({ where: { email } })
          if (!user || !user.password) return null
          
          const passwordsMatch = await bcrypt.compare(password, user.password)
          if (passwordsMatch) return user
        }
        return null
      }
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
      }
      return session
    }
  }
})
