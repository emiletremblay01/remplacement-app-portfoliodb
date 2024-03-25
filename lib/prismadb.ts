import { PrismaClient } from "@prisma/client";

declare global {
  var prisma: PrismaClient | undefined;
}

let prismadb: PrismaClient;

if (process.env.NODE_ENV === "development") {
  prismadb = globalThis.prisma || new PrismaClient();
  globalThis.prisma = prismadb;
} else {
  prismadb = new PrismaClient();
}

export default prismadb;
