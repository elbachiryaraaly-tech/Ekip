import { NextRequest, NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function POST(request: NextRequest) {
  try {
    await requireAuth()

    const body = await request.json()

    // Actualizar o crear cada setting
    for (const [key, value] of Object.entries(body)) {
      await prisma.settings.upsert({
        where: { key },
        update: { value: String(value) },
        create: { key, value: String(value) },
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error guardando settings:", error)
    return NextResponse.json({ error: "Error al guardar" }, { status: 500 })
  }
}







