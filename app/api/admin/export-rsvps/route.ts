import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const rsvps = await prisma.rSVP.findMany({
      where: { deletedAt: null },
      orderBy: { createdAt: "desc" },
    })

    // Generar CSV
    const headers = [
      "ID",
      "Nombre",
      "Apellidos",
      "Email",
      "Teléfono",
      "Asiste",
      "Acompañantes",
      "Menú",
      "Alergias",
      "Tiene niños",
      "Número de niños",
      "Necesidades especiales",
      "Comentarios",
      "Fecha creación",
      "Última actualización",
    ]

    const rows = rsvps.map((rsvp) => {
      const guests = rsvp.guests ? JSON.parse(rsvp.guests as string) : null
      const guestsNames = guests
        ? guests.map((g: any) => g.name).join("; ")
        : ""

      return [
        rsvp.id,
        rsvp.firstName,
        rsvp.lastName,
        rsvp.email,
        rsvp.phone || "",
        rsvp.attending ? "Sí" : "No",
        rsvp.numGuests.toString(),
        rsvp.menu || "",
        rsvp.allergies || "",
        rsvp.hasChildren ? "Sí" : "No",
        rsvp.numChildren.toString(),
        rsvp.specialNeeds || "",
        rsvp.comments || "",
        rsvp.createdAt.toISOString(),
        rsvp.updatedAt.toISOString(),
      ]
    })

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")),
    ].join("\n")

    return new NextResponse(csvContent, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="rsvps-${new Date().toISOString().split("T")[0]}.csv"`,
      },
    })
  } catch (error) {
    console.error("Error exportando RSVPs:", error)
    return NextResponse.json({ error: "Error al exportar" }, { status: 500 })
  }
}







