import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const rsvpUpdateSchema = z.object({
  firstName: z.string().min(1).optional(),
  lastName: z.string().min(1).optional(),
  phone: z.string().optional(),
  attending: z.boolean().optional(),
  numGuests: z.number().int().min(0).optional(),
  guests: z
    .array(
      z.object({
        name: z.string().min(1),
        menu: z.string().optional(),
      })
    )
    .optional(),
  menu: z.enum(["Carne", "Pescado", "Vegetariano", "Vegano"]).optional(),
  allergies: z.string().optional(),
  hasChildren: z.boolean().optional(),
  numChildren: z.number().int().min(0).optional(),
  specialNeeds: z.string().optional(),
  comments: z.string().optional(),
})

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params
    const rsvp = await prisma.rSVP.findUnique({
      where: {
        editToken: token,
        deletedAt: null,
      },
    })

    if (!rsvp) {
      return NextResponse.json({ error: "RSVP no encontrado" }, { status: 404 })
    }

    if (new Date() > rsvp.tokenExpiresAt) {
      return NextResponse.json({ error: "El enlace ha expirado" }, { status: 410 })
    }

    return NextResponse.json({
      ...rsvp,
      guests: rsvp.guests ? JSON.parse(rsvp.guests as string) : null,
    })
  } catch (error) {
    console.error("Error obteniendo RSVP:", error)
    return NextResponse.json({ error: "Error al obtener RSVP" }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params
    const rsvp = await prisma.rSVP.findUnique({
      where: {
        editToken: token,
        deletedAt: null,
      },
    })

    if (!rsvp) {
      return NextResponse.json({ error: "RSVP no encontrado" }, { status: 404 })
    }

    if (new Date() > rsvp.tokenExpiresAt) {
      return NextResponse.json({ error: "El enlace ha expirado" }, { status: 410 })
    }

    const body = await request.json()
    const validatedData = rsvpUpdateSchema.parse(body)

    const updated = await prisma.rSVP.update({
      where: { id: rsvp.id },
      data: {
        ...validatedData,
        guests: validatedData.guests ? JSON.stringify(validatedData.guests) : undefined,
      },
    })

    return NextResponse.json({
      success: true,
      rsvp: {
        ...updated,
        guests: updated.guests ? JSON.parse(updated.guests as string) : null,
      },
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Datos inválidos", details: error.errors },
        { status: 400 }
      )
    }

    console.error("Error actualizando RSVP:", error)
    return NextResponse.json({ error: "Error al actualizar RSVP" }, { status: 500 })
  }
}

