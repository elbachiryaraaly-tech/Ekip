"use client"

import { Countdown } from "@/components/countdown"
import { Heart, Sparkles } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

interface HeroProps {
  brideName: string
  groomName: string
  weddingDate: Date
}

export function Hero({ brideName, groomName, weddingDate }: HeroProps) {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Imagen de fondo */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url(/1769431664462.jpg)',
        }}
      >
        {/* Overlay oscuro para legibilidad del texto */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/60"></div>
        {/* Overlay con color de tema */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-primary/20"></div>
      </div>

      {/* Elementos decorativos de fondo */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-64 h-64 border-2 border-primary/20 rounded-full blur-3xl animate-gentle-pulse"></div>
        <div className="absolute bottom-20 right-20 w-48 h-48 border-2 border-primary/20 rounded-full blur-3xl animate-gentle-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-gentle-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Contenido principal */}
      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="max-w-5xl mx-auto text-center space-y-8">
          {/* Decoración superior */}
          <div className="flex items-center justify-center gap-6 mb-8">
            <div className="h-px w-32 bg-gradient-to-r from-transparent via-primary-foreground/50 to-primary-foreground/30"></div>
            <div className="relative">
              <Sparkles className="w-8 h-8 text-primary-foreground animate-float-slow drop-shadow-lg" />
              <div className="absolute inset-0 w-8 h-8 border-2 border-primary-foreground/30 rounded-full animate-ping"></div>
            </div>
            <div className="h-px w-32 bg-gradient-to-l from-transparent via-primary-foreground/50 to-primary-foreground/30"></div>
          </div>

          {/* Título principal */}
          <div className="space-y-4 animate-fade-in-up">
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif font-bold text-primary-foreground leading-tight drop-shadow-2xl">
              {brideName}
            </h1>
            <div className="flex items-center justify-center gap-4 my-6">
              <div className="h-px w-24 bg-gradient-to-r from-transparent to-primary-foreground/60"></div>
              <Heart className="w-10 h-10 text-primary-foreground fill-primary-foreground animate-float-slow drop-shadow-lg" />
              <div className="h-px w-24 bg-gradient-to-l from-transparent to-primary-foreground/60"></div>
            </div>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif font-bold text-primary-foreground leading-tight drop-shadow-2xl">
              {groomName}
            </h1>
          </div>

          {/* Fecha de la boda */}
          <div className="space-y-6 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <div className="inline-block px-8 py-4 rounded-full bg-primary-foreground/10 border-2 border-primary-foreground/30 backdrop-blur-md">
              <p className="text-2xl md:text-3xl font-serif text-primary-foreground drop-shadow-lg">
                {weddingDate.toLocaleDateString('es-ES', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>
          </div>

          {/* Contador regresivo */}
          <div className="pt-8 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            <Countdown targetDate={weddingDate} />
          </div>

          {/* Botón de confirmar asistencia */}
          <div className="pt-8 animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
            <Button
              asChild
              size="lg"
              className="group relative px-8 py-6 text-lg font-serif rounded-full bg-primary-foreground/95 hover:bg-primary-foreground text-primary border-2 border-primary-foreground/20 shadow-2xl hover:shadow-primary-foreground/20 transition-all duration-300 hover:scale-105"
            >
              <Link href="/rsvp" className="flex items-center gap-3">
                <Heart className="w-5 h-5 fill-primary group-hover:scale-110 transition-transform" />
                <span>Confirmar asistencia</span>
                <Heart className="w-5 h-5 fill-primary group-hover:scale-110 transition-transform" />
              </Link>
            </Button>
          </div>

          {/* Decoración inferior */}
          <div className="flex items-center justify-center gap-6 mt-12">
            <div className="h-px w-32 bg-gradient-to-r from-transparent via-primary-foreground/50 to-primary-foreground/30"></div>
            <Heart className="w-6 h-6 text-primary-foreground fill-primary-foreground animate-float-slow drop-shadow-lg" style={{ animationDelay: '0.5s' }} />
            <div className="h-px w-32 bg-gradient-to-l from-transparent via-primary-foreground/50 to-primary-foreground/30"></div>
          </div>
        </div>
      </div>

      {/* Gradiente inferior para transición suave */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent pointer-events-none"></div>
    </section>
  )
}
