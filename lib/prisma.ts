import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
})

// Add connection validation for Vercel deployment
if (process.env.NODE_ENV === 'production') {
  prisma.$connect()
    .then(() => {
      console.log('🔥 PRISMA: Successfully connected to database')
    })
    .catch((error: unknown) => {
      console.error('🔥 PRISMA ERROR: Failed to connect to database:', error)
    })
}

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma 