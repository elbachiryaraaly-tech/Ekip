// Rate limiting simple en memoria (para producción usar Redis o similar)
const requests = new Map<string, { count: number; resetTime: number }>()

export function rateLimit(
  identifier: string,
  maxRequests: number = 10,
  windowMs: number = 60000
): { success: boolean; remaining: number; resetTime: number } {
  const now = Date.now()
  const record = requests.get(identifier)

  if (!record || now > record.resetTime) {
    requests.set(identifier, {
      count: 1,
      resetTime: now + windowMs,
    })
    return { success: true, remaining: maxRequests - 1, resetTime: now + windowMs }
  }

  if (record.count >= maxRequests) {
    return { success: false, remaining: 0, resetTime: record.resetTime }
  }

  record.count++
  return { success: true, remaining: maxRequests - record.count, resetTime: record.resetTime }
}

// Limpiar entradas expiradas periódicamente
setInterval(() => {
  const now = Date.now()
  for (const [key, value] of requests.entries()) {
    if (now > value.resetTime) {
      requests.delete(key)
    }
  }
}, 60000) // Cada minuto







