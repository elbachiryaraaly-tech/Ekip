import { getCurrentUser } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { AdminNav } from "@/components/admin/admin-nav"
import { LogoutButton } from "@/components/admin/logout-button"
import { SettingsForm } from "@/components/admin/settings-form"

async function getSettings() {
  const settings = await prisma.settings.findMany()
  const settingsMap: Record<string, string> = {}
  settings.forEach((s) => {
    settingsMap[s.key] = s.value
  })
  return settingsMap
}

export default async function AdminSettingsPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/admin/login")
  }

  const settings = await getSettings()

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary via-background to-secondary">
      <AdminNav />
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-serif font-bold text-primary mb-2">
              Configuración
            </h1>
            <p className="text-muted-foreground">
              Personaliza toda la información de tu boda
            </p>
          </div>
          <LogoutButton />
        </div>

        <SettingsForm initialSettings={settings} />
      </div>
    </div>
  )
}
