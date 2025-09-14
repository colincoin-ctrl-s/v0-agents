"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"

export function ThemeToggle() {
  const [isDark, setIsDark] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)

  useEffect(() => {
    // Check for saved theme preference or default to dark
    const savedTheme = localStorage.getItem("theme")
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
    const shouldBeDark = savedTheme === "dark" || (!savedTheme && prefersDark)

    setIsDark(shouldBeDark)
    document.documentElement.classList.toggle("dark", shouldBeDark)
  }, [])

  const toggleTheme = () => {
    const newIsDark = !isDark
    setIsDark(newIsDark)
    document.documentElement.classList.toggle("dark", newIsDark)
    localStorage.setItem("theme", newIsDark ? "dark" : "light")

    if (audioRef.current) {
      audioRef.current.currentTime = 0
      audioRef.current.play().catch(console.error)
    }
  }

  return (
    <div className="flex items-center gap-4">
      <Button
        variant="ghost"
        size="lg"
        onClick={toggleTheme}
        className="relative w-24 h-12 p-0 border-2 border-primary hover:bg-accent/20 transition-all duration-500 overflow-hidden"
      >
        {isDark && (
          <div className="absolute inset-0 opacity-20">
            <img src="/images/darth-vader.png" alt="Darth Vader" className="w-full h-full object-contain" />
          </div>
        )}

        <div className="relative w-full h-full flex items-center justify-between px-2 z-10">
          {/* Jedi Icon (Light Mode) */}
          <div className={`transition-all duration-500 ${isDark ? "opacity-40 scale-75" : "opacity-100 scale-110"}`}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-primary">
              <path
                d="M12 2C10.5 2 9.5 3 9.5 4.5V6H8.5C8 6 7.5 6.5 7.5 7V8.5C7.5 9 8 9.5 8.5 9.5H9.5V11H10.5V9.5H13.5V11H14.5V9.5H15.5C16 9.5 16.5 9 16.5 8.5V7C16.5 6.5 16 6 15.5 6H14.5V4.5C14.5 3 13.5 2 12 2Z"
                fill="currentColor"
              />
              <rect x="11.5" y="11" width="1" height="10" fill="currentColor" className="animate-pulse" />
              <rect x="11" y="11" width="2" height="10" fill="currentColor" opacity="0.3" className="animate-pulse" />
            </svg>
          </div>

          {/* Darth Vader Icon (Dark Mode) */}
          <div className={`transition-all duration-500 ${isDark ? "opacity-100 scale-110" : "opacity-40 scale-75"}`}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-primary">
              <path
                d="M12 2C8.5 2 6 4.5 6 8V10C6 10.5 6.5 11 7 11H8V12C8 13 9 14 10 14H14C15 14 16 13 16 12V11H17C17.5 11 18 10.5 18 10V8C18 4.5 15.5 2 12 2Z"
                fill="currentColor"
              />
              <circle cx="10" cy="7" r="1" fill="currentColor" opacity="0.7" />
              <circle cx="14" cy="7" r="1" fill="currentColor" opacity="0.7" />
              <path d="M12 8.5V10.5" stroke="currentColor" strokeWidth="1" opacity="0.7" />
              <rect x="11.5" y="14" width="1" height="8" fill="#ef4444" className="animate-pulse" />
              <rect x="11" y="14" width="2" height="8" fill="#ef4444" opacity="0.3" className="animate-pulse" />
            </svg>
          </div>

          <div
            className={`absolute top-1 w-10 h-10 border-2 border-primary rounded-lg transition-all duration-500 flex items-center justify-center ${
              isDark
                ? "translate-x-12 bg-gradient-to-r from-red-900 to-red-600 shadow-lg shadow-red-500/50"
                : "translate-x-0 bg-gradient-to-r from-orange-400 to-orange-600 shadow-lg shadow-orange-500/50"
            }`}
          >
            {isDark ? (
              <div className="relative">
                <div className="w-2 h-6 bg-gradient-to-t from-red-500 to-red-300 rounded-full animate-pulse" />
                <div className="absolute inset-0 w-3 h-6 bg-red-400/30 rounded-full animate-pulse" />
              </div>
            ) : (
              <div className="w-2 h-6 bg-gradient-to-t from-blue-400 to-blue-200 rounded-full animate-pulse" />
            )}
          </div>
        </div>

        {/* Hidden audio element */}
        <audio ref={audioRef} preload="auto">
          <source src="/sounds/lightsaber-on.mp3" type="audio/mpeg" />
        </audio>
      </Button>
    </div>
  )
}
