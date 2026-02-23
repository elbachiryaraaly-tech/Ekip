import { Navbar } from "@/components/navbar"
import { Hero } from "@/components/hero"
import { Section } from "@/components/section"
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
    <div className="min-h-screen overflow-hidden">
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
            
            <CardContent className="p-12 md:p-16 text-center relative z-10">
              <div className="flex items-center justify-center gap-6 mb-8">
                <div className="h-px w-20 bg-gradient-to-r from-transparent to-primary/30"></div>
                <Heart className="w-10 h-10 text-primary fill-primary animate-float-slow" />
                <div className="h-px w-20 bg-gradient-to-l from-transparent to-primary/30"></div>
              </div>
              
              <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed mb-6 font-serif">
                Dos almas que se encontraron en el momento perfecto, decididas a compartir el resto de sus días juntas.
              </p>
              
              <p className="text-lg text-muted-foreground leading-relaxed font-serif">
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
              { icon: Clock, title: "Ceremonia", time: settings.ceremony_time || "12:00", location: settings.ceremony_location || "Iglesia de San Juan, Madrid" },
              { icon: UtensilsCrossed, title: "Cóctel", time: settings.cocktail_time || "18:30", location: settings.reception_location || "Salón de Eventos El Jardín" },
              { icon: UtensilsCrossed, title: "Banquete", time: settings.dinner_time || "20:00", location: settings.reception_location || "Salón de Eventos El Jardín" },
              { icon: Music, title: "Fiesta", time: settings.party_time || "23:00", location: settings.reception_location || "Salón de Eventos El Jardín" },
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
                      <CardTitle className="text-2xl font-serif text-primary">{event.title}</CardTitle>
                    </div>
                    <div className="space-y-2">
                      <div className="text-4xl font-bold text-primary font-serif">{event.time}</div>
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
                className="w-full h-full min-h-[600px] md:min-h-full bg-cover bg-center bg-no-repeat relative"
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
              address: settings.ceremony_address || "Calle Ejemplo, 123, 28001 Madrid",
              addressQuery: settings.ceremony_address || "Madrid"
            },
            { 
              title: "Banquete y Fiesta", 
              subtitle: "Celebración y diversión",
              address: settings.reception_address || "Avenida Principal, 456, 28001 Madrid",
              addressQuery: settings.reception_address || "Madrid"
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
                    <CardTitle className="text-3xl font-serif mb-1">{location.title}</CardTitle>
                    <CardDescription className="text-base">{location.subtitle}</CardDescription>
                    <div className="mt-2 w-20 h-0.5 bg-primary/40 rounded-full"></div>
                  </div>
              </div>
            </CardHeader>
              <CardContent className="space-y-6 relative z-10">
                <p className="text-lg text-muted-foreground leading-relaxed">
                  {location.address}
                </p>
                <Button variant="outline" asChild className="w-full rounded-full border-2 premium-hover">
                  <a
                    href={`https://maps.google.com/?q=${encodeURIComponent(location.addressQuery)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                    <MapPin className="w-4 h-4 mr-2" />
                  Cómo llegar
                </a>
              </Button>
            </CardContent>
          </Card>
          ))}
        </div>

        {/* Información adicional */}
        <div className="mt-16 max-w-4xl mx-auto">
          <Card className="bg-gradient-to-br from-secondary/80 to-muted/50 border-2 border-primary/10 elegant-shadow-lg p-10 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5"></div>
            <div className="flex items-start gap-6 relative z-10">
              <div className="p-4 rounded-2xl bg-primary/10 border-2 border-primary/20 flex-shrink-0">
                <Clock className="w-8 h-8 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-serif font-bold text-primary mb-4 relative">
                  Parking y transporte
                  <div className="absolute -bottom-2 left-0 w-24 h-0.5 bg-primary/40 rounded-full"></div>
                </h3>
                <p className="text-muted-foreground leading-relaxed text-lg">
              Hay parking disponible en ambas ubicaciones. También puedes llegar en transporte público:
              Metro línea 5 (parada más cercana a 5 minutos caminando).
            </p>
          </div>
            </div>
          </Card>
        </div>
      </Section>

      {/* Galería - Diseño Premium */}
      <Section id="galeria" title="Galería" className="bg-gradient-to-b from-secondary/30 to-background relative">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {[
            '/1770037620112.jpg',
            '/1770037620180.jpg',
            '/1770037620233.jpg',
            '/1770037620292.jpg',
            '/1770037620352.jpg',
            '/1770037620402.jpg',
            '/1770037620457.jpg',
            '/1770037620513.jpg',
          ].map((imagePath, index) => (
            <div
              key={index}
              className="group aspect-square rounded-2xl overflow-hidden border-2 border-primary/10 premium-hover relative cursor-pointer"
            >
              <div 
                className="w-full h-full bg-cover bg-center bg-no-repeat transition-transform duration-500 group-hover:scale-110"
                style={{
                  backgroundImage: `url(${imagePath})`,
                }}
              >
                {/* Overlay sutil en hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/0 to-primary/0 group-hover:from-primary/20 group-hover:to-primary/10 transition-all duration-300"></div>
              </div>
              {/* Borde decorativo en hover */}
              <div className="absolute inset-0 border-4 border-primary/0 group-hover:border-primary/30 transition-all duration-300 rounded-2xl pointer-events-none"></div>
            </div>
          ))}
        </div>
        </div>
      </Section>

      {/* Mensajes / Guestbook - Diseño Premium */}
      <Section id="mensajes" title="Libro de mensajes" className="bg-gradient-to-b from-background via-secondary/20 to-background relative">
        <div className="max-w-3xl mx-auto">
          <Card className="border-2 border-primary/10 elegant-shadow-xl bg-card/95 backdrop-blur-sm premium-hover relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            
            <CardContent className="p-16 text-center relative z-10">
              <div className="mb-10">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 border-4 border-primary/20 relative">
                  <MessageSquare className="w-10 h-10 text-primary relative z-10" />
                </div>
              </div>
              
              <div className="flex items-center justify-center gap-6 mb-6">
                <div className="h-px w-20 bg-gradient-to-r from-transparent to-primary/30"></div>
                <p className="text-3xl md:text-4xl font-serif text-primary">
                  Déjanos un mensaje especial
                </p>
                <div className="h-px w-20 bg-gradient-to-l from-transparent to-primary/30"></div>
              </div>
              
              <p className="text-xl text-muted-foreground mb-10 leading-relaxed">
                Comparte con nosotros tus mejores deseos para este día tan importante
              </p>
              
              <Button asChild size="lg" className="rounded-full px-12 py-7 text-lg elegant-shadow-lg premium-hover">
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
            faqs.map((faq, index) => (
            <Card key={index} className="premium-hover border-2 border-primary/10 elegant-shadow-lg bg-card/95 backdrop-blur-sm relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-24 h-px bg-gradient-to-r from-primary/50 to-transparent"></div>
              <div className="absolute top-0 right-0 w-24 h-px bg-gradient-to-l from-primary/50 to-transparent"></div>
              <div className="absolute bottom-0 left-0 w-24 h-px bg-gradient-to-r from-primary/50 to-transparent"></div>
              <div className="absolute bottom-0 right-0 w-24 h-px bg-gradient-to-l from-primary/50 to-transparent"></div>
              
              <CardHeader className="pb-4 relative z-10">
                <CardTitle className="flex items-center gap-5 text-2xl font-serif">
                  <div className="p-3 rounded-xl bg-primary/10 border-2 border-primary/20 relative">
                    <div className="absolute inset-0 rounded-xl border border-primary/10"></div>
                    <HelpCircle className="w-7 h-7 text-primary relative z-10" />
                  </div>
                  <span className="flex-1">{faq.question}</span>
                  <div className="h-px flex-1 max-w-32 bg-gradient-to-r from-primary/30 to-transparent"></div>
              </CardTitle>
            </CardHeader>
              <CardContent className="relative z-10">
                <p className="text-muted-foreground leading-relaxed text-lg pl-16">
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
      <section className="relative py-40 px-4 bg-gradient-to-br from-primary via-primary/95 to-primary overflow-hidden">
        {/* Elementos decorativos */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-20 w-64 h-64 border-2 border-primary-foreground/10 rounded-full blur-2xl"></div>
          <div className="absolute bottom-20 right-20 w-48 h-48 border-2 border-primary-foreground/10 rounded-full blur-2xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary-foreground/5 rounded-full blur-3xl"></div>
        </div>
        
        <div className="container mx-auto max-w-4xl text-center space-y-10 relative z-10">
          <div className="flex items-center justify-center gap-8 mb-8">
            <div className="h-px w-32 bg-gradient-to-r from-transparent via-primary-foreground/40 to-primary-foreground/20"></div>
            <div className="relative">
              <Heart className="w-12 h-12 text-primary-foreground fill-primary-foreground animate-float-slow" />
              <div className="absolute inset-0 w-12 h-12 border-2 border-primary-foreground/20 rounded-full animate-ping"></div>
            </div>
            <div className="h-px w-32 bg-gradient-to-l from-transparent via-primary-foreground/40 to-primary-foreground/20"></div>
          </div>
          
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-serif font-bold text-primary-foreground leading-tight">
            ¿Nos acompañarás?
          </h2>
          
          <p className="text-2xl md:text-3xl text-primary-foreground/90 font-serif max-w-2xl mx-auto">
            Confirma tu asistencia para que podamos organizar todo perfectamente
          </p>
          
          <div className="pt-8 relative overflow-hidden group">
            <span className="absolute inset-0 bg-gradient-to-r from-primary-foreground/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity z-0"></span>
            <Button asChild size="lg" variant="secondary" className="text-xl px-16 py-8 rounded-full elegant-shadow-2xl premium-hover relative z-10">
              <Link href="/rsvp" className="flex items-center gap-3">
                <Heart className="w-6 h-6" />
                Confirmar asistencia
              </Link>
          </Button>
          </div>
          
          <div className="flex items-center justify-center gap-8 mt-12">
            <div className="h-px w-32 bg-gradient-to-r from-transparent via-primary-foreground/40 to-primary-foreground/20"></div>
            <Heart className="w-8 h-8 text-primary-foreground fill-primary-foreground" />
            <div className="h-px w-32 bg-gradient-to-l from-transparent via-primary-foreground/40 to-primary-foreground/20"></div>
          </div>
        </div>
      </section>

      {/* Footer - Diseño Premium */}
      <footer className="bg-secondary/90 backdrop-blur-sm py-16 px-4 border-t-2 border-primary/10 relative">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent"></div>
        <div className="container mx-auto max-w-5xl text-center space-y-6">
          <div className="flex items-center justify-center gap-4 mb-6">
            <Heart className="w-6 h-6 text-primary fill-primary animate-float-slow" />
            <p className="text-xl font-serif text-primary font-semibold">© 2026 Boda {brideName} y {groomName}</p>
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
