"use client"

import { useState, useCallback, useEffect } from "react"
import Image from "next/image"
import { X, ChevronLeft, ChevronRight, ZoomIn } from "lucide-react"

const GALLERY_IMAGES = [
  "/1770037620112.jpg",
  "/1770037620180.jpg",
  "/1770037620233.jpg",
  "/1770037620292.jpg",
  "/1770037620352.jpg",
  "/1770037620402.jpg",
  "/1770037620457.jpg",
  "/1770037620513.jpg",
]

export function GalleryLightbox() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const goPrev = useCallback(() => {
    if (openIndex === null) return
    setOpenIndex(openIndex === 0 ? GALLERY_IMAGES.length - 1 : openIndex - 1)
  }, [openIndex])

  const goNext = useCallback(() => {
    if (openIndex === null) return
    setOpenIndex(openIndex === GALLERY_IMAGES.length - 1 ? 0 : openIndex + 1)
  }, [openIndex])

  const close = useCallback(() => setOpenIndex(null), [])

  useEffect(() => {
    if (openIndex === null) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") close()
      if (e.key === "ArrowLeft") goPrev()
      if (e.key === "ArrowRight") goNext()
    }
    window.addEventListener("keydown", onKeyDown)
    document.body.style.overflow = "hidden"
    return () => {
      window.removeEventListener("keydown", onKeyDown)
      document.body.style.overflow = ""
    }
  }, [openIndex, close, goPrev, goNext])

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4 md:gap-6">
        {GALLERY_IMAGES.map((imagePath, index) => (
          <button
            key={index}
            type="button"
            onClick={() => setOpenIndex(index)}
            className="group aspect-square rounded-2xl overflow-hidden border-2 border-primary/10 relative cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 transition-all duration-500 hover:border-primary/30 hover:shadow-2xl hover:shadow-primary/10 hover:scale-[1.02] active:scale-[0.98]"
          >
            <div className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-700 group-hover:scale-110" style={{ backgroundImage: `url(${imagePath})` }} />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 scale-75 group-hover:scale-100">
              <span className="rounded-full bg-white/20 backdrop-blur-md p-4 border-2 border-white/40">
                <ZoomIn className="w-8 h-8 text-white drop-shadow-lg" />
              </span>
            </div>
            <div className="absolute bottom-2 left-2 right-2 text-center">
              <span className="text-white/0 group-hover:text-white/90 text-xs font-medium drop-shadow-lg transition-colors duration-300">Ver más grande</span>
            </div>
          </button>
        ))}
      </div>

      {/* Lightbox espectacular */}
      {openIndex !== null && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Vista ampliada de la imagen"
        >
          {/* Fondo: blur + oscuro + entrada suave */}
          <div
            className="absolute inset-0 bg-black/90 backdrop-blur-xl animate-lightbox-fade"
            onClick={close}
            aria-hidden="true"
          />
          {/* Partículas / brillo sutil */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-primary/10 blur-[100px] animate-pulse" />
            <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-primary/5 blur-[80px] animate-pulse" style={{ animationDelay: "0.5s" }} />
          </div>

          {/* Contenedor de la imagen con zoom dramático */}
          <div
            className="relative z-10 w-full max-w-6xl max-h-[90vh] flex items-center justify-center animate-lightbox-zoom"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative rounded-2xl overflow-hidden shadow-2xl ring-4 ring-white/10 ring-offset-4 ring-offset-transparent">
              <Image
                src={GALLERY_IMAGES[openIndex]}
                alt={`Galería boda ${openIndex + 1}`}
                width={1200}
                height={800}
                className="max-h-[85vh] w-auto h-auto object-contain"
                sizes="(max-width: 1200px) 100vw, 1200px"
                priority={openIndex === 0}
                quality={95}
              />
              {/* Marco luminoso */}
              <div className="absolute inset-0 pointer-events-none rounded-2xl shadow-[inset_0_0_60px_rgba(255,255,255,0.08)]" />
            </div>
          </div>

          {/* Botón cerrar */}
          <button
            type="button"
            onClick={close}
            className="absolute top-4 right-4 z-20 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md border border-white/20 transition-all duration-300 hover:scale-110 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
            aria-label="Cerrar"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Navegación anterior / siguiente */}
          {GALLERY_IMAGES.length > 1 && (
            <>
              <button
                type="button"
                onClick={goPrev}
                className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-20 p-3 sm:p-4 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md border border-white/20 transition-all duration-300 hover:scale-110 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
                aria-label="Imagen anterior"
              >
                <ChevronLeft className="w-6 h-6 sm:w-8 sm:h-8" />
              </button>
              <button
                type="button"
                onClick={goNext}
                className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-20 p-3 sm:p-4 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md border border-white/20 transition-all duration-300 hover:scale-110 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
                aria-label="Siguiente imagen"
              >
                <ChevronRight className="w-6 h-6 sm:w-8 sm:h-8" />
              </button>
              <p className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 text-white/80 text-sm font-medium backdrop-blur-sm px-4 py-2 rounded-full bg-black/30">
                {openIndex + 1} / {GALLERY_IMAGES.length}
              </p>
            </>
          )}
        </div>
      )}

    </>
  )
}
