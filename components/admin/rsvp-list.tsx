"use client"

import { useState, useTransition } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Search, ChevronLeft, ChevronRight, Eye, Users, UtensilsCrossed } from "lucide-react"
import { formatDateTime } from "@/lib/utils"

interface RSVP {
  id: string
  firstName: string
  lastName: string
  email: string
  attending: boolean
  menu: string | null
  guests: any
  createdAt: Date
}

interface RSVPListProps {
  initialData: {
    rsvps: RSVP[]
    pagination: {
      page: number
      limit: number
      total: number
      totalPages: number
    }
  }
}

export function RSVPList({ initialData }: RSVPListProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()
  
  const [search, setSearch] = useState(searchParams.get("search") || "")
  const [attending, setAttending] = useState(searchParams.get("attending") || "")
  const [menu, setMenu] = useState(searchParams.get("menu") || "")

  const updateSearchParams = (updates: Record<string, string>) => {
    const params = new URLSearchParams(searchParams.toString())
    
    Object.entries(updates).forEach(([key, value]) => {
      if (value) {
        params.set(key, value)
      } else {
        params.delete(key)
      }
    })
    params.set("page", "1") // Reset to first page on filter change
    
    startTransition(() => {
      router.push(`/admin/rsvps?${params.toString()}`)
    })
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    updateSearchParams({ search })
  }

  const changePage = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set("page", newPage.toString())
    startTransition(() => {
      router.push(`/admin/rsvps?${params.toString()}`)
    })
  }

  return (
    <div className="space-y-6">
      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros y búsqueda</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Buscar por nombre o email..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full"
                />
              </div>
              <Button type="submit" disabled={isPending}>
                <Search className="w-4 h-4 mr-2" />
                Buscar
              </Button>
            </div>
            
            <div className="flex gap-4">
              <select
                value={attending}
                onChange={(e) => {
                  setAttending(e.target.value)
                  updateSearchParams({ attending: e.target.value })
                }}
                className="px-3 py-2 border rounded-md"
              >
                <option value="">Todos los RSVPs</option>
                <option value="true">Solo confirmados</option>
                <option value="false">Solo no confirmados</option>
              </select>
              
              <select
                value={menu}
                onChange={(e) => {
                  setMenu(e.target.value)
                  updateSearchParams({ menu: e.target.value })
                }}
                className="px-3 py-2 border rounded-md"
              >
                <option value="">Todos los menús</option>
                <option value="normal">Normal</option>
                <option value="vegetariano">Vegetariano</option>
                <option value="vegano">Vegano</option>
              </select>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Lista de RSVPs */}
      <div className="space-y-3">
        {initialData.rsvps.length === 0 ? (
          <Card className="border-2 border-primary/10">
            <CardContent className="py-12 text-center">
              <div className="flex flex-col items-center gap-3">
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                  <Users className="w-8 h-8 text-muted-foreground" />
                </div>
                <p className="text-lg font-medium text-muted-foreground">No se encontraron RSVPs</p>
                <p className="text-sm text-muted-foreground">Intenta ajustar los filtros de búsqueda</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          initialData.rsvps.map((rsvp) => (
            <Card 
              key={rsvp.id} 
              className="premium-hover border-2 border-primary/10 elegant-shadow-lg group transition-all duration-300 hover:border-primary/30"
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-start gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2 flex-wrap">
                          <h3 className="text-xl font-semibold text-primary group-hover:text-primary/80 transition-colors">
                            {rsvp.firstName} {rsvp.lastName}
                          </h3>
                          <Badge 
                            variant={rsvp.attending ? "default" : "secondary"}
                            className={rsvp.attending ? "bg-green-600 hover:bg-green-700" : "bg-gray-500 hover:bg-gray-600"}
                          >
                            {rsvp.attending ? "✓ Confirmado" : "✗ No confirmado"}
                          </Badge>
                          {rsvp.menu && (
                            <Badge variant="outline" className="border-primary/30">
                              <UtensilsCrossed className="w-3 h-3 mr-1" />
                              {rsvp.menu}
                            </Badge>
                          )}
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm text-muted-foreground flex items-center gap-2">
                            <span className="font-medium">Email:</span> {rsvp.email}
                          </p>
                          {rsvp.phone && (
                            <p className="text-sm text-muted-foreground">
                              <span className="font-medium">Teléfono:</span> {rsvp.phone}
                            </p>
                          )}
                          {rsvp.guests && Array.isArray(rsvp.guests) && rsvp.guests.length > 0 && (
                            <div className="mt-2">
                              <p className="text-sm font-medium text-muted-foreground mb-1">
                                Acompañantes ({rsvp.guests.length}):
                              </p>
                              <div className="flex flex-wrap gap-2">
                                {rsvp.guests.map((guest: any, idx: number) => (
                                  <Badge key={idx} variant="outline" className="text-xs">
                                    {guest.name || `Invitado ${idx + 1}`}
                                    {guest.menu && ` • ${guest.menu}`}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                          {rsvp.allergies && (
                            <p className="text-sm text-amber-600 mt-2">
                              <span className="font-medium">⚠ Alergias:</span> {rsvp.allergies}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 pt-2 border-t border-border/50">
                      <p className="text-xs text-muted-foreground">
                        Creado: {formatDateTime(rsvp.createdAt)}
                      </p>
                      {rsvp.comments && (
                        <p className="text-xs text-muted-foreground italic truncate max-w-md">
                          "{rsvp.comments}"
                        </p>
                      )}
                    </div>
                  </div>
                  <Button asChild variant="outline" size="sm" className="shrink-0">
                    <Link href={`/admin/rsvps/${rsvp.id}`} className="flex items-center gap-2">
                      <Eye className="w-4 h-4" />
                      Detalles
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Paginación */}
      {initialData.pagination.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Mostrando {((initialData.pagination.page - 1) * initialData.pagination.limit) + 1} -{" "}
            {Math.min(initialData.pagination.page * initialData.pagination.limit, initialData.pagination.total)} de{" "}
            {initialData.pagination.total} RSVPs
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => changePage(initialData.pagination.page - 1)}
              disabled={initialData.pagination.page === 1 || isPending}
            >
              <ChevronLeft className="w-4 h-4" />
              Anterior
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => changePage(initialData.pagination.page + 1)}
              disabled={initialData.pagination.page >= initialData.pagination.totalPages || isPending}
            >
              Siguiente
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
