import { ReactNode } from "react"
import { Heart } from "lucide-react"

interface SectionProps {
  id: string
  title: string
  children: ReactNode
  className?: string
}

export function Section({ id, title, children, className = "" }: SectionProps) {
  return (
    <section id={id} className={`py-20 md:py-32 px-4 ${className}`}>
      <div className="container mx-auto">
        {/* Título de la sección */}
        <div className="text-center mb-16 md:mb-20">
          <div className="flex items-center justify-center gap-6 mb-6">
            <div className="h-px w-24 md:w-32 bg-gradient-to-r from-transparent via-primary/30 to-primary/20"></div>
            <Heart className="w-6 h-6 md:w-8 md:h-8 text-primary fill-primary animate-float-slow" />
            <div className="h-px w-24 md:w-32 bg-gradient-to-l from-transparent via-primary/30 to-primary/20"></div>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-primary mb-4">
            {title}
          </h2>
          <div className="flex items-center justify-center gap-4 mt-6">
            <div className="h-px w-16 md:w-24 bg-gradient-to-r from-transparent to-primary/40"></div>
            <div className="w-2 h-2 rounded-full bg-primary/40"></div>
            <div className="h-px w-16 md:w-24 bg-gradient-to-l from-transparent to-primary/40"></div>
          </div>
        </div>

        {/* Contenido */}
        {children}
      </div>
    </section>
  )
}
