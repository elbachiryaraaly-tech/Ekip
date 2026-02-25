import { Navbar } from "@/components/navbar"
import { Hero } from "@/components/hero"
import { Section } from "@/components/section"
import { GalleryLightbox } from "@/components/gallery-lightbox"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { MapPin, Clock, UtensilsCrossed, Music, Hotel, Gift, MessageSquare, HelpCircle, Heart, Sparkles } from "lucide-react"

async function getSettings() {
  try {
  const settings = await prisma.settings.findMany()
  const settingsMap: Record<string, string> = {}
  settings.forEach((s) => {
    settingsMap[s.key] = s.value
  })
  return settingsMap
  } catch (error) {
    console.error("Error loading settings:", error)
    return {}
  }
}

async function getFAQs() {
  try {
    // Verificar si el modelo existe
    if (!(prisma as any).fAQ) {
      return []
    }
    const faqs = await (prisma as any).fAQ.findMany({
      where: { deletedAt: null },
      orderBy: { order: "asc" },
    })
    return faqs
  } catch (error) {
    console.error("Error loading FAQs:", error)
    return []
  }
}

export default async function HomePage() {
  const settings = await getSettings()
  const faqs = await getFAQs()
  const brideName = settings.bride_name || "Celia"
  const groomName = settings.groom_name || "Fernando"
  const weddingDate = new Date(settings.wedding_date || "2026-10-10")

  return (
    <div className="min-h-screen overflow-x-hidden">
      <Navbar />
      <Hero
        brideName={brideName}
        groomName={groomName}
        weddingDate={weddingDate}
      />

      {/* Nuestra historia - Diseño Premium */}
      <Section id="historia" title="Nuestra historia" className="bg-gradient-to-b from-background via-secondary/20 to-background relative">
        <div className="max-w-4xl mx-auto">
          <Card className="border-2 border-primary/10 elegant-shadow-xl bg-card/95 backdrop-blur-sm premium-hover relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            
            <CardContent className="p-6 sm:p-10 md:p-14 lg:p-16 text-center relative z-10">
              <div className="flex items-center justify-center gap-6 mb-8">
                <div className="h-px w-20 bg-gradient-to-r from-transparent to-primary/30"></div>
                <Heart className="w-10 h-10 text-primary fill-primary animate-float-slow" />
                <div className="h-px w-20 bg-gradient-to-l from-transparent to-primary/30"></div>
              </div>
              
              <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-muted-foreground leading-relaxed mb-4 sm:mb-6 font-serif">
                Dos almas que se encontraron en el momento perfecto, decididas a compartir el resto de sus días juntas.
              </p>
              
              <p className="text-sm sm:text-base md:text-lg text-muted-foreground leading-relaxed font-serif">
                Este día especial es el comienzo de una nueva aventura llena de amor, risas y momentos inolvidables.
                Estamos emocionados de compartir este momento tan importante con todos ustedes.
              </p>
            </CardContent>
          </Card>
        </div>
      </Section>

      {/* Agenda del día - Diseño Premium */}
      <Section id="agenda" title="Agenda del día" className="bg-gradient-to-b from-secondary/40 via-secondary/20 to-secondary/40 relative">
        <div className="absolute inset-0 line-pattern opacity-20 pointer-events-none"></div>
        
        <div className="flex flex-col md:flex-row gap-10 lg:gap-16 relative z-10 max-w-7xl mx-auto items-stretch">
          {/* Columna izquierda - Agenda */}
          <div className="flex-1 space-y-6 flex flex-col">
            {[
              { 
                icon: Clock, 
                title: "Ceremonia", 
                time: settings.ceremony_time || "12:00", 
                location: settings.ceremony_location || "Basílica de Nuestra Señora de las Angustias, Granada" 
              },
              { 
                icon: UtensilsCrossed, 
                title: "Cóctel", 
                time: settings.cocktail_time || "14:00", 
                location: settings.reception_location || "Carmen de los Mártires, Granada" 
              },
              { 
                icon: UtensilsCrossed, 
                title: "Banquete", 
                time: settings.dinner_time || "15:30", 
                location: settings.reception_location || "Carmen de los Mártires, Granada" 
              },
              { 
                icon: Music, 
                title: "Fiesta", 
                time: settings.party_time || "20:00", 
                location: settings.reception_location || "Carmen de los Mártires, Granada" 
              },
            ].map((event, index) => {
              const Icon = event.icon
              return (
                <Card key={index} className="premium-hover border-2 border-primary/10 elegant-shadow-lg bg-card/95 backdrop-blur-sm relative overflow-hidden group">
                  {/* Líneas decorativas animadas */}
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/50 via-primary/30 to-primary/50 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-primary/50 via-primary/30 to-primary/50 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  
                  <CardHeader className="pb-6 relative z-10">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="p-3 rounded-2xl bg-primary/10 border-2 border-primary/20 group-hover:scale-110 transition-transform relative">
                        <div className="absolute inset-0 rounded-2xl bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <Icon className="w-7 h-7 text-primary relative z-10" />
                      </div>
                      <CardTitle className="text-xl sm:text-2xl font-serif text-primary">{event.title}</CardTitle>
                    </div>
                    <div className="space-y-2">
                      <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary font-serif">{event.time}</div>
                      <div className="w-16 h-0.5 bg-primary/40 rounded-full"></div>
                    </div>
                  </CardHeader>
                  <CardContent className="relative z-10">
                    <p className="text-muted-foreground leading-relaxed text-base">
                      {event.location}
                    </p>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* Columna derecha - Foto */}
          <div className="flex-1 md:sticky md:top-8 flex items-start">
            <div className="relative rounded-2xl overflow-hidden border-2 border-primary/10 elegant-shadow-xl premium-hover group w-full h-full min-h-full">
              {/* Imagen de fondo */}
              <div 
                className="w-full h-full min-h-[280px] sm:min-h-[380px] md:min-h-[500px] lg:min-h-[600px] bg-cover bg-center bg-no-repeat relative"
                style={{
                  backgroundImage: 'url(/agenda-photo.jpg)',
                }}
              >
                {/* Overlay sutil */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/20"></div>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* Ubicación - Diseño Premium */}
      <Section id="ubicacion" title="Ubicación" className="bg-gradient-to-b from-background via-secondary/20 to-background relative">
        <div className="grid md:grid-cols-2 gap-10 max-w-5xl mx-auto">
          {[
            { 
              title: "Ceremonia", 
              subtitle: "Nuestro momento especial",
              address: settings.ceremony_address || "Basílica de Nuestra Señora de las Angustias, Granada",
              addressQuery: settings.ceremony_address || "Basílica de Nuestra Señora de las Angustias, Granada"
            },
            { 
              title: "Banquete y Fiesta", 
              subtitle: "Celebración y diversión",
              address: settings.reception_address || "Carmen de los Mártires, Granada",
              addressQuery: settings.reception_address || "Carmen de los Mártires, Granada"
            },
          ].map((location, index) => (
            <Card key={index} className="premium-hover border-2 border-primary/10 elegant-shadow-xl bg-card/95 backdrop-blur-sm relative overflow-hidden group">
              {/* Efecto de brillo en hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              
              {/* Líneas decorativas en las esquinas */}
              <div className="absolute top-0 left-0 w-24 h-px bg-gradient-to-r from-primary/50 to-transparent"></div>
              <div className="absolute top-0 right-0 w-24 h-px bg-gradient-to-l from-primary/50 to-transparent"></div>
              <div className="absolute bottom-0 left-0 w-24 h-px bg-gradient-to-r from-primary/50 to-transparent"></div>
              <div className="absolute bottom-0 right-0 w-24 h-px bg-gradient-to-l from-primary/50 to-transparent"></div>
              
              <CardHeader className="pb-6 relative z-10">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-4 rounded-2xl bg-primary/10 border-2 border-primary/20 relative">
                    <div className="absolute inset-0 rounded-2xl border border-primary/10"></div>
                    <MapPin className="w-8 h-8 text-primary relative z-10" />
                  </div>
                  <div>
                    <CardTitle className="text-xl sm:text-2xl md:text-3xl font-serif mb-1">{location.title}</CardTitle>
                    <CardDescription className="text-base">{location.subtitle}</CardDescription>
                    <div className="mt-2 w-20 h-0.5 bg-primary/40 rounded-full"></div>
                  </div>
              </div>
            </CardHeader>
              <CardContent className="space-y-6 relative z-10">
                <p className="text-sm sm:text-base md:text-lg text-muted-foreground leading-relaxed">
                  {location.address}
                </p>
<Button variant="weddingOutline" asChild className="w-full">
                  <a
                    href={`https://maps.google.com/?q=${encodeURIComponent(location.addressQuery)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <MapPin className="w-4 h-4 mr-2 shrink-0" />
                    Cómo llegar
                  </a>
              </Button>
            </CardContent>
          </Card>
          ))}
        </div>

        {/* Información adicional */}
        <div className="mt-10 sm:mt-14 md:mt-16 max-w-4xl mx-auto px-2 sm:px-0">
          <Card className="bg-gradient-to-br from-secondary/80 to-muted/50 border-2 border-primary/10 elegant-shadow-lg p-5 sm:p-8 md:p-10 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5"></div>
            <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6 relative z-10">
              <div className="p-4 rounded-2xl bg-primary/10 border-2 border-primary/20 flex-shrink-0">
                <Clock className="w-8 h-8 text-primary" />
              </div>
              <div className="flex-1">
<h3 className="text-xl sm:text-2xl font-serif font-bold text-primary mb-3 sm:mb-4 relative">
              Parking y transporte
              <div className="absolute -bottom-2 left-0 w-24 h-0.5 bg-primary/40 rounded-full"></div>
            </h3>
                <p className="text-muted-foreground leading-relaxed text-sm sm:text-base md:text-lg">
              Hay parking disponible en ambas ubicaciones. También puedes llegar en transporte público:
              Metro línea 5 (parada más cercana a 5 minutos caminando).
            </p>
          </div>
            </div>
          </Card>
        </div>
      </Section>

      {/* Galería - Diseño Premium con lightbox */}
      <Section id="galeria" title="Galería" className="bg-gradient-to-b from-secondary/30 to-background relative">
        <div className="max-w-7xl mx-auto px-1 sm:px-2">
          <GalleryLightbox />
        </div>
      </Section>

      {/* Mensajes / Guestbook - Diseño Premium */}
      <Section id="mensajes" title="Libro de mensajes" className="bg-gradient-to-b from-background via-secondary/20 to-background relative">
        <div className="max-w-3xl mx-auto">
          <Card className="border-2 border-primary/10 elegant-shadow-xl bg-card/95 backdrop-blur-sm premium-hover relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            
            <CardContent className="p-6 sm:p-10 md:p-14 lg:p-16 text-center relative z-10">
              <div className="mb-6 sm:mb-10">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 border-4 border-primary/20 relative">
                  <MessageSquare className="w-10 h-10 text-primary relative z-10" />
                </div>
              </div>
              
              <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 mb-4 sm:mb-6">
                <div className="h-px w-12 sm:w-20 bg-gradient-to-r from-transparent to-primary/30 shrink-0"></div>
                <p className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-serif text-primary text-center">
                  Déjanos un mensaje especial
                </p>
                <div className="h-px w-12 sm:w-20 bg-gradient-to-l from-transparent to-primary/30 shrink-0"></div>
              </div>
              
              <p className="text-sm sm:text-base md:text-lg lg:text-xl text-muted-foreground mb-6 sm:mb-10 leading-relaxed">
                Comparte con nosotros tus mejores deseos para este día tan importante
              </p>
              
              <Button variant="wedding" asChild size="lg" className="elegant-shadow-lg">
                <Link href="/guestbook">Escribir mensaje</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </Section>

      {/* FAQ - Diseño Premium */}
      <Section id="faq" title="Preguntas frecuentes" className="bg-gradient-to-b from-secondary/20 to-background relative">
        <div className="space-y-6 max-w-4xl mx-auto">
          {faqs.length > 0 ? (
            faqs.map((faq: { question: string; answer: string }, index: number) => (
            <Card key={index} className="premium-hover border-2 border-primary/10 elegant-shadow-lg bg-card/95 backdrop-blur-sm relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-24 h-px bg-gradient-to-r from-primary/50 to-transparent"></div>
              <div className="absolute top-0 right-0 w-24 h-px bg-gradient-to-l from-primary/50 to-transparent"></div>
              <div className="absolute bottom-0 left-0 w-24 h-px bg-gradient-to-r from-primary/50 to-transparent"></div>
              <div className="absolute bottom-0 right-0 w-24 h-px bg-gradient-to-l from-primary/50 to-transparent"></div>
              
              <CardHeader className="pb-4 relative z-10">
                <CardTitle className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-5 text-lg sm:text-xl md:text-2xl font-serif">
                  <div className="flex items-center gap-3 sm:gap-5">
                    <div className="p-2.5 sm:p-3 rounded-xl bg-primary/10 border-2 border-primary/20 relative shrink-0">
                      <div className="absolute inset-0 rounded-xl border border-primary/10"></div>
                      <HelpCircle className="w-6 h-6 sm:w-7 sm:h-7 text-primary relative z-10" />
                    </div>
                    <span className="flex-1">{faq.question}</span>
                  </div>
                  <div className="hidden sm:block h-px flex-1 max-w-32 bg-gradient-to-r from-primary/30 to-transparent"></div>
              </CardTitle>
            </CardHeader>
              <CardContent className="relative z-10">
                <p className="text-muted-foreground leading-relaxed text-sm sm:text-base md:text-lg pl-0 sm:pl-14 md:pl-16">
                  {faq.answer}
              </p>
            </CardContent>
          </Card>
            ))
          ) : (
            <Card className="border-2 border-primary/10 elegant-shadow-lg bg-card/95 backdrop-blur-sm">
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground text-lg">
                  Las preguntas frecuentes se agregarán pronto
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </Section>

      {/* CTA Final - Diseño Premium */}
      <section className="relative py-16 sm:py-24 md:py-32 lg:py-40 px-4 sm:px-6 pb-safe bg-gradient-to-br from-primary via-primary/95 to-primary overflow-hidden">
        {/* Elementos decorativos */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-20 w-64 h-64 border-2 border-primary-foreground/10 rounded-full blur-2xl"></div>
          <div className="absolute bottom-20 right-20 w-48 h-48 border-2 border-primary-foreground/10 rounded-full blur-2xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary-foreground/5 rounded-full blur-3xl"></div>
        </div>
        
        <div className="container mx-auto max-w-4xl text-center space-y-6 sm:space-y-8 md:space-y-10 relative z-10">
          <div className="flex items-center justify-center gap-4 sm:gap-8 mb-4 sm:mb-8">
            <div className="h-px w-16 sm:w-24 md:w-32 bg-gradient-to-r from-transparent via-primary-foreground/40 to-primary-foreground/20"></div>
            <div className="relative">
              <Heart className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-primary-foreground fill-primary-foreground animate-float-slow" />
              <div className="absolute inset-0 w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 border-2 border-primary-foreground/20 rounded-full animate-ping"></div>
            </div>
            <div className="h-px w-16 sm:w-24 md:w-32 bg-gradient-to-l from-transparent via-primary-foreground/40 to-primary-foreground/20"></div>
          </div>
          
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-serif font-bold text-primary-foreground leading-tight px-1">
            ¿Nos acompañarás?
          </h2>
          
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl text-primary-foreground/90 font-serif max-w-2xl mx-auto px-2">
            Confirma tu asistencia para que podamos organizar todo perfectamente
          </p>
          
          <div className="pt-4 sm:pt-6 md:pt-8 relative overflow-hidden group">
            <span className="absolute inset-0 bg-gradient-to-r from-primary-foreground/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity z-0"></span>
            <Button variant="weddingCta" asChild size="lg" className="elegant-shadow-2xl relative z-10">
              <Link href="/rsvp" className="flex items-center justify-center gap-3">
                <Heart className="w-5 h-5 sm:w-6 sm:h-6 shrink-0" />
                Confirmar asistencia
              </Link>
          </Button>
          </div>
          
          <div className="flex items-center justify-center gap-4 sm:gap-8 mt-8 sm:mt-12">
            <div className="h-px w-32 bg-gradient-to-r from-transparent via-primary-foreground/40 to-primary-foreground/20"></div>
            <Heart className="w-8 h-8 text-primary-foreground fill-primary-foreground" />
            <div className="h-px w-32 bg-gradient-to-l from-transparent via-primary-foreground/40 to-primary-foreground/20"></div>
          </div>
        </div>
      </section>

      {/* Footer - Diseño Premium */}
      <footer className="bg-secondary/90 backdrop-blur-sm py-10 sm:py-14 md:py-16 px-4 pb-safe border-t-2 border-primary/10 relative">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent"></div>
        <div className="container mx-auto max-w-5xl text-center space-y-4 sm:space-y-6">
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 mb-4 sm:mb-6">
            <Heart className="w-6 h-6 text-primary fill-primary animate-float-slow" />
            <p className="text-base sm:text-lg md:text-xl font-serif text-primary font-semibold">© 2026 Boda {brideName} y {groomName}</p>
            <Heart className="w-6 h-6 text-primary fill-primary animate-float-slow" style={{ animationDelay: '0.5s' }} />
          </div>
          <p className="text-sm text-muted-foreground">
            <Link href="/privacy" className="hover:text-primary transition-colors underline-offset-4 hover:underline">
            Política de privacidad
          </Link>
        </p>
        </div>
      </footer>
    </div>
  )
}
