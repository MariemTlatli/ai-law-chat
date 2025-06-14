import { PrismaClient as PrismaClientDb1 } from '@/generated/client-db1';

const prismaClientDb1 = () => new PrismaClientDb1();

declare global {
  var prismaDb1: ReturnType<typeof prismaClientDb1>;
}

const db1 = globalThis.prismaDb1 || prismaClientDb1();

if (process.env.NODE_ENV !== 'production') globalThis.prismaDb1 = db1;

export default db1;
