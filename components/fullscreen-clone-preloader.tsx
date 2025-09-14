"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"

interface FullscreenClonePreloaderProps {
  onVerified: () => void
}

export function FullscreenClonePreloader({ onVerified }: FullscreenClonePreloaderProps) {
  const [sliderPosition, setSliderPosition] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [isVerified, setIsVerified] = useState(false)
  const [showLightsaber, setShowLightsaber] = useState(false)
  const [isHovering, setIsHovering] = useState(false)
  const sliderRef = useRef<HTMLDivElement>(null)
  const audioRef = useRef<HTMLAudioElement>(null)

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true)
    e.preventDefault()
  }

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging || !sliderRef.current) return

    const rect = sliderRef.current.getBoundingClientRect()
    const newPosition = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100))
    setSliderPosition(newPosition)

    if (newPosition > 85) {
      setShowLightsaber(true)
      if (audioRef.current) {
        audioRef.current.currentTime = 0
        audioRef.current.play().catch(console.error)
      }
    }

    if (newPosition > 95) {
      setIsVerified(true)
      setIsDragging(false)
      setTimeout(() => {
        onVerified()
      }, 1000)
    }
  }

  const handleMouseUp = () => {
    if (!isVerified && sliderPosition < 95) {
      setSliderPosition(0)
      setShowLightsaber(false)
    }
    setIsDragging(false)
  }

  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove)
      document.addEventListener("mouseup", handleMouseUp)
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
    }
  }, [isDragging, sliderPosition])

  if (isVerified) {
    return (
      <div className="fixed inset-0 bg-[#0a0a0a] flex items-center justify-center z-50 transition-opacity duration-1000">
        <div className="text-center">
          <div className="netflix-h2 text-green-400 mb-4 animate-pulse">VERIFIED</div>
          <div className="netflix-body-large text-white">Welcome, Jedi...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-[#0a0a0a] flex flex-col items-center justify-center z-50">
      <div className="w-full max-w-4xl px-8 flex flex-col items-center">
        <div className="text-center mb-16">
          <h1 className="netflix-hero-title text-white mb-6 font-netflix tracking-wider">PROVE YOU ARE NOT A CLONE</h1>
          <p className="netflix-body-large text-gray-400">Slide to activate your lightsaber</p>
        </div>

        <div
          ref={sliderRef}
          className="relative w-full h-40 bg-gray-900 rounded-full border-8 border-orange-500 overflow-hidden cursor-pointer shadow-2xl shadow-orange-500/20"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          <div
            className={`absolute inset-0 transition-all duration-500 ${
              isHovering || showLightsaber
                ? "bg-gradient-to-r from-red-900/40 to-orange-900/40"
                : "bg-gradient-to-r from-orange-900/20 to-red-900/20"
            }`}
          />

          {(showLightsaber || isHovering) && (
            <div
              className={`absolute top-0 left-0 h-full transition-all duration-300 ${
                showLightsaber
                  ? "bg-gradient-to-r from-transparent via-red-500/60 to-red-400/40"
                  : "bg-gradient-to-r from-transparent via-orange-500/40 to-orange-400/20"
              }`}
              style={{ width: `${Math.max(sliderPosition, isHovering ? 20 : 0)}%` }}
            />
          )}

          <div
            className={`absolute top-4 w-32 h-32 rounded-full transition-all duration-300 flex items-center justify-center cursor-grab active:cursor-grabbing transform ${
              isHovering ? "scale-110" : "scale-100"
            } ${
              showLightsaber || isHovering
                ? "bg-gradient-to-r from-red-600 to-red-400 shadow-2xl shadow-red-500/60 border-4 border-red-300"
                : "bg-gradient-to-r from-orange-600 to-orange-400 shadow-2xl shadow-orange-500/60 border-4 border-orange-300"
            }`}
            style={{ left: `calc(${sliderPosition}% - 64px)` }}
            onMouseDown={handleMouseDown}
          >
            {showLightsaber || isHovering ? (
              <div className="relative">
                <div
                  className={`absolute -right-16 top-1/2 transform -translate-y-1/2 transition-all duration-300 ${
                    showLightsaber ? "w-64 h-3" : "w-32 h-2"
                  } bg-gradient-to-r from-red-500 to-transparent animate-pulse`}
                />
                <div
                  className={`absolute -right-16 top-1/2 transform -translate-y-1/2 transition-all duration-300 ${
                    showLightsaber ? "w-64 h-6" : "w-32 h-3"
                  } bg-red-400/40 animate-pulse`}
                />

                <div className="w-8 h-16 bg-gradient-to-b from-gray-200 to-gray-700 rounded-sm shadow-lg" />
                <div className="absolute top-2 left-2 w-4 h-3 bg-red-400 rounded-sm animate-pulse" />
              </div>
            ) : (
              <div className="w-12 h-12 bg-white rounded-full opacity-90 shadow-inner" />
            )}
          </div>

          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-white netflix-h4 font-netflix tracking-wide">
              {sliderPosition < 10
                ? "SLIDE TO VERIFY"
                : sliderPosition < 85
                  ? "KEEP SLIDING..."
                  : sliderPosition < 95
                    ? "ALMOST THERE!"
                    : "VERIFIED!"}
            </span>
          </div>
        </div>

        <div className="flex flex-col items-center mt-20">
          <div className="relative mb-8">
            <img
              src="/placeholder.svg?height=250&width=180"
              alt="Darth Vader"
              className="w-48 h-64 opacity-40 hover:opacity-70 transition-all duration-500 filter brightness-50"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-red-900/20 to-transparent animate-pulse" />
          </div>

          <div className="text-center max-w-2xl">
            <p className="netflix-h3 text-red-400 font-netflix tracking-wider mb-2">
              "I FIND YOUR LACK OF FAITH DISTURBING"
            </p>
            <p className="netflix-body text-gray-500 italic">- Darth Vader</p>
          </div>
        </div>
      </div>

      <audio ref={audioRef} preload="auto">
        <source src="/sounds/lightsaber-on.mp3" type="audio/mpeg" />
      </audio>
    </div>
  )
}
