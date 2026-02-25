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
    <section id={id} className={`py-12 sm:py-16 md:py-24 lg:py-32 px-3 sm:px-4 ${className}`}>
      <div className="container mx-auto">
        {/* Título de la sección */}
        <div className="text-center mb-10 sm:mb-14 md:mb-16 lg:mb-20">
          <div className="flex items-center justify-center gap-4 sm:gap-6 mb-4 sm:mb-6">
            <div className="h-px w-16 sm:w-24 md:w-32 bg-gradient-to-r from-transparent via-primary/30 to-primary/20"></div>
            <Heart className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 text-primary fill-primary animate-float-slow" />
            <div className="h-px w-16 sm:w-24 md:w-32 bg-gradient-to-l from-transparent via-primary/30 to-primary/20"></div>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-serif font-bold text-primary mb-3 sm:mb-4 px-2">
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
