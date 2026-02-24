import type { NextRequest } from "next/server"
import NextAuth, { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

// En Vercel, usar VERCEL_URL si NEXTAUTH_URL no está definida
if (process.env.VERCEL_URL && !process.env.NEXTAUTH_URL) {
  process.env.NEXTAUTH_URL = `https://${process.env.VERCEL_URL}`
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        })

        if (!user) {
          return null
        }

        const isPasswordValid = await bcrypt.compare(credentials.password, user.password)

        if (!isPasswordValid) {
          return null
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        }
      },
    }),
  ],
  pages: {
    signIn: "/admin/login",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = (user as any).role
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as string
      }
      return session
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
}

let nextAuthHandler: ReturnType<typeof NextAuth> | null = null
function getHandler() {
  if (nextAuthHandler) return nextAuthHandler
  if (!process.env.NEXTAUTH_SECRET && process.env.VERCEL) return null
  nextAuthHandler = NextAuth(authOptions)
  return nextAuthHandler
}

type RouteContext = { params: Promise<{ nextauth: string[] }> }

async function authHandler(
  req: NextRequest,
  context: RouteContext
): Promise<Response> {
  if (process.env.VERCEL && !process.env.NEXTAUTH_SECRET) {
    return Response.json(
      {
        error: "ConfigurationError",
        message: "Añade NEXTAUTH_SECRET en Vercel: Settings → Environment Variables. Genera uno con: openssl rand -base64 32",
      },
      { status: 500 }
    )
  }
  const handler = getHandler()
  if (!handler) {
    return Response.json({ error: "ConfigurationError", message: "NEXTAUTH_SECRET no configurado." }, { status: 500 })
  }
  return handler(req as any, context as any)
}

export const GET = authHandler
export const POST = authHandler

