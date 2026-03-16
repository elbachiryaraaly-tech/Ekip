import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { rateLimit } from "@/lib/rate-limit"
import { hashIP, generateEditToken } from "@/lib/utils"
import { sendRSVPConfirmationEmail } from "@/lib/email"
import { z } from "zod"

const rsvpSchema = z
  .object({
    firstName: z.string().min(1, "El nombre es obligatorio"),
    lastName: z.string().min(1, "Los apellidos son obligatorios"),
    email: z.string().email("Email inválido").optional(),
    phone: z.string().min(7, "El teléfono es obligatorio"),
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
    kidsMenu: z.boolean().default(false),
    specialNeeds: z.string().optional(),
    comments: z.string().optional(),
    gdprConsent: z.boolean().refine((val) => val === true, {
      message: "Debes aceptar la política de privacidad",
    }),
    honeypot: z.string().optional(), // Campo honeypot para anti-spam
  })
  .refine(
    (data) => !data.attending || !!data.menu,
    {
      path: ["menu"],
      message: "El menú principal es obligatorio si asistes",
    }
  )

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

    // Verificar si ya existe un RSVP con este email o teléfono
    let existingRSVP: any = null

    if (validatedData.email && validatedData.email.trim() !== "") {
      existingRSVP = await prisma.rSVP.findFirst({
        where: {
          email: validatedData.email,
          deletedAt: null,
        },
        orderBy: {
          createdAt: "desc",
        },
      })
    } else if (validatedData.phone && validatedData.phone.trim() !== "") {
      existingRSVP = await prisma.rSVP.findFirst({
        where: {
          phone: validatedData.phone,
          deletedAt: null,
        },
        orderBy: {
          createdAt: "desc",
        },
      })
    }

    const editToken = generateEditToken()
    const tokenExpiresAt = new Date()
    tokenExpiresAt.setDate(tokenExpiresAt.getDate() + 30) // Válido 30 días

    const ipHash = hashIP(ip)
    const userAgent = request.headers.get("user-agent") || undefined

    const emailForDb =
      validatedData.email && validatedData.email.trim() !== ""
        ? validatedData.email.trim()
        : `sin-email-${validatedData.phone || "desconocido"}@boda.local`

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
          kidsMenu: validatedData.kidsMenu,
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
          email: emailForDb,
          phone: validatedData.phone,
          attending: validatedData.attending,
          numGuests: validatedData.numGuests,
          guests: validatedData.guests ? JSON.stringify(validatedData.guests) : null,
          menu: validatedData.menu,
          allergies: validatedData.allergies,
          hasChildren: validatedData.hasChildren,
          numChildren: validatedData.numChildren,
          kidsMenu: validatedData.kidsMenu,
          specialNeeds: validatedData.specialNeeds,
          comments: validatedData.comments,
          editToken,
          tokenExpiresAt,
          ipHash,
          userAgent,
        },
      })
    }

    // Enviar email de confirmación solo si se ha proporcionado email
    if (validatedData.email && validatedData.email.trim() !== "") {
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







