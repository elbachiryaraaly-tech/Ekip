import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
}

export const metadata: Metadata = {
  title: "Boda Celia y Fernando",
  description: "Invitación a nuestra boda. Confirma tu asistencia y comparte este día especial con nosotros.",
  keywords: ["boda", "matrimonio", "invitación", "RSVP"],
  authors: [{ name: "Boda Celia y Fernando" }],
  openGraph: {
    title: "Boda Celia y Fernando",
    description: "Invitación a nuestra boda. Confirma tu asistencia y comparte este día especial con nosotros.",
    type: "website",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
}
