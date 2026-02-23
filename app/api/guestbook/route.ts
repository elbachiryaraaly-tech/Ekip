import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { rateLimit } from "@/lib/rate-limit"
import { hashIP } from "@/lib/utils"
import { z } from "zod"

const guestbookSchema = z.object({
  name: z.string().min(1, "El nombre es obligatorio").max(100),
  message: z.string().min(1, "El mensaje es obligatorio").max(1000),
  honeypot: z.string().optional(),
})

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const ip = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown"
    const rateLimitResult = rateLimit(ip, 3, 60000) // 3 requests per minute

    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: "Demasiadas solicitudes. Por favor, intenta más tarde." },
        { status: 429 }
      )
    }

    const body = await request.json()

    // Honeypot check
    if (body.honeypot && body.honeypot !== "") {
      return NextResponse.json({ error: "Error de validación" }, { status: 400 })
    }

    // Validar datos
    const validatedData = guestbookSchema.parse(body)

    const ipHash = hashIP(ip)
    const userAgent = request.headers.get("user-agent") || undefined

    const entry = await prisma.guestbookEntry.create({
      data: {
        name: validatedData.name,
        message: validatedData.message,
        approved: false, // Requiere moderación
        ipHash,
        userAgent,
      },
    })

    return NextResponse.json({
      success: true,
      id: entry.id,
      message: "Tu mensaje ha sido enviado y será moderado antes de publicarse.",
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Datos inválidos", details: error.errors },
        { status: 400 }
      )
    }

    console.error("Error en guestbook:", error)
    return NextResponse.json(
      { error: "Error al procesar el mensaje" },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const entries = await prisma.guestbookEntry.findMany({
      where: {
        approved: true,
        deletedAt: null,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 50,
    })

    return NextResponse.json({ entries })
  } catch (error) {
    console.error("Error obteniendo guestbook:", error)
    return NextResponse.json({ error: "Error al obtener mensajes" }, { status: 500 })
  }
}







