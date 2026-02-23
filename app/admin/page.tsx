import { getCurrentUser } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { AdminNav } from "@/components/admin/admin-nav"
import { LogoutButton } from "@/components/admin/logout-button"
import { DashboardStats } from "@/components/admin/dashboard-stats"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Users, MessageSquare, Settings, FileText, TrendingUp, Calendar, UserCheck, UserX } from "lucide-react"

async function getDetailedStats() {
  try {
    // Consultas básicas primero
    const [totalRSVPs, attendingRSVPs, notAttendingRSVPs, guestbookMessages, pendingMessages, settings] = await Promise.all([
      prisma.rSVP.count({ where: { deletedAt: null } }).catch(() => 0),
      prisma.rSVP.count({ where: { attending: true, deletedAt: null } }).catch(() => 0),
      prisma.rSVP.count({ where: { attending: false, deletedAt: null } }).catch(() => 0),
      prisma.guestbookEntry.count({ where: { approved: true, deletedAt: null } }).catch(() => 0),
      prisma.guestbookEntry.count({ where: { approved: false, deletedAt: null } }).catch(() => 0),
      prisma.settings.count().catch(() => 0),
    ])

    // Consultas más complejas con manejo de errores individual
    let rsvpsByMenu: Array<{ menu: string | null; _count: number }> = []
    try {
      const menuResult = await prisma.rSVP.groupBy({
        by: ['menu'],
        where: { deletedAt: null, menu: { not: null } },
        _count: true,
      })
      rsvpsByMenu = menuResult as Array<{ menu: string | null; _count: number }>
    } catch (error) {
      console.error("Error en groupBy menu:", error)
    }

    let rsvpsByDate: Array<{ createdAt: Date; attending: boolean }> = []
    try {
      rsvpsByDate = await prisma.rSVP.findMany({
        where: { deletedAt: null },
        select: { createdAt: true, attending: true },
        orderBy: { createdAt: 'asc' },
        take: 1000, // Limitar para evitar problemas de memoria
      })
    } catch (error) {
      console.error("Error obteniendo RSVPs por fecha:", error)
    }

    let totalGuests = { _sum: { numGuests: 0 } }
    try {
      totalGuests = await prisma.rSVP.aggregate({
        where: { deletedAt: null },
        _sum: { numGuests: true },
      })
    } catch (error) {
      console.error("Error en aggregate numGuests:", error)
    }

    // Calcular estadísticas de tendencias
    const last7Days = new Date()
    last7Days.setDate(last7Days.getDate() - 7)
    let recentRSVPs = 0
    try {
      recentRSVPs = await prisma.rSVP.count({
        where: {
          deletedAt: null,
          createdAt: { gte: last7Days },
        },
      })
    } catch (error) {
      console.error("Error contando RSVPs recientes:", error)
    }

    const menuStats = Array.isArray(rsvpsByMenu) 
      ? rsvpsByMenu.reduce((acc, item) => {
          acc[item.menu || 'sin_menu'] = item._count
          return acc
        }, {} as Record<string, number>)
      : {}

    // Agrupar RSVPs por fecha para gráfico
    const rsvpsByDateMap = new Map<string, { attending: number; notAttending: number }>()
    if (Array.isArray(rsvpsByDate)) {
      rsvpsByDate.forEach((rsvp) => {
        const date = rsvp.createdAt.toISOString().split('T')[0]
        const current = rsvpsByDateMap.get(date) || { attending: 0, notAttending: 0 }
        if (rsvp.attending) {
          current.attending++
        } else {
          current.notAttending++
        }
        rsvpsByDateMap.set(date, current)
      })
    }

    return {
      totalRSVPs: totalRSVPs || 0,
      attendingRSVPs: attendingRSVPs || 0,
      notAttendingRSVPs: notAttendingRSVPs || 0,
      guestbookMessages: guestbookMessages || 0,
      pendingMessages: pendingMessages || 0,
      settings: settings || 0,
      menuStats,
      recentRSVPs: recentRSVPs || 0,
      totalGuests: totalGuests?._sum?.numGuests || 0,
      rsvpsByDate: Array.from(rsvpsByDateMap.entries())
        .slice(-30) // Últimos 30 días
        .map(([date, counts]) => ({ 
          date, 
          attending: counts.attending || 0, 
          notAttending: counts.notAttending || 0 
        })),
    }
  } catch (error) {
    console.error("Error obteniendo estadísticas:", error)
    // Retornar valores por defecto en caso de error
    return {
      totalRSVPs: 0,
      attendingRSVPs: 0,
      notAttendingRSVPs: 0,
      guestbookMessages: 0,
      pendingMessages: 0,
      settings: 0,
      menuStats: {},
      recentRSVPs: 0,
      totalGuests: 0,
      rsvpsByDate: [],
    }
  }
}

export default async function AdminPage() {
  try {
    const user = await getCurrentUser()

    if (!user) {
      redirect("/admin/login")
    }

    const stats = await getDetailedStats()
    const attendanceRate = stats.totalRSVPs > 0 
      ? Math.round((stats.attendingRSVPs / stats.totalRSVPs) * 100) 
      : 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary via-background to-secondary">
      <AdminNav />
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-serif font-bold text-primary mb-2">
              Panel de Administración
            </h1>
            <p className="text-muted-foreground">
              Control total de tu boda • Última actualización: {new Date().toLocaleString('es-ES')}
            </p>
          </div>
          <LogoutButton />
        </div>

        {/* Estadísticas principales con gráficos */}
        <DashboardStats stats={stats} />

        {/* Métricas rápidas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border-2 border-primary/10 elegant-shadow-lg premium-hover bg-gradient-to-br from-card to-card/50">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  RSVPs Totales
                </CardTitle>
                <Users className="w-5 h-5 text-primary/60" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline gap-2">
                <p className="text-3xl font-bold text-primary">{stats.totalRSVPs}</p>
                {stats.recentRSVPs > 0 && (
                  <span className="text-sm text-green-600 font-medium">
                    +{stats.recentRSVPs} esta semana
                  </span>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {stats.totalGuests} invitados totales
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 border-green-500/20 elegant-shadow-lg premium-hover bg-gradient-to-br from-green-50/50 to-card/50">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Confirmados
                </CardTitle>
                <UserCheck className="w-5 h-5 text-green-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline gap-2">
                <p className="text-3xl font-bold text-green-600">{stats.attendingRSVPs}</p>
                <span className="text-sm text-muted-foreground">
                  ({attendanceRate}%)
                </span>
              </div>
              <div className="w-full bg-muted rounded-full h-2 mt-2">
                <div
                  className="bg-green-600 h-2 rounded-full transition-all"
                  style={{ width: `${attendanceRate}%` }}
                ></div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-red-500/20 elegant-shadow-lg premium-hover bg-gradient-to-br from-red-50/50 to-card/50">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  No Confirmados
                </CardTitle>
                <UserX className="w-5 h-5 text-red-600" />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-red-600">{stats.notAttendingRSVPs}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {stats.totalRSVPs > 0 
                  ? Math.round((stats.notAttendingRSVPs / stats.totalRSVPs) * 100) 
                  : 0}% del total
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 border-blue-500/20 elegant-shadow-lg premium-hover bg-gradient-to-br from-blue-50/50 to-card/50">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Mensajes
                </CardTitle>
                <MessageSquare className="w-5 h-5 text-blue-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline gap-2">
                <p className="text-3xl font-bold text-blue-600">{stats.guestbookMessages}</p>
                {stats.pendingMessages > 0 && (
                  <span className="text-sm text-orange-600 font-medium">
                    {stats.pendingMessages} pendientes
                  </span>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {stats.pendingMessages === 0 ? 'Todos aprobados' : 'Requieren moderación'}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Accesos rápidos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="premium-hover border-2 border-primary/10 elegant-shadow-lg group">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-3 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                  <FileText className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <CardTitle>Gestión de RSVPs</CardTitle>
                  <CardDescription>Control total de confirmaciones</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-sm text-muted-foreground">
                <p>• Ver y editar todos los RSVPs</p>
                <p>• Filtrar y buscar avanzado</p>
                <p>• Exportar datos en CSV</p>
                <p>• Gestionar menús y alergias</p>
              </div>
              <Button asChild className="w-full mt-4">
                <Link href="/admin/rsvps">
                  <FileText className="w-4 h-4 mr-2" />
                  Gestionar RSVPs
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="premium-hover border-2 border-primary/10 elegant-shadow-lg group">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-3 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                  <MessageSquare className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <CardTitle>Libro de Mensajes</CardTitle>
                  <CardDescription>Moderar guestbook</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-sm text-muted-foreground">
                <p>• Aprobar o rechazar mensajes</p>
                <p>• Ver mensajes pendientes</p>
                <p>• Gestionar contenido público</p>
                <p>• {stats.pendingMessages} mensajes pendientes</p>
              </div>
              <Button asChild variant="outline" className="w-full mt-4">
                <Link href="/admin/guestbook">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Gestionar Mensajes
                  {stats.pendingMessages > 0 && (
                    <span className="ml-2 px-2 py-0.5 bg-orange-500 text-white text-xs rounded-full">
                      {stats.pendingMessages}
                    </span>
                  )}
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="premium-hover border-2 border-primary/10 elegant-shadow-lg group">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-3 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                  <Settings className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <CardTitle>Configuración</CardTitle>
                  <CardDescription>Personalizar la boda</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-sm text-muted-foreground">
                <p>• Información de la boda</p>
                <p>• Fechas y horarios</p>
                <p>• Ubicaciones</p>
                <p>• Contacto y detalles</p>
              </div>
              <Button asChild variant="outline" className="w-full mt-4">
                <Link href="/admin/settings">
                  <Settings className="w-4 h-4 mr-2" />
                  Configurar
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
    )
  } catch (error) {
    console.error("Error en AdminPage:", error)
    return (
      <div className="min-h-screen bg-secondary flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-primary mb-4">Error al cargar el panel</h1>
          <p className="text-muted-foreground mb-4">
            {error instanceof Error ? error.message : "Error desconocido"}
          </p>
          <a href="/admin/login" className="text-primary hover:underline">
            Volver al login
          </a>
        </div>
      </div>
    )
  }
}
