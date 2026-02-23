"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { Loader2, ArrowLeft } from "lucide-react"
import Link from "next/link"

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

type RSVPUpdateData = z.infer<typeof rsvpUpdateSchema>

export default function EditRSVPPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const token = params.token as string
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [rsvp, setRsvp] = useState<any>(null)

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<RSVPUpdateData>({
    resolver: zodResolver(rsvpUpdateSchema),
  })

  useEffect(() => {
    const fetchRSVP = async () => {
      try {
        const response = await fetch(`/api/rsvp/${token}`)
        if (!response.ok) {
          throw new Error("RSVP no encontrado")
        }
        const data = await response.json()
        setRsvp(data)
        // Pre-llenar formulario
        setValue("firstName", data.firstName)
        setValue("lastName", data.lastName)
        setValue("phone", data.phone || "")
        setValue("attending", data.attending)
        setValue("numGuests", data.numGuests || 0)
        setValue("guests", data.guests || [])
        setValue("menu", data.menu || undefined)
        setValue("allergies", data.allergies || "")
        setValue("hasChildren", data.hasChildren || false)
        setValue("numChildren", data.numChildren || 0)
        setValue("specialNeeds", data.specialNeeds || "")
        setValue("comments", data.comments || "")
        setLoading(false)
      } catch (error) {
        toast({
          title: "Error",
          description: "No se pudo cargar la confirmación. El enlace puede haber expirado.",
          variant: "destructive",
        })
        router.push("/rsvp")
      }
    }

    if (token) {
      fetchRSVP()
    }
  }, [token, router, setValue, toast])

  const onSubmit = async (data: RSVPUpdateData) => {
    setIsSubmitting(true)
    try {
      const response = await fetch(`/api/rsvp/${token}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "Error al actualizar la confirmación")
      }

      toast({
        title: "¡Actualizado!",
        description: "Tu confirmación ha sido actualizada correctamente.",
      })

      router.push("/rsvp/thanks?token=" + token)
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Error al actualizar",
        variant: "destructive",
      })
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-secondary flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  const attending = watch("attending") ?? rsvp?.attending
  const numGuests = watch("numGuests") ?? rsvp?.numGuests ?? 0
  const hasChildren = watch("hasChildren") ?? rsvp?.hasChildren ?? false
  const guests = watch("guests") || rsvp?.guests || []

  return (
    <div className="min-h-screen bg-secondary py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl font-serif">Editar confirmación</CardTitle>
            <CardDescription>
              Modifica los datos de tu confirmación de asistencia
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <Label htmlFor="firstName">Nombre</Label>
                <Input id="firstName" {...register("firstName")} className="mt-1" />
              </div>

              <div>
                <Label htmlFor="lastName">Apellidos</Label>
                <Input id="lastName" {...register("lastName")} className="mt-1" />
              </div>

              <div>
                <Label htmlFor="phone">Teléfono</Label>
                <Input id="phone" type="tel" {...register("phone")} className="mt-1" />
              </div>

              <div>
                <Label>¿Asistirás a la boda?</Label>
                <RadioGroup
                  value={attending ? "yes" : "no"}
                  onValueChange={(value) => setValue("attending", value === "yes")}
                  className="mt-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yes" id="yes" />
                    <Label htmlFor="yes" className="cursor-pointer">
                      Sí, asistiré
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="no" />
                    <Label htmlFor="no" className="cursor-pointer">
                      No podré asistir
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {attending && (
                <>
                  <div>
                    <Label htmlFor="numGuests">Número de acompañantes</Label>
                    <Input
                      id="numGuests"
                      type="number"
                      min="0"
                      {...register("numGuests", { valueAsNumber: true })}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="menu">Menú principal</Label>
                    <select
                      id="menu"
                      {...register("menu")}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm mt-1"
                    >
                      <option value="">Seleccionar...</option>
                      <option value="Carne">Carne</option>
                      <option value="Pescado">Pescado</option>
                      <option value="Vegetariano">Vegetariano</option>
                      <option value="Vegano">Vegano</option>
                    </select>
                  </div>

                  <div>
                    <Label htmlFor="allergies">Alergias e intolerancias</Label>
                    <Textarea
                      id="allergies"
                      {...register("allergies")}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <div className="flex items-center space-x-2 mb-2">
                      <Checkbox
                        id="hasChildren"
                        checked={hasChildren}
                        onCheckedChange={(checked) => {
                          setValue("hasChildren", checked === true)
                          if (!checked) setValue("numChildren", 0)
                        }}
                      />
                      <Label htmlFor="hasChildren" className="cursor-pointer">
                        ¿Traerás niños?
                      </Label>
                    </div>
                    {hasChildren && (
                      <div className="ml-6">
                        <Label htmlFor="numChildren">Número de niños</Label>
                        <Input
                          id="numChildren"
                          type="number"
                          min="0"
                          {...register("numChildren", { valueAsNumber: true })}
                          className="mt-1"
                        />
                      </div>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="specialNeeds">Necesidades especiales</Label>
                    <Textarea
                      id="specialNeeds"
                      {...register("specialNeeds")}
                      className="mt-1"
                    />
                  </div>
                </>
              )}

              <div>
                <Label htmlFor="comments">Comentarios</Label>
                <Textarea id="comments" {...register("comments")} className="mt-1" />
              </div>

              <div className="flex gap-4 pt-4">
                <Button type="button" variant="outline" asChild>
                  <Link href="/">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Volver
                  </Link>
                </Button>
                <Button type="submit" disabled={isSubmitting} className="ml-auto">
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Guardando...
                    </>
                  ) : (
                    "Guardar cambios"
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}







