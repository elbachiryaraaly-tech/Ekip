"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts"
import { TrendingUp, Calendar, UtensilsCrossed } from "lucide-react"

interface DashboardStatsProps {
  stats: {
    totalRSVPs: number
    attendingRSVPs: number
    notAttendingRSVPs: number
    guestbookMessages: number
    pendingMessages: number
    menuStats: Record<string, number>
    recentRSVPs: number
    totalGuests: number
    rsvpsByDate: Array<{ date: string; attending: number; notAttending: number }>
  }
}

const COLORS = ['#2F5D50', '#4A7C59', '#6B9B7A', '#8DB99A', '#A8C5B5']

export function DashboardStats({ stats }: DashboardStatsProps) {
  // Preparar datos para gráfico de menús
  const menuData = Object.entries(stats.menuStats).map(([name, value]) => ({
    name: name === 'sin_menu' ? 'Sin especificar' : name.charAt(0).toUpperCase() + name.slice(1),
    value,
  }))

  // Preparar datos para gráfico de tendencias (últimos 7 días)
  const trendData = (stats.rsvpsByDate || []).slice(-7).map((item) => ({
    fecha: new Date(item.date).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' }),
    Confirmados: item.attending || 0,
    'No confirmados': item.notAttending || 0,
  }))

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      {/* Gráfico de tendencias */}
      <Card className="border-2 border-primary/10 elegant-shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                Tendencia de RSVPs
              </CardTitle>
              <CardDescription>Últimos 7 días</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="fecha" 
                stroke="#6b7280"
                style={{ fontSize: '12px' }}
              />
              <YAxis 
                stroke="#6b7280"
                style={{ fontSize: '12px' }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#fff', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                }}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="Confirmados" 
                stroke="#22c55e" 
                strokeWidth={2}
                dot={{ fill: '#22c55e', r: 4 }}
              />
              <Line 
                type="monotone" 
                dataKey="No confirmados" 
                stroke="#ef4444" 
                strokeWidth={2}
                dot={{ fill: '#ef4444', r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Gráfico de menús */}
      <Card className="border-2 border-primary/10 elegant-shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <UtensilsCrossed className="w-5 h-5 text-primary" />
                Distribución de Menús
              </CardTitle>
              <CardDescription>Preferencias de los invitados</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {menuData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={menuData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {menuData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[300px] text-muted-foreground">
              No hay datos de menús disponibles
            </div>
          )}
        </CardContent>
      </Card>

      {/* Gráfico de barras - RSVPs por fecha */}
      <Card className="border-2 border-primary/10 elegant-shadow-lg lg:col-span-2">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary" />
                RSVPs por Fecha
              </CardTitle>
              <CardDescription>Últimos 30 días</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={(stats.rsvpsByDate || []).slice(-30).map((item) => ({
              fecha: new Date(item.date).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' }),
              Confirmados: item.attending || 0,
              'No confirmados': item.notAttending || 0,
            }))}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="fecha" 
                stroke="#6b7280"
                style={{ fontSize: '11px' }}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis 
                stroke="#6b7280"
                style={{ fontSize: '12px' }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#fff', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                }}
              />
              <Legend />
              <Bar dataKey="Confirmados" fill="#22c55e" radius={[8, 8, 0, 0]} />
              <Bar dataKey="No confirmados" fill="#ef4444" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}
