import { PrismaClient } from '../generated/prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

/**
 * Prisma Client Singleton for Nexora Website.
 * Configured with @prisma/adapter-pg for pooled PostgreSQL connections on Supabase.
 * In development, attaches to globalThis to prevent connection pool exhaustion during HMR.
 */
const connectionString =
  process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/nexora_db'
const adapter = new PrismaPg({ connectionString })

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient }

export const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter })

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}