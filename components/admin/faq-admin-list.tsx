"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { Plus, Edit, Trash2, Save, X, HelpCircle, GripVertical } from "lucide-react"

interface FAQ {
  id: string
  question: string
  answer: string
  order: number
  createdAt: string
  updatedAt: string
}

interface FAQAdminListProps {
  initialFAQs: FAQ[]
}

export function FAQAdminList({ initialFAQs }: FAQAdminListProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [isPending, startTransition] = useTransition()
  const [faqs, setFAQs] = useState<FAQ[]>(initialFAQs)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [formData, setFormData] = useState({ question: "", answer: "", order: 0 })

  const handleCreate = () => {
    setIsCreating(true)
    setFormData({ question: "", answer: "", order: faqs.length })
  }

  const handleCancel = () => {
    setIsCreating(false)
    setEditingId(null)
    setFormData({ question: "", answer: "", order: 0 })
  }

  const handleEdit = (faq: FAQ) => {
    setEditingId(faq.id)
    setFormData({ question: faq.question, answer: faq.answer, order: faq.order })
    setIsCreating(false)
  }

  const handleSave = async () => {
    if (!formData.question.trim() || !formData.answer.trim()) {
      toast({
        title: "Error",
        description: "La pregunta y la respuesta son requeridas",
        variant: "destructive",
      })
      return
    }

    startTransition(async () => {
      try {
        if (isCreating) {
          const response = await fetch("/api/admin/faqs", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
          })

          if (response.ok) {
            const newFAQ = await response.json()
            setFAQs([...faqs, { ...newFAQ, createdAt: newFAQ.createdAt, updatedAt: newFAQ.updatedAt }])
            toast({
              title: "✅ FAQ creada",
              description: "La pregunta frecuente se ha creado correctamente",
            })
            handleCancel()
            router.refresh()
          } else {
            throw new Error("Error al crear")
          }
        } else if (editingId) {
          const response = await fetch(`/api/admin/faqs/${editingId}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
          })

          if (response.ok) {
            const updatedFAQ = await response.json()
            setFAQs(faqs.map((f) => (f.id === editingId ? { ...updatedFAQ, createdAt: f.createdAt, updatedAt: updatedFAQ.updatedAt } : f)))
            toast({
              title: "✅ FAQ actualizada",
              description: "La pregunta frecuente se ha actualizado correctamente",
            })
            handleCancel()
            router.refresh()
          } else {
            throw new Error("Error al actualizar")
          }
        }
      } catch (error) {
        toast({
          title: "❌ Error",
          description: "No se pudo guardar la FAQ",
          variant: "destructive",
        })
      }
    })
  }

  const handleDelete = async (id: string) => {
    if (!confirm("¿Estás seguro de que quieres eliminar esta pregunta frecuente?")) return

    startTransition(async () => {
      try {
        const response = await fetch(`/api/admin/faqs/${id}`, {
          method: "DELETE",
        })

        if (response.ok) {
          setFAQs(faqs.filter((f) => f.id !== id))
          toast({
            title: "✅ FAQ eliminada",
            description: "La pregunta frecuente se ha eliminado correctamente",
          })
          router.refresh()
        } else {
          throw new Error("Error al eliminar")
        }
      } catch (error) {
        toast({
          title: "❌ Error",
          description: "No se pudo eliminar la FAQ",
          variant: "destructive",
        })
      }
    })
  }

  const handleMove = async (id: string, direction: "up" | "down") => {
    const index = faqs.findIndex((f) => f.id === id)
    if (index === -1) return

    const newIndex = direction === "up" ? index - 1 : index + 1
    if (newIndex < 0 || newIndex >= faqs.length) return

    const newFAQs = [...faqs]
    const [moved] = newFAQs.splice(index, 1)
    newFAQs.splice(newIndex, 0, moved)

    // Actualizar orders
    const updatedFAQs = newFAQs.map((f, i) => ({ ...f, order: i }))
    setFAQs(updatedFAQs)

    // Guardar el nuevo orden
    startTransition(async () => {
      try {
        await Promise.all(
          updatedFAQs.map((f) =>
            fetch(`/api/admin/faqs/${f.id}`, {
              method: "PATCH",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ order: f.order }),
            })
          )
        )
        router.refresh()
      } catch (error) {
        console.error("Error actualizando orden:", error)
      }
    })
  }

  return (
    <div className="space-y-6">
      {/* Botón para crear nueva FAQ */}
      <div className="flex justify-end">
        <Button onClick={handleCreate} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Nueva Pregunta Frecuente
        </Button>
      </div>

      {/* Formulario de creación/edición */}
      {(isCreating || editingId) && (
        <Card className="border-2 border-primary/20 bg-card/95">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-primary" />
              {isCreating ? "Nueva FAQ" : "Editar FAQ"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="question">Pregunta</Label>
              <Input
                id="question"
                value={formData.question}
                onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                placeholder="¿Puedo traer niños?"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="answer">Respuesta</Label>
              <Textarea
                id="answer"
                value={formData.answer}
                onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                placeholder="Por supuesto, los niños son bienvenidos..."
                rows={4}
                className="mt-1"
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleSave} disabled={isPending} className="flex-1">
                <Save className="w-4 h-4 mr-2" />
                Guardar
              </Button>
              <Button onClick={handleCancel} variant="outline" disabled={isPending}>
                <X className="w-4 h-4 mr-2" />
                Cancelar
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Lista de FAQs */}
      <div className="space-y-4">
        {faqs.length === 0 ? (
          <Card className="border-2 border-primary/10">
            <CardContent className="py-12 text-center">
              <div className="flex flex-col items-center gap-3">
                <HelpCircle className="w-16 h-16 text-muted-foreground/50" />
                <p className="text-lg font-medium text-muted-foreground">
                  No hay preguntas frecuentes
                </p>
                <p className="text-sm text-muted-foreground">
                  Crea tu primera pregunta frecuente usando el botón de arriba
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          faqs.map((faq, index) => (
            <Card
              key={faq.id}
              className={`premium-hover border-2 elegant-shadow-lg transition-all duration-300 ${
                editingId === faq.id
                  ? "border-primary/40 bg-primary/5"
                  : "border-primary/10 bg-card/95"
              }`}
            >
              <CardContent className="p-6">
                {editingId === faq.id ? (
                  <div className="space-y-4">
                    <div>
                      <Label>Pregunta</Label>
                      <Input
                        value={formData.question}
                        onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label>Respuesta</Label>
                      <Textarea
                        value={formData.answer}
                        onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                        rows={4}
                        className="mt-1"
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={handleSave} disabled={isPending} size="sm">
                        <Save className="w-4 h-4 mr-2" />
                        Guardar
                      </Button>
                      <Button onClick={handleCancel} variant="outline" size="sm" disabled={isPending}>
                        <X className="w-4 h-4 mr-2" />
                        Cancelar
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="p-2 rounded-lg bg-primary/10">
                            <HelpCircle className="w-5 h-5 text-primary" />
                          </div>
                          <h3 className="text-xl font-semibold text-primary">{faq.question}</h3>
                        </div>
                        <p className="text-muted-foreground leading-relaxed pl-12">{faq.answer}</p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <div className="flex flex-col gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleMove(faq.id, "up")}
                            disabled={index === 0}
                            className="h-8 w-8"
                          >
                            <GripVertical className="w-4 h-4 rotate-90" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleMove(faq.id, "down")}
                            disabled={index === faqs.length - 1}
                            className="h-8 w-8"
                          >
                            <GripVertical className="w-4 h-4 -rotate-90" />
                          </Button>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(faq)}
                          disabled={isPending}
                        >
                          <Edit className="w-4 h-4 mr-2" />
                          Editar
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(faq.id)}
                          disabled={isPending}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Eliminar
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}


