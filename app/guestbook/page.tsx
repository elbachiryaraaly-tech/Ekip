"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { Loader2, Heart } from "lucide-react"
import Link from "next/link"
import { formatDate } from "@/lib/utils"

const guestbookSchema = z.object({
  name: z.string().min(1, "El nombre es obligatorio").max(100),
  message: z.string().min(1, "El mensaje es obligatorio").max(1000),
  honeypot: z.string().optional(),
})

type GuestbookFormData = z.infer<typeof guestbookSchema>

interface GuestbookEntry {
  id: string
  name: string
  message: string
  createdAt: string
}

export default function GuestbookPage() {
  const [entries, setEntries] = useState<GuestbookEntry[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<GuestbookFormData>({
    resolver: zodResolver(guestbookSchema),
    defaultValues: {
      honeypot: "",
    },
  })

  useEffect(() => {
    fetchEntries()
  }, [])

  const fetchEntries = async () => {
    try {
      const response = await fetch("/api/guestbook")
      if (response.ok) {
        const data = await response.json()
        setEntries(data.entries || [])
      }
    } catch (error) {
      console.error("Error cargando mensajes:", error)
    } finally {
      setLoading(false)
    }
  }

  const onSubmit = async (data: GuestbookFormData) => {
    try {
      const response = await fetch("/api/guestbook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "Error al enviar el mensaje")
      }

      toast({
        title: "¡Mensaje enviado!",
        description: "Tu mensaje será moderado antes de publicarse.",
      })

      reset()
      fetchEntries() // Recargar mensajes
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Error al enviar el mensaje",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="min-h-screen bg-secondary py-12 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-serif font-bold text-primary mb-4">
            Libro de mensajes
          </h1>
          <p className="text-muted-foreground">
            Déjanos un mensaje especial para este día tan importante
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Escribe tu mensaje</CardTitle>
            <CardDescription>
              Tu mensaje será moderado antes de publicarse
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Honeypot */}
              <input
                type="text"
                {...register("honeypot")}
                style={{ display: "none" }}
                tabIndex={-1}
                autoComplete="off"
              />

              <div>
                <Label htmlFor="name">Tu nombre *</Label>
                <Input
                  id="name"
                  {...register("name")}
                  className="mt-1"
                  maxLength={100}
                />
                {errors.name && (
                  <p className="text-sm text-destructive mt-1">
                    {errors.name.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="message">Tu mensaje *</Label>
                <Textarea
                  id="message"
                  {...register("message")}
                  className="mt-1"
                  rows={5}
                  maxLength={1000}
                />
                {errors.message && (
                  <p className="text-sm text-destructive mt-1">
                    {errors.message.message}
                  </p>
                )}
              </div>

              <Button type="submit" disabled={isSubmitting} className="w-full">
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Enviando...
                  </>
                ) : (
                  "Enviar mensaje"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        <div>
          <h2 className="text-2xl font-serif font-bold text-primary mb-6">
            Mensajes
          </h2>
          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : entries.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center text-muted-foreground">
                Aún no hay mensajes. ¡Sé el primero en dejar uno!
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {entries.map((entry) => (
                <Card key={entry.id}>
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-3">
                      <Heart className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <p className="font-semibold">{entry.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {formatDate(entry.createdAt)}
                          </p>
                        </div>
                        <p className="text-muted-foreground whitespace-pre-wrap">
                          {entry.message}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        <div className="text-center">
          <Button variant="outline" asChild>
            <Link href="/">Volver al inicio</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}







