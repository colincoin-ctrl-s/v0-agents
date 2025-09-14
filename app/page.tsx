"use client"

import { useState, useEffect, Suspense } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { ThemeToggle } from "@/components/theme-toggle"
import { RSSDisplay } from "@/components/rss-display"
import { AutoStartAgent } from "@/components/auto-start-agent"
import { OpeningFanfare } from "@/components/opening-fanfare"
import { BackgroundAgentManager } from "@/components/background-agent-manager"
import { FullscreenClonePreloader } from "@/components/fullscreen-clone-preloader"
import { Play, Square, Settings, Rss } from "lucide-react"

interface AgentConfig {
  prompt: string
  format: string
  interval: number
  maxItems: number
  categories: string[]
  geminiApiKey: string
  geminiModel: string
}

interface AgentInstance {
  id: string
  status: "running" | "stopped" | "error"
  lastUpdate: string
  config: {
    focusTopic: string
    outputFormat: string
    location: string
  }
}

function COASAGENTConfigContent() {
  const [isVerified, setIsVerified] = useState(false)
  const [currentInstanceId, setCurrentInstanceId] = useState<string | null>(null)
  const [agentStatus, setAgentStatus] = useState<"stopped" | "running" | "error">("stopped")
  const [instances, setInstances] = useState<AgentInstance[]>([])
  const [loading, setLoading] = useState(false)
  const [backgroundAgentEnabled, setBackgroundAgentEnabled] = useState(false)
  const [activeTab, setActiveTab] = useState<"config" | "rss">("config")
  const [agentConfig, setAgentConfig] = useState<AgentConfig>({
    prompt:
      "Train your A.I. RSS Agent to scan the internet RSS feeds with highly relevant context based on your dynamic outputs",
    format: "tech",
    interval: 42,
    maxItems: 10,
    categories: ["AI", "Technology", "Innovation"],
    geminiApiKey: "AIzaSyDl_of3M_KCHastfbykn5VshC8nwxps4eU",
    geminiModel: "gemini-2.5-flash",
  })

  const startAgent = async (config: AgentConfig) => {
    setLoading(true)
    try {
      const response = await fetch("/api/agent/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...config,
          role: {
            primaryRole: "AI RSS Agent",
            focusTopic: config.prompt,
            targetAudience: "Technology professionals",
            searchPurpose: "Generate RSS feeds with AI-curated content",
            dataPresentation: "RSS XML format",
          },
          outputFormat: config.format,
          geminiConfig: {
            apiKey: config.geminiApiKey,
            model: config.geminiModel,
          },
        }),
      })

      const data = await response.json()

      if (data.success) {
        setCurrentInstanceId(data.instanceId)
        setAgentStatus("running")
        setBackgroundAgentEnabled(true)
        setAgentConfig(config)
        console.log(`[v0] Agent started with instance ID: ${data.instanceId}`)
      } else {
        console.error("Failed to start agent:", data.error)
        alert(`Failed to start agent: ${data.error}`)
      }
    } catch (error) {
      console.error("Error starting agent:", error)
      alert("Error starting agent. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const stopAgent = async () => {
    if (!currentInstanceId) return

    setLoading(true)
    try {
      const response = await fetch("/api/agent/stop", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ instanceId: currentInstanceId }),
      })

      const data = await response.json()

      if (data.success) {
        setAgentStatus("stopped")
        setBackgroundAgentEnabled(false)
        console.log(`[v0] Agent stopped: ${currentInstanceId}`)
      } else {
        console.error("Failed to stop agent:", data.error)
      }
    } catch (error) {
      console.error("Error stopping agent:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchAgentStatus = async () => {
    try {
      const response = await fetch("/api/agent/status")
      if (response.ok) {
        const data = await response.json()
        setInstances(data.instances)

        if (currentInstanceId) {
          const currentInstance = data.instances.find((i: AgentInstance) => i.id === currentInstanceId)
          if (currentInstance) {
            setAgentStatus(currentInstance.status)
          }
        }
      }
    } catch (error) {
      console.error("Failed to fetch agent status:", error)
    }
  }

  useEffect(() => {
    fetchAgentStatus()
    const interval = setInterval(fetchAgentStatus, 42000)
    return () => clearInterval(interval)
  }, [currentInstanceId])

  if (!isVerified) {
    return <FullscreenClonePreloader onVerified={() => setIsVerified(true)} />
  }

  return (
    <div className="min-h-screen bg-background">
      <AutoStartAgent />
      <OpeningFanfare />
      <BackgroundAgentManager config={agentConfig} isEnabled={backgroundAgentEnabled} />

      {/* Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white">EXPERIMENTAL LABS</h1>
              <p className="text-muted-foreground mt-1">
                Train your A.I. RSS Agent to scan the internet RSS feeds with highly relevant context based on your
                dynamic outputs
              </p>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b">
        <div className="container mx-auto px-4">
          <div className="flex space-x-8">
            <button
              onClick={() => setActiveTab("config")}
              className={`py-4 px-2 border-b-2 font-medium text-sm ${
                activeTab === "config"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <Settings className="inline-block w-4 h-4 mr-2" />
              Configuration
            </button>
            <button
              onClick={() => setActiveTab("rss")}
              className={`py-4 px-2 border-b-2 font-medium text-sm ${
                activeTab === "rss"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <Rss className="inline-block w-4 h-4 mr-2" />
              RSS Feeds
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {activeTab === "config" ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Configuration Form */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Agent Configuration</CardTitle>
                  <CardDescription>Configure your AI RSS agent parameters</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="prompt">Focus Topic</Label>
                    <Textarea
                      id="prompt"
                      value={agentConfig.prompt}
                      onChange={(e) => setAgentConfig({ ...agentConfig, prompt: e.target.value })}
                      placeholder="What should your agent focus on?"
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="format">Output Format</Label>
                      <Select
                        value={agentConfig.format}
                        onValueChange={(value) => setAgentConfig({ ...agentConfig, format: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="tech">Technology</SelectItem>
                          <SelectItem value="business">Business</SelectItem>
                          <SelectItem value="science">Science</SelectItem>
                          <SelectItem value="general">General</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="interval">Update Interval (seconds)</Label>
                      <Input
                        id="interval"
                        type="number"
                        value={agentConfig.interval}
                        onChange={(e) =>
                          setAgentConfig({ ...agentConfig, interval: Number.parseInt(e.target.value) || 42 })
                        }
                        min="30"
                        max="3600"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="maxItems">Max Items per Feed</Label>
                    <Input
                      id="maxItems"
                      type="number"
                      value={agentConfig.maxItems}
                      onChange={(e) =>
                        setAgentConfig({ ...agentConfig, maxItems: Number.parseInt(e.target.value) || 10 })
                      }
                      min="5"
                      max="50"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="geminiApiKey">Gemini API Key</Label>
                      <Input
                        id="geminiApiKey"
                        type="password"
                        value={agentConfig.geminiApiKey}
                        onChange={(e) => setAgentConfig({ ...agentConfig, geminiApiKey: e.target.value })}
                        placeholder="Enter your Gemini API key"
                      />
                    </div>

                    <div>
                      <Label htmlFor="geminiModel">Gemini Model</Label>
                      <Select
                        value={agentConfig.geminiModel}
                        onValueChange={(value) => setAgentConfig({ ...agentConfig, geminiModel: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="gemini-2.5-flash">Gemini 2.5 Flash</SelectItem>
                          <SelectItem value="gemini-1.5-pro">Gemini 1.5 Pro</SelectItem>
                          <SelectItem value="gemini-1.5-flash">Gemini 1.5 Flash</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Status Panel */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    Agent Status
                    <Badge
                      variant={
                        agentStatus === "running" ? "default" : agentStatus === "error" ? "destructive" : "secondary"
                      }
                    >
                      {agentStatus}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {agentStatus === "stopped" ? (
                    <Button onClick={() => startAgent(agentConfig)} disabled={loading} className="w-full">
                      <Play className="w-4 h-4 mr-2" />
                      {loading ? "Starting..." : "Start Agent"}
                    </Button>
                  ) : (
                    <Button onClick={stopAgent} disabled={loading} variant="destructive" className="w-full">
                      <Square className="w-4 h-4 mr-2" />
                      {loading ? "Stopping..." : "Stop Agent"}
                    </Button>
                  )}

                  {instances.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="font-medium">Active Instances</h4>
                      {instances.map((instance) => (
                        <div key={instance.id} className="text-sm p-2 bg-muted rounded">
                          <div className="font-mono text-xs">{instance.id}</div>
                          <div className="text-muted-foreground">{instance.config.focusTopic}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        ) : (
          <RSSDisplay selectedFormat={agentConfig.format} agentStatus={agentStatus} />
        )}
      </div>
    </div>
  )
}

export default function COASAGENTConfig() {
  return (
    <Suspense
      fallback={<div className="min-h-screen bg-black flex items-center justify-center text-white">Loading...</div>}
    >
      <COASAGENTConfigContent />
    </Suspense>
  )
}
