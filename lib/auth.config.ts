import type { NextAuthConfig } from "next-auth"

export const authConfig = {
  pages: {
    signIn: "/sign-in",
    error: "/sign-in",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user
      const isAuthRoute = nextUrl.pathname.startsWith("/sign-in") || nextUrl.pathname.startsWith("/sign-up")
      const isApiRoute = nextUrl.pathname.startsWith("/api")
      
      if (isApiRoute) return true

      if (isAuthRoute) {
        if (isLoggedIn) {
          return Response.redirect(new URL("/", nextUrl))
        }
        return true
      }

      if (!isLoggedIn) {
        return Response.redirect(new URL("/sign-in", nextUrl))
      }

      return true
    },
  },
  providers: [], 
} satisfies NextAuthConfig
