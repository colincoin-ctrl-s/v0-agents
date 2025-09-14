"use client"

import { useEffect, useState, useRef } from "react"

export function OpeningFanfare() {
  const [hasPlayed, setHasPlayed] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    // Only play once per session
    if (!hasPlayed && typeof window !== "undefined") {
      audioRef.current = new Audio("/sounds/star-wars-theme.mp3")
      audioRef.current.volume = 0.2 // Lower volume for better UX

      const playAudio = async () => {
        try {
          if (audioRef.current) {
            await audioRef.current.play()
            setHasPlayed(true)
          }
        } catch (error) {
          console.log("Audio autoplay blocked or failed:", error)
        }
      }

      // Delay to ensure DOM is ready
      const timer = setTimeout(playAudio, 1000)

      return () => {
        clearTimeout(timer)
        if (audioRef.current) {
          audioRef.current.pause()
          audioRef.current = null
        }
      }
    }
  }, [hasPlayed])

  return null // This component doesn't render anything
}
