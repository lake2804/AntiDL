"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return <div className="w-12 h-6 rounded-full bg-muted animate-pulse border border-border/50" />

  const isDark = resolvedTheme === "dark"

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="relative inline-flex h-9 w-16 items-center rounded-full bg-muted transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary border border-border/50 disabled:cursor-not-allowed disabled:opacity-50"
    >
      <span
        className={`${
          isDark ? "translate-x-8" : "translate-x-1"
        } inline-block h-7 w-7 transform rounded-full bg-white transition-transform flex items-center justify-center shadow-sm`}
      >
        {isDark ? (
          <Moon className="size-4.5 text-muted-foreground" />
        ) : (
          <Sun className="size-4.5 text-yellow-500" />
        )}
      </span>
      <span className="sr-only">Toggle theme</span>
    </button>
  )
}
