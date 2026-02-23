"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"
import { useState } from "react"

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  const links = [
    { href: "#historia", label: "Nuestra historia" },
    { href: "#agenda", label: "Agenda" },
    { href: "#ubicacion", label: "Ubicación" },
    { href: "#galeria", label: "Galería" },
    { href: "#mensajes", label: "Mensajes" },
    { href: "#faq", label: "FAQ" },
  ]

  return (
    <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border/50">
      <div className="container mx-auto px-4 lg:px-6">
        <div className="flex items-center justify-between h-16 md:h-20">
          <Link href="/" className="text-lg md:text-xl font-sans font-bold text-primary">
            Boda Celia & Fernando
          </Link>

          {/* Desktop menu */}
          <div className="hidden lg:flex items-center gap-6 xl:gap-8">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors cursor-pointer"
                onClick={(e) => {
                  e.preventDefault()
                  const element = document.querySelector(link.href)
                  if (element) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'start' })
                  }
                }}
              >
                {link.label}
              </a>
            ))}
            <Button asChild size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-md">
              <Link href="/rsvp">RSVP</Link>
            </Button>
          </div>

          {/* Mobile/Tablet menu button */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X /> : <Menu />}
          </Button>
        </div>

        {/* Mobile/Tablet menu */}
        {isOpen && (
          <div className="lg:hidden py-4 space-y-2 border-t border-border/50">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="block py-2 text-sm font-medium text-foreground/80 hover:text-primary transition-colors cursor-pointer"
                onClick={(e) => {
                  e.preventDefault()
                  setIsOpen(false)
                  const element = document.querySelector(link.href)
                  if (element) {
                    setTimeout(() => {
                      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
                    }, 100)
                  }
                }}
              >
                {link.label}
              </a>
            ))}
            <Button asChild size="sm" className="w-full mt-4 bg-primary text-primary-foreground hover:bg-primary/90 rounded-md">
              <Link href="/rsvp" onClick={() => setIsOpen(false)}>
                RSVP
              </Link>
            </Button>
          </div>
        )}
      </div>
    </nav>
  )
}






