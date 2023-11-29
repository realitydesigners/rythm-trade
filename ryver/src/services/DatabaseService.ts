import { PrismaClient } from '@prisma/client';

export class DatabaseService {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  public async getUser(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: Number(userId) },
    });
    return user;
  }
}
