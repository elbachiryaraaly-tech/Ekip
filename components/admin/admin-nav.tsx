"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Users, MessageSquare, Settings, HelpCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

const navItems = [
  { href: "/admin", label: "Dashboard", icon: Home },
  { href: "/admin/rsvps", label: "RSVPs", icon: Users },
  { href: "/admin/guestbook", label: "Mensajes", icon: MessageSquare },
  { href: "/admin/faqs", label: "FAQs", icon: HelpCircle },
  { href: "/admin/settings", label: "Configuración", icon: Settings },
]

export function AdminNav() {
  const pathname = usePathname()

  return (
    <nav className="bg-background/95 backdrop-blur-sm border-b-2 border-primary/10 sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          <Link 
            href="/admin" 
            className="text-xl md:text-2xl font-serif font-bold text-primary hover:text-primary/80 transition-colors flex items-center gap-2"
          >
            <div className="p-1.5 rounded-lg bg-primary/10">
              <Home className="w-5 h-5 text-primary" />
            </div>
            Panel Admin
          </Link>
          
          <div className="flex items-center gap-1 md:gap-2">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href || (item.href !== "/admin" && pathname?.startsWith(item.href))
              
              return (
                <Button
                  key={item.href}
                  asChild
                  variant={isActive ? "default" : "ghost"}
                  size="sm"
                  className={`transition-all duration-200 ${
                    isActive 
                      ? "bg-primary text-primary-foreground shadow-md" 
                      : "hover:bg-primary/10 hover:text-primary"
                  }`}
                >
                  <Link href={item.href} className="flex items-center gap-2">
                    <Icon className="w-4 h-4" />
                    <span className="hidden md:inline">{item.label}</span>
                  </Link>
                </Button>
              )
            })}
          </div>
        </div>
      </div>
    </nav>
  )
}
