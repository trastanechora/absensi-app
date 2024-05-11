import { PrismaClient } from '@prisma/client';
import cacheMiddleware from './redis';

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
  return DBClient.getInstance().prisma;
};

export default main();