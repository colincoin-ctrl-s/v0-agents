"use client"

import { useState, useEffect, useCallback } from "react"
import { AgentStatusDisplay } from "./agent-status-display"

interface AgentConfig {
  location: {
    googleMapsPin: string
    radiusKm: number
  }
  role: {
    primaryRole: string
    focusTopic: string
    targetAudience: string
    searchPurpose: string
    dataPresentation: string
  }
  personalitySliders: {
    socialMood: number
    politicalBearing: number
    techSavviness: number
    presentationStyle: number
    contentDensity: number
  }
  contextOverride: string
  outputFormat: string
  dataSources: {
    llm: boolean
    internet: boolean
    reddit: boolean
    facebook: boolean
    twitter: boolean
    youtube: boolean
    instagram: boolean
  }
  modifiers: {
    hardFacts: boolean
    meaningFocus: boolean
    suggestiveMode: boolean
    strictGuidance: boolean
    laymanFriendly: boolean
    adultLanguage: boolean
    includeToolbox: boolean
    includeTips: boolean
  }
}

interface BackgroundAgentManagerProps {
  config: AgentConfig
  isEnabled: boolean
}

export function BackgroundAgentManager({ config, isEnabled }: BackgroundAgentManagerProps) {
  const [agentStatus, setAgentStatus] = useState<"running" | "stopped" | "error">("stopped")
  const [lastPromptTime, setLastPromptTime] = useState<Date | undefined>()
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null)

  // Save config to localStorage whenever it changes
  useEffect(() => {
    console.log("[v0] Saving config to localStorage:", config)
    localStorage.setItem("coasagent-config", JSON.stringify(config))
  }, [config])

  const runAgentPrompt = useCallback(async () => {
    try {
      console.log("[v0] Running agent prompt with config:", config)
      setLastPromptTime(new Date())

      // Simulate API call to Gemini AI agent
      const response = await fetch("/api/agent/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(config),
      })

      if (response.ok) {
        const data = await response.json()
        console.log("[v0] Agent prompt successful:", data)
        setAgentStatus("running")
      } else {
        console.error("[v0] Agent prompt failed:", response.statusText)
        setAgentStatus("error")
      }
    } catch (error) {
      console.error("[v0] Agent prompt error:", error)
      setAgentStatus("error")
    }
  }, [config])

  // Start/stop background agent based on isEnabled
  useEffect(() => {
    if (isEnabled && !intervalId) {
      console.log("[v0] Starting background agent with 42-second intervals")
      setAgentStatus("running")

      // Run immediately
      runAgentPrompt()

      // Then run every 42 seconds
      const id = setInterval(runAgentPrompt, 42000)
      setIntervalId(id)
    } else if (!isEnabled && intervalId) {
      console.log("[v0] Stopping background agent")
      clearInterval(intervalId)
      setIntervalId(null)
      setAgentStatus("stopped")
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId)
      }
    }
  }, [isEnabled, runAgentPrompt, intervalId])

  // Load saved config on mount
  useEffect(() => {
    const savedConfig = localStorage.getItem("coasagent-config")
    if (savedConfig) {
      console.log("[v0] Loaded saved config from localStorage")
    }
  }, [])

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <AgentStatusDisplay agentStatus={agentStatus} lastPromptTime={lastPromptTime} />
    </div>
  )
}
