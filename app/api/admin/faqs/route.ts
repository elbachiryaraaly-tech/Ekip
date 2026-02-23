import { NextRequest, NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const faqSchema = z.object({
  question: z.string().min(1, "La pregunta es requerida"),
  answer: z.string().min(1, "La respuesta es requerida"),
  order: z.number().int().default(0),
})

// GET - Obtener todas las FAQs
export async function GET() {
  try {
    const faqs = await prisma.fAQ.findMany({
      where: { deletedAt: null },
      orderBy: { order: "asc" },
    })

    return NextResponse.json(faqs)
  } catch (error) {
    console.error("Error obteniendo FAQs:", error)
    return NextResponse.json({ error: "Error al obtener FAQs" }, { status: 500 })
  }
}

// POST - Crear nueva FAQ
export async function POST(request: NextRequest) {
  try {
    await requireAuth()

    const body = await request.json()
    const validatedData = faqSchema.parse(body)

    // Obtener el máximo order para poner la nueva FAQ al final
    const maxOrder = await prisma.fAQ.findFirst({
      where: { deletedAt: null },
      orderBy: { order: "desc" },
      select: { order: true },
    })

    const faq = await prisma.fAQ.create({
      data: {
        question: validatedData.question,
        answer: validatedData.answer,
        order: maxOrder ? maxOrder.order + 1 : 0,
      },
    })

    return NextResponse.json(faq)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    console.error("Error creando FAQ:", error)
    return NextResponse.json({ error: "Error al crear FAQ" }, { status: 500 })
  }
}


