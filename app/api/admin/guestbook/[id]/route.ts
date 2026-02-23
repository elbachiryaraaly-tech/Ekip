import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAuth } from "@/lib/auth"

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth()
    const { id } = await params

    const body = await request.json()
    const { approved } = body

    const entry = await prisma.guestbookEntry.update({
      where: { id },
      data: {
        approved: approved === true,
        approvedAt: approved === true ? new Date() : null,
        approvedBy: approved === true ? user.id : null,
      },
    })

    return NextResponse.json({ success: true, entry })
  } catch (error) {
    console.error("Error actualizando guestbook:", error)
    return NextResponse.json({ error: "Error al actualizar" }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAuth()
    const { id } = await params

    await prisma.guestbookEntry.update({
      where: { id },
      data: { deletedAt: new Date() },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error eliminando guestbook:", error)
    return NextResponse.json({ error: "Error al eliminar" }, { status: 500 })
  }
}







