"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Search, Check, X, MessageSquare, User, Clock, CheckCircle, XCircle } from "lucide-react"
import { formatDateTime } from "@/lib/utils"

interface GuestbookEntry {
  id: string
  name: string
  message: string
  approved: boolean
  createdAt: string
  approvedAt: string | null
}

interface GuestbookAdminListProps {
  initialEntries: GuestbookEntry[]
}

export function GuestbookAdminList({ initialEntries }: GuestbookAdminListProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [search, setSearch] = useState("")
  const [filter, setFilter] = useState<"all" | "approved" | "pending">("all")
  
  const [entries, setEntries] = useState(initialEntries)

  const handleApprove = async (id: string) => {
    startTransition(async () => {
      try {
        const response = await fetch(`/api/admin/guestbook/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ approved: true }),
        })

        if (response.ok) {
          setEntries(entries.map((e) => 
            e.id === id ? { ...e, approved: true, approvedAt: new Date() } : e
          ))
          router.refresh()
        }
      } catch (error) {
        console.error("Error aprobando mensaje:", error)
      }
    })
  }

  const handleReject = async (id: string) => {
    if (!confirm("¿Estás seguro de que quieres eliminar este mensaje?")) return

    startTransition(async () => {
      try {
        const response = await fetch(`/api/admin/guestbook/${id}`, {
          method: "DELETE",
        })

        if (response.ok) {
          setEntries(entries.filter((e) => e.id !== id))
          router.refresh()
        }
      } catch (error) {
        console.error("Error eliminando mensaje:", error)
      }
    })
  }

  const filteredEntries = entries.filter((entry) => {
    const matchesSearch = 
      entry.name.toLowerCase().includes(search.toLowerCase()) ||
      entry.message.toLowerCase().includes(search.toLowerCase())
    
    const matchesFilter = 
      filter === "all" ||
      (filter === "approved" && entry.approved) ||
      (filter === "pending" && !entry.approved)

    return matchesSearch && matchesFilter
  })

  const pendingCount = entries.filter((e) => !e.approved).length
  const approvedCount = entries.filter((e) => e.approved).length

  return (
    <div className="space-y-6">
      {/* Estadísticas rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-2 border-primary/10">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Mensajes</p>
                <p className="text-2xl font-bold text-primary">{entries.length}</p>
              </div>
              <MessageSquare className="w-8 h-8 text-primary/60" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-green-500/20 bg-green-50/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Aprobados</p>
                <p className="text-2xl font-bold text-green-600">{approvedCount}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600/60" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-orange-500/20 bg-orange-50/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pendientes</p>
                <p className="text-2xl font-bold text-orange-600">{pendingCount}</p>
              </div>
              <Clock className="w-8 h-8 text-orange-600/60" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros y búsqueda */}
      <Card className="border-2 border-primary/10">
        <CardHeader>
          <CardTitle>Filtros y búsqueda</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <Input
                placeholder="Buscar por nombre o mensaje..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full"
              />
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button
              variant={filter === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("all")}
            >
              Todos ({entries.length})
            </Button>
            <Button
              variant={filter === "approved" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("approved")}
            >
              Aprobados ({approvedCount})
            </Button>
            <Button
              variant={filter === "pending" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("pending")}
              className={pendingCount > 0 ? "border-orange-500 text-orange-600" : ""}
            >
              Pendientes ({pendingCount})
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Lista de mensajes */}
      <div className="space-y-4">
        {filteredEntries.length === 0 ? (
          <Card className="border-2 border-primary/10">
            <CardContent className="py-12 text-center">
              <div className="flex flex-col items-center gap-3">
                <MessageSquare className="w-16 h-16 text-muted-foreground/50" />
                <p className="text-lg font-medium text-muted-foreground">
                  No se encontraron mensajes
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          filteredEntries.map((entry) => (
            <Card
              key={entry.id}
              className={`premium-hover border-2 elegant-shadow-lg transition-all duration-300 ${
                entry.approved
                  ? "border-green-500/20 bg-green-50/30"
                  : "border-orange-500/20 bg-orange-50/30"
              }`}
            >
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 rounded-lg bg-primary/10">
                          <User className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-primary">{entry.name}</h3>
                          <p className="text-xs text-muted-foreground">
                            {formatDateTime(new Date(entry.createdAt))}
                          </p>
                        </div>
                        <Badge
                          variant={entry.approved ? "default" : "secondary"}
                          className={entry.approved ? "bg-green-600" : "bg-orange-500"}
                        >
                          {entry.approved ? (
                            <>
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Aprobado
                            </>
                          ) : (
                            <>
                              <Clock className="w-3 h-3 mr-1" />
                              Pendiente
                            </>
                          )}
                        </Badge>
                      </div>
                      
                      <div className="mt-4 p-4 bg-background/50 rounded-lg border border-border/50">
                        <p className="text-base leading-relaxed text-foreground whitespace-pre-wrap">
                          {entry.message}
                        </p>
                      </div>

                      {entry.approved && entry.approvedAt && (
                        <p className="text-xs text-muted-foreground mt-2">
                          Aprobado el {formatDateTime(new Date(entry.approvedAt))}
                        </p>
                      )}
                    </div>
                  </div>

                  {!entry.approved && (
                    <div className="flex gap-2 pt-4 border-t border-border/50">
                      <Button
                        onClick={() => handleApprove(entry.id)}
                        disabled={isPending}
                        className="flex-1 bg-green-600 hover:bg-green-700"
                      >
                        <Check className="w-4 h-4 mr-2" />
                        Aprobar
                      </Button>
                      <Button
                        onClick={() => handleReject(entry.id)}
                        disabled={isPending}
                        variant="destructive"
                        className="flex-1"
                      >
                        <X className="w-4 h-4 mr-2" />
                        Eliminar
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
