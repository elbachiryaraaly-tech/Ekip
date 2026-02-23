import { getCurrentUser } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { AdminNav } from "@/components/admin/admin-nav"
import { LogoutButton } from "@/components/admin/logout-button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { formatDateTime } from "@/lib/utils"

async function getRSVP(id: string) {
  const rsvp = await prisma.rSVP.findUnique({
    where: { id },
  })

  if (!rsvp) {
    return null
  }

  return {
    ...rsvp,
    guests: rsvp.guests ? JSON.parse(rsvp.guests as string) : null,
  }
}

export default async function RSVPDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/admin/login")
  }

  const { id } = await params
  const rsvp = await getRSVP(id)

  if (!rsvp) {
    return (
      <div className="min-h-screen bg-secondary flex items-center justify-center">
        <Card>
          <CardContent className="pt-6">
            <p>RSVP no encontrado</p>
            <Button asChild className="mt-4">
              <Link href="/admin/rsvps">Volver</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-secondary">
      <AdminNav />
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <Button variant="outline" asChild>
              <Link href="/admin/rsvps">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Volver
              </Link>
            </Button>
            <h1 className="text-3xl font-serif font-bold text-primary">
              Detalle de RSVP
            </h1>
          </div>
          <LogoutButton />
        </div>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Información personal</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Nombre completo</p>
                <p className="font-semibold">
                  {rsvp.firstName} {rsvp.lastName}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p>{rsvp.email}</p>
              </div>
              {rsvp.phone && (
                <div>
                  <p className="text-sm text-muted-foreground">Teléfono</p>
                  <p>{rsvp.phone}</p>
                </div>
              )}
              <div>
                <p className="text-sm text-muted-foreground">Asistencia</p>
                <Badge variant={rsvp.attending ? "default" : "secondary"}>
                  {rsvp.attending ? "Sí asistirá" : "No asistirá"}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {rsvp.attending && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>Detalles de asistencia</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Acompañantes</p>
                    <p className="font-semibold">{rsvp.numGuests}</p>
                  </div>
                  {rsvp.guests && Array.isArray(rsvp.guests) && rsvp.guests.length > 0 && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Datos de acompañantes</p>
                      <div className="space-y-2">
                        {rsvp.guests.map((guest: any, i: number) => (
                          <div key={i} className="p-2 bg-muted rounded">
                            <p className="font-semibold">{guest.name}</p>
                            {guest.menu && (
                              <p className="text-sm text-muted-foreground">
                                Menú: {guest.menu}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {rsvp.menu && (
                    <div>
                      <p className="text-sm text-muted-foreground">Menú principal</p>
                      <Badge variant="outline">{rsvp.menu}</Badge>
                    </div>
                  )}
                  {rsvp.allergies && (
                    <div>
                      <p className="text-sm text-muted-foreground">Alergias e intolerancias</p>
                      <p>{rsvp.allergies}</p>
                    </div>
                  )}
                  {rsvp.hasChildren && (
                    <div>
                      <p className="text-sm text-muted-foreground">Niños</p>
                      <p className="font-semibold">{rsvp.numChildren}</p>
                    </div>
                  )}
                  {rsvp.specialNeeds && (
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Necesidades especiales
                      </p>
                      <p>{rsvp.specialNeeds}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </>
          )}

          {rsvp.comments && (
            <Card>
              <CardHeader>
                <CardTitle>Comentarios</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{rsvp.comments}</p>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Información del sistema</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div>
                <p className="text-muted-foreground">Creado</p>
                <p>{formatDateTime(rsvp.createdAt)}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Última actualización</p>
                <p>{formatDateTime(rsvp.updatedAt)}</p>
              </div>
              {rsvp.reviewed && (
                <div>
                  <p className="text-muted-foreground">Revisado</p>
                  <p>
                    {rsvp.reviewedBy} - {rsvp.reviewedAt && formatDateTime(rsvp.reviewedAt)}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}







