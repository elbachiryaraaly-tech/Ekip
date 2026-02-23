import { getCurrentUser } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { AdminNav } from "@/components/admin/admin-nav"
import { LogoutButton } from "@/components/admin/logout-button"
import { FAQAdminList } from "@/components/admin/faq-admin-list"

async function getFAQs() {
  try {
    // Verificar si el modelo existe en Prisma (usar any temporalmente hasta regenerar)
    const prismaClient = prisma as any
    if (!prismaClient.fAQ) {
      console.warn("Modelo FAQ no disponible. Por favor, ejecuta: npx prisma generate")
      return []
    }
    
    const faqs = await prismaClient.fAQ.findMany({
      where: { deletedAt: null },
      orderBy: { order: "asc" },
    })

    return faqs.map((faq: any) => ({
      id: faq.id,
      question: faq.question,
      answer: faq.answer,
      order: faq.order,
      createdAt: faq.createdAt.toISOString(),
      updatedAt: faq.updatedAt.toISOString(),
    }))
  } catch (error) {
    console.error("Error obteniendo FAQs:", error)
    return []
  }
}

export default async function AdminFAQsPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/admin/login")
  }

  const faqs = await getFAQs()

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary via-background to-secondary">
      <AdminNav />
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-serif font-bold text-primary mb-2">
              Preguntas Frecuentes
            </h1>
            <p className="text-muted-foreground">
              Gestiona las preguntas frecuentes que aparecen en la página principal
            </p>
          </div>
          <LogoutButton />
        </div>

        <FAQAdminList initialFAQs={faqs} />
      </div>
    </div>
  )
}


