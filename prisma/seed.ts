import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  // Crear usuario admin por defecto
  const hashedPassword = await bcrypt.hash("admin123", 10)

  const admin = await prisma.user.upsert({
    where: { email: "admin@boda.com" },
    update: {},
    create: {
      email: "admin@boda.com",
      password: hashedPassword,
      name: "Administrador",
      role: "admin",
    },
  })

  // Configuración inicial
  const settings = [
    {
      key: "bride_name",
      value: "Celia",
      description: "Nombre de la novia",
    },
    {
      key: "groom_name",
      value: "Fernando",
      description: "Nombre del novio",
    },
    {
      key: "wedding_date",
      value: "2026-10-10",
      description: "Fecha de la boda (YYYY-MM-DD)",
    },
    {
      key: "wedding_time",
      value: "12:00",
      description: "Hora principal de la boda",
    },
    {
      key: "ceremony_location",
      value: "Basílica de Nuestra Señora de las Angustias",
      description: "Ubicación de la ceremonia",
    },
    {
      key: "ceremony_address",
      value: "Basílica de Nuestra Señora de las Angustias, Granada",
      description: "Dirección completa de la ceremonia",
    },
    {
      key: "reception_location",
      value: "Carmen de los Mártires",
      description: "Ubicación del banquete",
    },
    {
      key: "reception_address",
      value: "Carmen de los Mártires, Granada",
      description: "Dirección completa del banquete",
    },
    {
      key: "ceremony_time",
      value: "12:00",
      description: "Hora de la ceremonia",
    },
    {
      key: "cocktail_time",
      value: "14:00",
      description: "Hora del cóctel",
    },
    {
      key: "dinner_time",
      value: "15:30",
      description: "Hora de la cena",
    },
    {
      key: "party_time",
      value: "20:00",
      description: "Hora de la fiesta",
    },
    {
      key: "max_guests",
      value: "200",
      description: "Máximo número de invitados",
    },
    {
      key: "contact_email",
      value: "hola@boda-celia.com",
      description: "Email de contacto",
    },
    {
      key: "contact_phone",
      value: "Celia: 673 580 402 · Fernando: 697 776 390",
      description: "Teléfono de contacto",
    },
  ]

  for (const setting of settings) {
    await prisma.settings.upsert({
      where: { key: setting.key },
      update: {
        value: setting.value,
        description: setting.description,
      },
      create: setting,
    })
  }

  // FAQs iniciales
  const faqs = [
    {
      question: "¿Puedo traer niños?",
      answer: "Por supuesto, los niños son bienvenidos. Por favor, indícalo en el formulario de confirmación.",
      order: 0,
    },
    {
      question: "¿Hay menú vegetariano/vegano?",
      answer: "Sí, ofrecemos opciones vegetarianas y veganas. Indícalo en tu confirmación junto con cualquier alergia.",
      order: 1,
    },
    {
      question: "¿Cómo puedo contactar?",
      answer: `Puedes escribirnos a ${settings.find(s => s.key === "contact_email")?.value || "hola@boda-celia.com"} o llamarnos al ${settings.find(s => s.key === "contact_phone")?.value || "Celia: 673 580 402 · Fernando: 697 776 390"}.`,
      order: 2,
    },
  ]

  // Eliminar FAQs existentes y crear nuevas
  await prisma.fAQ.deleteMany({})
  
  for (const faq of faqs) {
    await prisma.fAQ.create({
      data: {
        question: faq.question,
        answer: faq.answer,
        order: faq.order,
      },
    })
  }

  console.log("✅ Seed completado:")
  console.log(`   Admin creado: admin@boda.com / admin123`)
  console.log(`   Configuración inicial creada`)
  console.log(`   ${faqs.length} FAQs creadas`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })


