import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendRSVPConfirmationEmail(
  to: string,
  data: {
    firstName: string
    lastName: string
    attending: boolean
    editToken: string
  }
) {
  const editUrl = `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/rsvp/edit/${data.editToken}`

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: 'Inter', sans-serif; line-height: 1.6; color: #2F5D50; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; background: #F6F1E8; }
          .header { text-align: center; padding: 30px 0; border-bottom: 2px solid #2F5D50; }
          .content { padding: 30px 0; }
          .button { display: inline-block; padding: 12px 24px; background: #2F5D50; color: #F6F1E8; text-decoration: none; border-radius: 4px; margin: 20px 0; }
          .footer { text-align: center; padding: 20px 0; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="color: #2F5D50; margin: 0;">¡Gracias por confirmar!</h1>
          </div>
          <div class="content">
            <p>Hola ${data.firstName},</p>
            <p>Hemos recibido tu confirmación de asistencia a nuestra boda.</p>
            ${data.attending ? '<p><strong>Estamos encantados de que puedas acompañarnos.</strong></p>' : '<p>Lamentamos que no puedas asistir, pero agradecemos que nos lo hayas comunicado.</p>'}
            <p>Si necesitas modificar algún dato de tu confirmación, puedes hacerlo a través del siguiente enlace:</p>
            <p style="text-align: center;">
              <a href="${editUrl}" class="button">Editar mi confirmación</a>
            </p>
            <p style="font-size: 12px; color: #666; margin-top: 30px;">
              Este enlace es válido durante 30 días. Si tienes alguna pregunta, no dudes en contactarnos.
            </p>
          </div>
          <div class="footer">
            <p>Con cariño,<br>Celia y Alejandro</p>
          </div>
        </div>
      </body>
    </html>
  `

  try {
    await resend.emails.send({
      from: process.env.EMAIL_FROM || "noreply@boda.com",
      to,
      subject: "Confirmación de asistencia - Boda Celia y Alejandro",
      html,
    })
    return { success: true }
  } catch (error) {
    console.error("Error enviando email:", error)
    return { success: false, error }
  }
}







