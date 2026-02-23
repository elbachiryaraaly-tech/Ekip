import { NextRequest, NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const faqSchema = z.object({
  question: z.string().min(1, "La pregunta es requerida"),
  answer: z.string().min(1, "La respuesta es requerida"),
  order: z.number().int().optional(),
})

// PATCH - Actualizar FAQ
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAuth()
    const { id } = await params

    const body = await request.json()
    const validatedData = faqSchema.parse(body)

    const faq = await prisma.fAQ.update({
      where: { id },
      data: {
        question: validatedData.question,
        answer: validatedData.answer,
        ...(validatedData.order !== undefined && { order: validatedData.order }),
      },
    })

    return NextResponse.json(faq)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    console.error("Error actualizando FAQ:", error)
    return NextResponse.json({ error: "Error al actualizar FAQ" }, { status: 500 })
  }
}

// DELETE - Eliminar FAQ (soft delete)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAuth()
    const { id } = await params

    await prisma.fAQ.update({
      where: { id },
      data: { deletedAt: new Date() },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error eliminando FAQ:", error)
    return NextResponse.json({ error: "Error al eliminar FAQ" }, { status: 500 })
  }
}


