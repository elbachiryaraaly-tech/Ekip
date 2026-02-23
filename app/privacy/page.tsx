import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-secondary py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl font-serif">Política de privacidad</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm max-w-none space-y-6">
            <section>
              <h2 className="text-xl font-semibold mb-4">1. Responsable del tratamiento</h2>
              <p className="text-muted-foreground">
                Los datos personales recogidos a través de este sitio web serán tratados por
                Celia y Alejandro como responsables del tratamiento, con el único fin de gestionar
                las confirmaciones de asistencia a nuestra boda.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">2. Datos recogidos</h2>
              <p className="text-muted-foreground">
                Recopilamos los siguientes datos personales:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground">
                <li>Nombre y apellidos</li>
                <li>Dirección de correo electrónico</li>
                <li>Teléfono (opcional)</li>
                <li>Información sobre asistencia, acompañantes, menú y necesidades especiales</li>
                <li>Mensajes en el libro de mensajes (guestbook)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">3. Finalidad del tratamiento</h2>
              <p className="text-muted-foreground">
                Los datos personales se utilizan exclusivamente para:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground">
                <li>Gestionar las confirmaciones de asistencia a la boda</li>
                <li>Enviar confirmaciones por correo electrónico</li>
                <li>Organizar el evento (menús, necesidades especiales, etc.)</li>
                <li>Moderar y publicar mensajes en el libro de mensajes</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">4. Base legal</h2>
              <p className="text-muted-foreground">
                El tratamiento de datos se basa en el consentimiento explícito del usuario,
                manifestado mediante la aceptación de esta política de privacidad.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">5. Conservación de datos</h2>
              <p className="text-muted-foreground">
                Los datos personales se conservarán durante el tiempo necesario para cumplir con
                las finalidades descritas y, en cualquier caso, durante un máximo de 1 año después
                de la celebración del evento.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">6. Derechos del usuario</h2>
              <p className="text-muted-foreground">
                Tienes derecho a:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground">
                <li>Acceder a tus datos personales</li>
                <li>Rectificar datos inexactos</li>
                <li>Solicitar la supresión de tus datos</li>
                <li>Oponerte al tratamiento</li>
                <li>Solicitar la limitación del tratamiento</li>
                <li>Portabilidad de datos</li>
              </ul>
              <p className="text-muted-foreground mt-4">
                Para ejercer estos derechos, puedes contactarnos en{" "}
                <a href="mailto:hola@boda-celia.com" className="text-primary underline">
                  hola@boda-celia.com
                </a>
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">7. Seguridad</h2>
              <p className="text-muted-foreground">
                Implementamos medidas técnicas y organizativas apropiadas para proteger tus datos
                personales contra el acceso no autorizado, la pérdida o la destrucción.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">8. Contacto</h2>
              <p className="text-muted-foreground">
                Para cualquier consulta sobre el tratamiento de tus datos personales, puedes
                contactarnos en{" "}
                <a href="mailto:hola@boda-celia.com" className="text-primary underline">
                  hola@boda-celia.com
                </a>
              </p>
            </section>

            <div className="pt-6 border-t">
              <p className="text-sm text-muted-foreground">
                Última actualización: {new Date().toLocaleDateString("es-ES")}
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="mt-8 text-center">
          <Button asChild>
            <Link href="/">Volver al inicio</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}







