import { PrismaClient } from '@prisma/client';
import cacheMiddleware from './redis';

declare const globalThis: {
  prismaGlobal: DBClient['prisma'];
} & typeof global;

class DBClient {
  public prisma;
  private static instance: DBClient;
  private constructor() {
    const _prisma = new PrismaClient();
    const _prismaWithCache = _prisma.$extends(cacheMiddleware);

    this.prisma = _prismaWithCache;
  }

  public static getInstance = () => {
    if (!DBClient.instance) {
      DBClient.instance = new DBClient();
    }
    return DBClient.instance;
  }
}

const main = () => {
  const prisma = globalThis.prismaGlobal ?? DBClient.getInstance().prisma;
  return prisma;
};

export default main();

if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = main();