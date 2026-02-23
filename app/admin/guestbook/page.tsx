import { getCurrentUser } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { AdminNav } from "@/components/admin/admin-nav"
import { LogoutButton } from "@/components/admin/logout-button"
import { GuestbookAdminList } from "@/components/admin/guestbook-admin-list"

async function getGuestbookEntries() {
  const entries = await prisma.guestbookEntry.findMany({
    where: { deletedAt: null },
    orderBy: { createdAt: "desc" },
  })

  return entries.map((entry) => ({
    id: entry.id,
    name: entry.name,
    message: entry.message,
    approved: entry.approved,
    createdAt: entry.createdAt.toISOString(),
    approvedAt: entry.approvedAt?.toISOString() || null,
  }))
}

export default async function AdminGuestbookPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/admin/login")
  }

  const entries = await getGuestbookEntries()

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary via-background to-secondary">
      <AdminNav />
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-serif font-bold text-primary mb-2">
              Libro de Mensajes
            </h1>
            <p className="text-muted-foreground">
              Modera y gestiona los mensajes del guestbook
            </p>
          </div>
          <LogoutButton />
        </div>

        <GuestbookAdminList initialEntries={entries} />
      </div>
    </div>
  )
}
