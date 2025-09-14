import { NextResponse } from "next/server"
import { instanceManager } from "@/lib/instance-manager"

export async function GET() {
  try {
    const instances = instanceManager.getAllInstances()

    return NextResponse.json({
      instances: instances.map((instance) => ({
        id: instance.id,
        status: instance.status,
        lastUpdate: instance.lastRunAt || instance.createdAt,
        config: {
          focusTopic: instance.config.role.focusTopic,
          outputFormat: instance.config.outputFormat,
          location: instance.config.location.googleMapsPin,
        },
      })),
      stats: {
        total: instances.length,
        running: instances.filter((i) => i.status === "running").length,
        stopped: instances.filter((i) => i.status === "stopped").length,
        error: instances.filter((i) => i.status === "error").length,
      },
    })
  } catch (error: any) {
    console.error("[v0] Error getting agent status:", error)
    return NextResponse.json(
      {
        error: "Failed to get agent status",
        details: error.message,
      },
      { status: 500 },
    )
  }
}
