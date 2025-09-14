"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"

interface CloneCaptchaProps {
  onVerified: (verified: boolean) => void
  isVerified?: boolean
}

export function CloneCaptcha({ onVerified, isVerified = false }: CloneCaptchaProps) {
  const [isActivated, setIsActivated] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const [isPreloading, setIsPreloading] = useState(false)
  const [preloadProgress, setPreloadProgress] = useState(0)
  const audioRef = useRef<HTMLAudioElement>(null)

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current.currentTime = 0
      }
    }
  }, [])

  const handleToggle = () => {
    if (isVerified) return

    setIsPreloading(true)
    setIsAnimating(true)

    const progressInterval = setInterval(() => {
      setPreloadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval)
          setTimeout(() => {
            setIsPreloading(false)
            setIsActivated(true)
            onVerified(true)
            setIsAnimating(false)

            if (audioRef.current) {
              audioRef.current.currentTime = 0
              audioRef.current.play().catch((error) => {
                console.log("Audio playback failed:", error)
              })
            }
          }, 500)
          return 100
        }
        return prev + 2
      })
    }, 30)
  }

  return (
    <Card className="border-2 border-orange-500/50 bg-gray-900/50 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <CardTitle className="text-center text-2xl font-bold text-white font-netflix tracking-wider">
          PROOF YOU'RE NOT A CLONE
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center space-y-6">
        <div className="relative">
          <Label className="text-sm text-gray-400 mb-4 block text-center font-netflix">
            Activate the lightsaber to prove your humanity
          </Label>

          <button
            onClick={handleToggle}
            disabled={isVerified || isPreloading}
            className={`
              relative w-48 h-24 rounded-full border-4 transition-all duration-500 cursor-pointer overflow-hidden
              ${
                isActivated
                  ? "bg-gradient-to-r from-red-900 to-red-600 border-red-500 shadow-2xl shadow-red-500/50"
                  : "bg-gradient-to-r from-gray-800 to-gray-600 border-gray-500"
              }
              ${isVerified ? "cursor-not-allowed opacity-75" : "hover:scale-105"}
              ${isAnimating ? "animate-pulse" : ""}
            `}
          >
            {isPreloading && (
              <div className="absolute inset-0 bg-black/90 flex items-center justify-center">
                <div className="w-36 h-3 bg-gray-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-orange-500 via-orange-400 to-red-500 transition-all duration-100 ease-out"
                    style={{ width: `${preloadProgress}%` }}
                  />
                </div>
              </div>
            )}

            <div
              className={`
                absolute top-2 w-20 h-20 rounded-full transition-all duration-500 flex items-center justify-center border-2
                ${
                  isActivated
                    ? "translate-x-24 bg-gradient-to-r from-orange-400 to-orange-600 border-orange-300 shadow-2xl shadow-orange-500/75"
                    : "translate-x-2 bg-gradient-to-r from-orange-500 to-orange-700 border-orange-400"
                }
              `}
            >
              {isActivated ? (
                <div className="relative">
                  <div className="w-5 h-12 bg-gradient-to-b from-gray-800 to-gray-600 rounded-sm border border-gray-700" />
                  <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 w-1 h-10 bg-gradient-to-t from-red-500 to-red-300 rounded-full animate-pulse shadow-2xl shadow-red-500/75" />
                  <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 w-3 h-10 bg-red-400/30 rounded-full animate-pulse" />
                </div>
              ) : (
                <div className="w-8 h-8 bg-orange-600 rounded-full border-2 border-orange-300 shadow-lg" />
              )}
            </div>

            <div className="absolute inset-0 flex items-center justify-between px-6 text-lg font-bold font-netflix">
              <span className={`transition-opacity ${isActivated ? "opacity-50" : "opacity-100"} text-gray-300`}>
                OFF
              </span>
              <span className={`transition-opacity ${isActivated ? "opacity-100" : "opacity-50"} text-orange-200`}>
                ON
              </span>
            </div>
          </button>
        </div>

        <div className="text-center">
          {isVerified ? (
            <div className="flex items-center gap-2 text-green-400">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="font-medium font-netflix text-lg">VERIFIED: You are not a clone</span>
            </div>
          ) : isPreloading ? (
            <div className="text-orange-400 font-netflix text-lg">
              <span>LOADING... {preloadProgress}%</span>
            </div>
          ) : (
            <div className="text-gray-400 font-netflix">
              <span>Please activate the switch to continue</span>
            </div>
          )}
        </div>

        <audio ref={audioRef} preload="metadata">
          <source src="/sounds/lightsaber-on.mp3" type="audio/mpeg" />
        </audio>
      </CardContent>
    </Card>
  )
}
