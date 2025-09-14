"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, ChevronRight, Play, Pause, Settings, BarChart3 } from "lucide-react"
import { useForm } from "react-hook-form"
import { CloneCaptcha } from "./clone-captcha"
import { RSSDisplay } from "./rss-display"
import { ThemeToggle } from "./theme-toggle"

interface AgentConfig {
  prompt: string
  format: string
  interval: number
  maxItems: number
  categories: string[]
  geminiApiKey: string
  geminiModel: string
}

interface NetflixSwipeInterfaceProps {
  agentStatus: "running" | "stopped" | "error"
  onStartAgent: (config: AgentConfig) => void
  onStopAgent: () => void
}

export function NetflixSwipeInterface({ agentStatus, onStartAgent, onStopAgent }: NetflixSwipeInterfaceProps) {
  const [currentPanel, setCurrentPanel] = useState(0)
  const [isVerified, setIsVerified] = useState(false)
  const [isPreloading, setIsPreloading] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)

  const form = useForm<AgentConfig>({
    defaultValues: {
      prompt:
        "Train your A.I. RSS Agent to scan the internet RSS feeds with highly relevant context based on your dynamic outputs",
      format: "tech",
      interval: 42,
      maxItems: 10,
      categories: ["AI", "Technology", "Innovation"],
      geminiApiKey: "AIzaSyDl_of3M_KCHastfbykn5VshC8nwxps4eU",
      geminiModel: "gemini-2.5-flash",
    },
  })

  const panels = [
    { id: "config", title: "AGENT CONFIGURATION", icon: Settings },
    { id: "dashboard", title: "RSS DASHBOARD", icon: BarChart3 },
  ]

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.play().catch(console.error)
    }
  }, [])

  const handleSwipe = (direction: "left" | "right") => {
    if (direction === "right" && currentPanel < panels.length - 1) {
      if (currentPanel === 0 && !isVerified) {
        // Show preloader before allowing access to dashboard
        setIsPreloading(true)
        setTimeout(() => {
          setIsPreloading(false)
          setCurrentPanel(currentPanel + 1)
        }, 2000)
      } else {
        setCurrentPanel(currentPanel + 1)
      }
    } else if (direction === "left" && currentPanel > 0) {
      setCurrentPanel(currentPanel - 1)
    }
  }

  const onSubmit = (data: AgentConfig) => {
    onStartAgent(data)
  }

  return (
    <div className="netflix-fullscreen min-h-screen bg-black text-white relative overflow-hidden">
      <audio ref={audioRef} loop preload="auto">
        <source src="/sounds/star-wars-theme.mp3" type="audio/mpeg" />
      </audio>

      <header className="absolute top-0 left-0 right-0 z-50 p-6 bg-gradient-to-b from-black/80 to-transparent">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="font-netflix text-4xl font-bold text-white tracking-wider">EXPERIMENTAL LABS</h1>
            <Badge variant="outline" className="border-orange-500 text-orange-500">
              BETA
            </Badge>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <div className="text-sm text-gray-400">{agentStatus === "running" ? "ACTIVE" : "STANDBY"}</div>
          </div>
        </div>
      </header>

      <div className="absolute top-24 left-0 right-0 z-40 px-6">
        <div className="flex gap-8">
          {panels.map((panel, index) => (
            <button
              key={panel.id}
              onClick={() => setCurrentPanel(index)}
              className={`font-netflix text-xl font-bold tracking-wide transition-all duration-300 ${
                currentPanel === index
                  ? "text-orange-500 border-b-2 border-orange-500"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              {panel.title}
            </button>
          ))}
        </div>
      </div>

      {isPreloading && (
        <div className="absolute inset-0 z-50 bg-black flex items-center justify-center">
          <div className="text-center">
            <div className="w-64 h-2 bg-gray-800 rounded-full overflow-hidden mb-4">
              <div className="preloader-slider h-full w-full bg-gradient-to-r from-transparent via-orange-500 to-transparent"></div>
            </div>
            <p className="font-netflix text-xl text-orange-500">ACCESSING SECURE SYSTEMS...</p>
          </div>
        </div>
      )}

      <div className="pt-40 px-6 pb-6 h-full">
        <div
          className="flex transition-transform duration-500 ease-in-out h-full"
          style={{ transform: `translateX(-${currentPanel * 100}%)` }}
        >
          {/* Configuration Panel */}
          <div className="w-full flex-shrink-0 pr-6">
            <div className="max-w-4xl mx-auto">
              <div className="mb-8">
                <h2 className="font-netflix text-3xl font-bold text-white mb-2">CONFIGURE YOUR AGENT</h2>
                <p className="text-gray-400 text-lg">{form.watch("prompt")}</p>
              </div>

              <div className="mb-8">
                <CloneCaptcha onVerified={setIsVerified} />
              </div>

              {isVerified && (
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="prompt"
                        render={({ field }) => (
                          <FormItem className="md:col-span-2">
                            <FormLabel className="text-orange-500 font-netflix text-lg">AGENT PROMPT</FormLabel>
                            <FormControl>
                              <Textarea
                                {...field}
                                className="bg-gray-900/50 border-gray-700 text-white min-h-24"
                                placeholder="Enter your agent's mission..."
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="format"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-orange-500 font-netflix text-lg">RSS FORMAT</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger className="bg-gray-900/50 border-gray-700 text-white">
                                  <SelectValue />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent className="bg-gray-900 border-gray-700">
                                <SelectItem value="tech">Technology</SelectItem>
                                <SelectItem value="ai">Artificial Intelligence</SelectItem>
                                <SelectItem value="crypto">Cryptocurrency</SelectItem>
                                <SelectItem value="startup">Startups</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="interval"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-orange-500 font-netflix text-lg">
                              SCAN INTERVAL (SECONDS)
                            </FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                type="number"
                                className="bg-gray-900/50 border-gray-700 text-white"
                                onChange={(e) => field.onChange(Number.parseInt(e.target.value))}
                              />
                            </FormControl>
                            <FormDescription className="text-gray-400">
                              Agent will scan every {field.value} seconds
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="geminiApiKey"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-orange-500 font-netflix text-lg">GEMINI API KEY</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                type="password"
                                className="bg-gray-900/50 border-gray-700 text-white"
                                placeholder="Enter your Gemini API key..."
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="geminiModel"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-orange-500 font-netflix text-lg">GEMINI MODEL</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                className="bg-gray-900/50 border-gray-700 text-white"
                                placeholder="gemini-2.5-flash"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="flex gap-4 pt-6">
                      {agentStatus === "running" ? (
                        <Button
                          type="button"
                          onClick={onStopAgent}
                          size="lg"
                          className="bg-red-600 hover:bg-red-700 text-white font-netflix text-lg px-8"
                        >
                          <Pause className="mr-2 h-5 w-5" />
                          STOP AGENT
                        </Button>
                      ) : (
                        <Button
                          type="submit"
                          size="lg"
                          className="bg-orange-600 hover:bg-orange-700 text-white font-netflix text-lg px-8"
                        >
                          <Play className="mr-2 h-5 w-5" />
                          START AGENT
                        </Button>
                      )}
                    </div>
                  </form>
                </Form>
              )}
            </div>
          </div>

          {/* Dashboard Panel */}
          <div className="w-full flex-shrink-0 pl-6">
            <div className="max-w-6xl mx-auto">
              <div className="mb-8">
                <h2 className="font-netflix text-3xl font-bold text-white mb-2">RSS DASHBOARD</h2>
                <p className="text-gray-400 text-lg">Monitor your agent's RSS feed generation in real-time</p>
              </div>

              <RSSDisplay selectedFormat={form.watch("format")} agentStatus={agentStatus} />
            </div>
          </div>
        </div>
      </div>

      <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-40">
        <Button
          variant="ghost"
          size="lg"
          onClick={() => handleSwipe("left")}
          disabled={currentPanel === 0}
          className="bg-black/50 hover:bg-black/70 text-white border-orange-500 disabled:opacity-30"
        >
          <ChevronLeft className="h-8 w-8" />
        </Button>
      </div>

      <div className="absolute right-4 top-1/2 transform -translate-y-1/2 z-40">
        <Button
          variant="ghost"
          size="lg"
          onClick={() => handleSwipe("right")}
          disabled={currentPanel === panels.length - 1 || (currentPanel === 0 && !isVerified)}
          className="bg-black/50 hover:bg-black/70 text-white border-orange-500 disabled:opacity-30"
        >
          <ChevronRight className="h-8 w-8" />
        </Button>
      </div>

      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-40">
        <div className="flex gap-2">
          {panels.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentPanel(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                currentPanel === index ? "bg-orange-500" : "bg-gray-600"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
