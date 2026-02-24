"use client"

import { Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { CheckCircle2, Mail } from "lucide-react"

function ThanksContent() {
  const searchParams = useSearchParams()
  const token = searchParams.get("token")

  return (
    <div className="min-h-screen bg-secondary flex items-center justify-center px-4 py-12">
      <Card className="max-w-2xl w-full">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <CheckCircle2 className="w-16 h-16 text-primary" />
          </div>
          <CardTitle className="text-3xl font-serif">
            ¡Gracias por confirmar!
          </CardTitle>
          <CardDescription className="text-lg">
            Hemos recibido tu confirmación de asistencia
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center space-y-4">
            <p className="text-muted-foreground">
              Te hemos enviado un email de confirmación con todos los detalles.
            </p>
            <p className="text-sm text-muted-foreground">
              Si necesitas modificar algún dato, puedes hacerlo a través del enlace que recibirás por email.
            </p>
          </div>

          {token && (
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground mb-2">
                También puedes editar tu confirmación ahora:
              </p>
              <Button asChild variant="outline" className="w-full">
                <Link href={`/rsvp/edit/${token}`}>
                  <Mail className="w-4 h-4 mr-2" />
                  Editar mi confirmación
                </Link>
              </Button>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button asChild>
              <Link href="/">Volver al inicio</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default function ThanksPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-secondary flex items-center justify-center px-4 py-12">
        <Card className="max-w-2xl w-full">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-serif">Cargando...</CardTitle>
          </CardHeader>
        </Card>
      </div>
    }>
      <ThanksContent />
    </Suspense>
  )
}







