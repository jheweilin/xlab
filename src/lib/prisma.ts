import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });

// Always cache the client to prevent connection exhaustion
globalForPrisma.prisma = prisma;

// Graceful shutdown - close database connections (register only once)
if (typeof process !== "undefined" && !(globalThis as Record<string, unknown>).__prismaShutdownRegistered) {
  (globalThis as Record<string, unknown>).__prismaShutdownRegistered = true;

  const handleShutdown = (signal: string) => {
    console.log(`Received ${signal}. Closing database connections...`);
    prisma.$disconnect().then(() => {
      process.exit(0);
    });
  };

  process.on("SIGINT", () => handleShutdown("SIGINT"));
  process.on("SIGTERM", () => handleShutdown("SIGTERM"));
}

export default prisma;
