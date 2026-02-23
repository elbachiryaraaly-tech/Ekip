"use client"

import { useState } from "react"
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
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"
import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react"
import Link from "next/link"

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
  honeypot: z.string().optional(),
})

type RSVPFormData = z.infer<typeof rsvpSchema>

export default function RSVPPage() {
  const [step, setStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<RSVPFormData>({
    resolver: zodResolver(rsvpSchema),
    defaultValues: {
      attending: true,
      numGuests: 0,
      hasChildren: false,
      numChildren: 0,
      gdprConsent: false,
      honeypot: "",
    },
  })

  const attending = watch("attending")
  const numGuests = watch("numGuests")
  const hasChildren = watch("hasChildren")
  const numChildren = watch("numChildren")
  const guests = watch("guests") || []

  const onSubmit = async (data: RSVPFormData) => {
    setIsSubmitting(true)
    try {
      const response = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "Error al enviar la confirmación")
      }

      router.push(`/rsvp/thanks?token=${result.editToken}`)
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Error al enviar la confirmación",
        variant: "destructive",
      })
      setIsSubmitting(false)
    }
  }

  const updateGuests = () => {
    const newGuests = Array.from({ length: numGuests }, (_, i) => ({
      name: guests[i]?.name || "",
      menu: guests[i]?.menu || "",
    }))
    setValue("guests", newGuests)
  }

  return (
    <div className="min-h-screen bg-secondary py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl font-serif text-center">
              Confirmar asistencia
            </CardTitle>
            <CardDescription className="text-center">
              Paso {step} de 4
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)}>
              {/* Honeypot */}
              <input
                type="text"
                {...register("honeypot")}
                style={{ display: "none" }}
                tabIndex={-1}
                autoComplete="off"
              />

              {/* Paso 1: Información personal */}
              {step === 1 && (
                <div className="space-y-6 animate-fade-in">
                  <div>
                    <Label htmlFor="firstName">Nombre *</Label>
                    <Input
                      id="firstName"
                      {...register("firstName")}
                      className="mt-1"
                    />
                    {errors.firstName && (
                      <p className="text-sm text-destructive mt-1">
                        {errors.firstName.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="lastName">Apellidos *</Label>
                    <Input
                      id="lastName"
                      {...register("lastName")}
                      className="mt-1"
                    />
                    {errors.lastName && (
                      <p className="text-sm text-destructive mt-1">
                        {errors.lastName.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      {...register("email")}
                      className="mt-1"
                    />
                    {errors.email && (
                      <p className="text-sm text-destructive mt-1">
                        {errors.email.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="phone">Teléfono (opcional)</Label>
                    <Input
                      id="phone"
                      type="tel"
                      {...register("phone")}
                      className="mt-1"
                    />
                  </div>

                  <div className="flex gap-4 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => router.push("/")}
                    >
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Volver
                    </Button>
                    <Button
                      type="button"
                      onClick={() => setStep(2)}
                      className="ml-auto"
                    >
                      Siguiente
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </div>
              )}

              {/* Paso 2: Asistencia */}
              {step === 2 && (
                <div className="space-y-6 animate-fade-in">
                  <div>
                    <Label>¿Asistirás a la boda? *</Label>
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
                        <Label htmlFor="numGuests">
                          Número de acompañantes (sin contar niños)
                        </Label>
                        <Input
                          id="numGuests"
                          type="number"
                          min="0"
                          {...register("numGuests", { valueAsNumber: true })}
                          onChange={(e) => {
                            const val = parseInt(e.target.value) || 0
                            setValue("numGuests", val)
                            updateGuests()
                          }}
                          className="mt-1"
                        />
                      </div>

                      {numGuests > 0 && (
                        <div className="space-y-4">
                          <Label>Datos de acompañantes</Label>
                          {Array.from({ length: numGuests }).map((_, i) => (
                            <div key={i} className="space-y-2 p-4 bg-muted rounded-lg">
                              <div>
                                <Label htmlFor={`guest-${i}-name`}>
                                  Nombre del acompañante {i + 1} *
                                </Label>
                                <Input
                                  id={`guest-${i}-name`}
                                  value={guests[i]?.name || ""}
                                  onChange={(e) => {
                                    const newGuests = [...guests]
                                    newGuests[i] = {
                                      ...newGuests[i],
                                      name: e.target.value,
                                    }
                                    setValue("guests", newGuests)
                                  }}
                                  className="mt-1"
                                />
                              </div>
                              <div>
                                <Label htmlFor={`guest-${i}-menu`}>Menú preferido</Label>
                                <select
                                  id={`guest-${i}-menu`}
                                  value={guests[i]?.menu || ""}
                                  onChange={(e) => {
                                    const newGuests = [...guests]
                                    newGuests[i] = {
                                      ...newGuests[i],
                                      menu: e.target.value,
                                    }
                                    setValue("guests", newGuests)
                                  }}
                                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                >
                                  <option value="">Seleccionar...</option>
                                  <option value="Carne">Carne</option>
                                  <option value="Pescado">Pescado</option>
                                  <option value="Vegetariano">Vegetariano</option>
                                  <option value="Vegano">Vegano</option>
                                </select>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      <div>
                        <Label htmlFor="menu">Menú principal *</Label>
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
                        {errors.menu && (
                          <p className="text-sm text-destructive mt-1">
                            {errors.menu.message}
                          </p>
                        )}
                      </div>

                      <div>
                        <Label htmlFor="allergies">Alergias e intolerancias</Label>
                        <Textarea
                          id="allergies"
                          {...register("allergies")}
                          className="mt-1"
                          placeholder="Indica cualquier alergia o intolerancia alimentaria..."
                        />
                      </div>
                    </>
                  )}

                  <div className="flex gap-4 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setStep(1)}
                    >
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Anterior
                    </Button>
                    <Button
                      type="button"
                      onClick={() => setStep(3)}
                      className="ml-auto"
                    >
                      Siguiente
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </div>
              )}

              {/* Paso 3: Niños y necesidades especiales */}
              {step === 3 && (
                <div className="space-y-6 animate-fade-in">
                  {attending && (
                    <>
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
                          <div className="ml-6 mt-2">
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
                        <Label htmlFor="specialNeeds">
                          Necesidades especiales / Accesibilidad
                        </Label>
                        <Textarea
                          id="specialNeeds"
                          {...register("specialNeeds")}
                          className="mt-1"
                          placeholder="Indica cualquier necesidad especial o requerimiento de accesibilidad..."
                        />
                      </div>
                    </>
                  )}

                  <div>
                    <Label htmlFor="comments">Comentarios adicionales</Label>
                    <Textarea
                      id="comments"
                      {...register("comments")}
                      className="mt-1"
                      placeholder="Cualquier otra información que quieras compartir..."
                    />
                  </div>

                  <div className="flex gap-4 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setStep(2)}
                    >
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Anterior
                    </Button>
                    <Button
                      type="button"
                      onClick={() => setStep(4)}
                      className="ml-auto"
                    >
                      Siguiente
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </div>
              )}

              {/* Paso 4: Confirmación y RGPD */}
              {step === 4 && (
                <div className="space-y-6 animate-fade-in">
                  <div className="p-4 bg-muted rounded-lg">
                    <h3 className="font-semibold mb-2">Resumen de tu confirmación</h3>
                    <div className="text-sm space-y-1 text-muted-foreground">
                      <p>
                        <strong>Nombre:</strong> {watch("firstName")} {watch("lastName")}
                      </p>
                      <p>
                        <strong>Email:</strong> {watch("email")}
                      </p>
                      <p>
                        <strong>Asistiré:</strong> {attending ? "Sí" : "No"}
                      </p>
                      {attending && (
                        <>
                          <p>
                            <strong>Acompañantes:</strong> {numGuests}
                          </p>
                          <p>
                            <strong>Menú:</strong> {watch("menu") || "No especificado"}
                          </p>
                          {hasChildren && (
                            <p>
                              <strong>Niños:</strong> {numChildren}
                            </p>
                          )}
                        </>
                      )}
                    </div>
                  </div>

                  <div>
                    <div className="flex items-start space-x-2">
                      <Checkbox
                        id="gdprConsent"
                        checked={watch("gdprConsent")}
                        onCheckedChange={(checked) =>
                          setValue("gdprConsent", checked === true)
                        }
                      />
                      <Label htmlFor="gdprConsent" className="cursor-pointer text-sm">
                        Acepto la{" "}
                        <Link href="/privacy" className="text-primary underline">
                          política de privacidad
                        </Link>{" "}
                        y consiento el tratamiento de mis datos personales. *
                      </Label>
                    </div>
                    {errors.gdprConsent && (
                      <p className="text-sm text-destructive mt-1">
                        {errors.gdprConsent.message}
                      </p>
                    )}
                  </div>

                  <div className="flex gap-4 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setStep(3)}
                    >
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Anterior
                    </Button>
                    <Button type="submit" disabled={isSubmitting} className="ml-auto">
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Enviando...
                        </>
                      ) : (
                        "Confirmar asistencia"
                      )}
                    </Button>
                  </div>
                </div>
              )}
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}







