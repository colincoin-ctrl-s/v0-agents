"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Activity, Clock, Zap } from "lucide-react"

interface AgentStatusDisplayProps {
  agentStatus: "running" | "stopped" | "error"
  lastPromptTime?: Date
}

export function AgentStatusDisplay({ agentStatus, lastPromptTime }: AgentStatusDisplayProps) {
  const [secondsAgo, setSecondsAgo] = useState(0)
  const [nextPromptIn, setNextPromptIn] = useState(42)

  useEffect(() => {
    const interval = setInterval(() => {
      if (lastPromptTime) {
        const now = new Date()
        const diffInSeconds = Math.floor((now.getTime() - lastPromptTime.getTime()) / 1000)
        setSecondsAgo(diffInSeconds)

        // Calculate next prompt countdown (42 second intervals)
        const nextPrompt = 42 - (diffInSeconds % 42)
        setNextPromptIn(nextPrompt === 42 ? 0 : nextPrompt)
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [lastPromptTime])

  const getStatusColor = () => {
    switch (agentStatus) {
      case "running":
        return "bg-green-500/20 text-green-400 border-green-500/50"
      case "error":
        return "bg-red-500/20 text-red-400 border-red-500/50"
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/50"
    }
  }

  const getStatusIcon = () => {
    switch (agentStatus) {
      case "running":
        return <Zap className="h-4 w-4 animate-pulse" />
      case "error":
        return <Activity className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  return (
    <Card className="border-primary/30 bg-card/80 backdrop-blur-sm">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-sm">
          {getStatusIcon()}
          Agent Status
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Status:</span>
          <Badge className={`${getStatusColor()} font-mono text-xs`}>{agentStatus.toUpperCase()}</Badge>
        </div>

        {agentStatus === "running" && lastPromptTime && (
          <>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Last prompt:</span>
              <span className="text-sm font-mono text-primary">{secondsAgo}s ago</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Next prompt in:</span>
              <span className="text-sm font-mono text-orange-400">{nextPromptIn}s</span>
            </div>

            {/* Progress bar for next prompt */}
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-orange-500 to-red-500 h-2 rounded-full transition-all duration-1000"
                style={{ width: `${((42 - nextPromptIn) / 42) * 100}%` }}
              />
            </div>
          </>
        )}

        {agentStatus === "stopped" && (
          <div className="text-center text-sm text-muted-foreground py-2">Agent is currently inactive</div>
        )}

        {agentStatus === "error" && (
          <div className="text-center text-sm text-red-400 py-2">Agent encountered an error</div>
        )}
      </CardContent>
    </Card>
  )
}
