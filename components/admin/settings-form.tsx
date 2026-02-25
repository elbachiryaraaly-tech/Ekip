"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { Save, Loader2, Heart, Calendar, MapPin, Clock, Phone, Mail } from "lucide-react"

interface SettingsFormProps {
  initialSettings: Record<string, string>
}

export function SettingsForm({ initialSettings }: SettingsFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [isPending, startTransition] = useTransition()
  
  const [settings, setSettings] = useState(initialSettings)

  const handleChange = (key: string, value: string) => {
    setSettings((prev) => ({ ...prev, [key]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    startTransition(async () => {
      try {
        const response = await fetch("/api/admin/settings", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(settings),
        })

        if (response.ok) {
          toast({
            title: "✅ Configuración guardada",
            description: "Los cambios se han aplicado correctamente",
          })
          router.refresh()
        } else {
          throw new Error("Error al guardar")
        }
      } catch (error) {
        toast({
          title: "❌ Error",
          description: "No se pudo guardar la configuración",
          variant: "destructive",
        })
      }
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Información básica */}
      <Card className="border-2 border-primary/10 elegant-shadow-lg">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Heart className="w-5 h-5 text-primary" />
            </div>
            <div>
              <CardTitle>Información Básica</CardTitle>
              <CardDescription>Nombres de los novios y fecha de la boda</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="bride_name">Nombre de la Novia</Label>
              <Input
                id="bride_name"
                value={settings.bride_name || ""}
                onChange={(e) => handleChange("bride_name", e.target.value)}
                placeholder="Celia"
              />
            </div>
            <div>
              <Label htmlFor="groom_name">Nombre del Novio</Label>
              <Input
                id="groom_name"
                value={settings.groom_name || ""}
                onChange={(e) => handleChange("groom_name", e.target.value)}
                placeholder="Fernando"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="wedding_date">Fecha de la Boda</Label>
            <Input
              id="wedding_date"
              type="date"
              value={settings.wedding_date || ""}
              onChange={(e) => handleChange("wedding_date", e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Horarios */}
      <Card className="border-2 border-primary/10 elegant-shadow-lg">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Clock className="w-5 h-5 text-primary" />
            </div>
            <div>
              <CardTitle>Horarios del Día</CardTitle>
              <CardDescription>Configura los horarios de cada evento</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="ceremony_time">Hora de Ceremonia</Label>
              <Input
                id="ceremony_time"
                type="time"
                value={settings.ceremony_time || ""}
                onChange={(e) => handleChange("ceremony_time", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="cocktail_time">Hora del Cóctel</Label>
              <Input
                id="cocktail_time"
                type="time"
                value={settings.cocktail_time || ""}
                onChange={(e) => handleChange("cocktail_time", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="dinner_time">Hora de la Cena</Label>
              <Input
                id="dinner_time"
                type="time"
                value={settings.dinner_time || ""}
                onChange={(e) => handleChange("dinner_time", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="party_time">Hora de la Fiesta</Label>
              <Input
                id="party_time"
                type="time"
                value={settings.party_time || ""}
                onChange={(e) => handleChange("party_time", e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Ubicaciones */}
      <Card className="border-2 border-primary/10 elegant-shadow-lg">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <MapPin className="w-5 h-5 text-primary" />
            </div>
            <div>
              <CardTitle>Ubicaciones</CardTitle>
              <CardDescription>Direcciones de la ceremonia y recepción</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="ceremony_location">Nombre del Lugar de Ceremonia</Label>
            <Input
              id="ceremony_location"
              value={settings.ceremony_location || ""}
              onChange={(e) => handleChange("ceremony_location", e.target.value)}
              placeholder="Basílica de Nuestra Señora de las Angustias, Granada"
            />
          </div>
          <div>
            <Label htmlFor="ceremony_address">Dirección Completa de Ceremonia</Label>
            <Textarea
              id="ceremony_address"
              value={settings.ceremony_address || ""}
              onChange={(e) => handleChange("ceremony_address", e.target.value)}
              placeholder="Basílica de Nuestra Señora de las Angustias, Granada"
              rows={2}
            />
          </div>
          <div>
            <Label htmlFor="reception_location">Nombre del Lugar de Recepción</Label>
            <Input
              id="reception_location"
              value={settings.reception_location || ""}
              onChange={(e) => handleChange("reception_location", e.target.value)}
              placeholder="Carmen de los Mártires"
            />
          </div>
          <div>
            <Label htmlFor="reception_address">Dirección Completa de Recepción</Label>
            <Textarea
              id="reception_address"
              value={settings.reception_address || ""}
              onChange={(e) => handleChange("reception_address", e.target.value)}
              placeholder="Carmen de los Mártires, Granada"
              rows={2}
            />
          </div>
        </CardContent>
      </Card>

      {/* Contacto */}
      <Card className="border-2 border-primary/10 elegant-shadow-lg">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Mail className="w-5 h-5 text-primary" />
            </div>
            <div>
              <CardTitle>Información de Contacto</CardTitle>
              <CardDescription>Datos de contacto para los invitados</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="contact_email">Email de Contacto</Label>
              <Input
                id="contact_email"
                type="email"
                value={settings.contact_email || ""}
                onChange={(e) => handleChange("contact_email", e.target.value)}
                placeholder="hola@boda-celia.com"
              />
            </div>
            <div>
              <Label htmlFor="contact_phone">Teléfono de Contacto</Label>
              <Input
                id="contact_phone"
                value={settings.contact_phone || ""}
                onChange={(e) => handleChange("contact_phone", e.target.value)}
                placeholder="Celia: 673 580 402 · Fernando: 697 776 390"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Botón de guardar */}
      <div className="flex justify-end gap-4">
        <Button
          type="submit"
          disabled={isPending}
          size="lg"
          className="min-w-[200px]"
        >
          {isPending ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Guardando...
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              Guardar Configuración
            </>
          )}
        </Button>
      </div>
    </form>
  )
}
