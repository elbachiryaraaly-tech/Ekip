import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { rateLimit } from "@/lib/rate-limit"
import { hashIP, generateEditToken } from "@/lib/utils"
import { sendRSVPConfirmationEmail } from "@/lib/email"
import { z } from "zod"

const rsvpSchema = z.object({
  firstName: z.string().min(1, "El nombre es obligatorio"),
  lastName: z.string().min(1, "Los apellidos son obligatorios"),
  email: z.string().email("Email inválido"),
  phone: z.string().optional(),
  attending: z.boolean(),
  numGuests: z.number().int().min(0).default(0),
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
  hasChildren: z.boolean().default(false),
  numChildren: z.number().int().min(0).default(0),
  specialNeeds: z.string().optional(),
  comments: z.string().optional(),
  gdprConsent: z.boolean().refine((val) => val === true, {
    message: "Debes aceptar la política de privacidad",
  }),
  honeypot: z.string().optional(), // Campo honeypot para anti-spam
})

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const ip = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown"
    const rateLimitResult = rateLimit(ip, 5, 60000) // 5 requests per minute

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
    const validatedData = rsvpSchema.parse(body)

    // Verificar si ya existe un RSVP con este email
    const existingRSVP = await prisma.rSVP.findFirst({
      where: {
        email: validatedData.email,
        deletedAt: null,
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    const editToken = generateEditToken()
    const tokenExpiresAt = new Date()
    tokenExpiresAt.setDate(tokenExpiresAt.getDate() + 30) // Válido 30 días

    const ipHash = hashIP(ip)
    const userAgent = request.headers.get("user-agent") || undefined

    let rsvp

    if (existingRSVP) {
      // Actualizar RSVP existente
      rsvp = await prisma.rSVP.update({
        where: { id: existingRSVP.id },
        data: {
          firstName: validatedData.firstName,
          lastName: validatedData.lastName,
          phone: validatedData.phone,
          attending: validatedData.attending,
          numGuests: validatedData.numGuests,
          guests: validatedData.guests ? JSON.stringify(validatedData.guests) : null,
          menu: validatedData.menu,
          allergies: validatedData.allergies,
          hasChildren: validatedData.hasChildren,
          numChildren: validatedData.numChildren,
          specialNeeds: validatedData.specialNeeds,
          comments: validatedData.comments,
          editToken,
          tokenExpiresAt,
          ipHash,
          userAgent,
        },
      })
    } else {
      // Crear nuevo RSVP
      rsvp = await prisma.rSVP.create({
        data: {
          firstName: validatedData.firstName,
          lastName: validatedData.lastName,
          email: validatedData.email,
          phone: validatedData.phone,
          attending: validatedData.attending,
          numGuests: validatedData.numGuests,
          guests: validatedData.guests ? JSON.stringify(validatedData.guests) : null,
          menu: validatedData.menu,
          allergies: validatedData.allergies,
          hasChildren: validatedData.hasChildren,
          numChildren: validatedData.numChildren,
          specialNeeds: validatedData.specialNeeds,
          comments: validatedData.comments,
          editToken,
          tokenExpiresAt,
          ipHash,
          userAgent,
        },
      })
    }

    // Enviar email de confirmación
    try {
      await sendRSVPConfirmationEmail(validatedData.email, {
        firstName: validatedData.firstName,
        lastName: validatedData.lastName,
        attending: validatedData.attending,
        editToken,
      })
    } catch (emailError) {
      console.error("Error enviando email:", emailError)
      // No fallar la request si el email falla
    }

    return NextResponse.json({
      success: true,
      editToken,
      id: rsvp.id,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Datos inválidos", details: error.errors },
        { status: 400 }
      )
    }

    console.error("Error en RSVP:", error)
    return NextResponse.json(
      { error: "Error al procesar la confirmación" },
      { status: 500 }
    )
  }
}







