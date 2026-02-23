import { getCurrentUser } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { AdminNav } from "@/components/admin/admin-nav"
import { RSVPList } from "@/components/admin/rsvp-list"
import { LogoutButton } from "@/components/admin/logout-button"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Download } from "lucide-react"

async function getRSVPs(searchParams: { [key: string]: string | string[] | undefined }) {
  const page = parseInt(searchParams.page as string) || 1
  const limit = 20
  const skip = (page - 1) * limit
  const search = (searchParams.search as string) || ""
  const attending = searchParams.attending as string | undefined
  const menu = searchParams.menu as string | undefined

  const where: any = {
    deletedAt: null,
  }

  if (search) {
    where.OR = [
      { firstName: { contains: search, mode: "insensitive" } },
      { lastName: { contains: search, mode: "insensitive" } },
      { email: { contains: search, mode: "insensitive" } },
    ]
  }

  if (attending !== undefined) {
    where.attending = attending === "true"
  }

  if (menu) {
    where.menu = menu
  }

  const [rsvps, total] = await Promise.all([
    prisma.rSVP.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    prisma.rSVP.count({ where }),
  ])

  return {
    rsvps: rsvps.map((r) => ({
      ...r,
      guests: r.guests ? JSON.parse(r.guests as string) : null,
    })),
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  }
}

export default async function AdminRSVPsPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/admin/login")
  }

  const data = await getRSVPs(searchParams)

  return (
    <div className="min-h-screen bg-secondary">
      <AdminNav />
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-serif font-bold text-primary">Gestión de RSVPs</h1>
          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <Link href="/api/admin/export-rsvps">
                <Download className="w-4 h-4 mr-2" />
                Exportar CSV
              </Link>
            </Button>
            <LogoutButton />
          </div>
        </div>
        <RSVPList initialData={data} />
      </div>
    </div>
  )
}

