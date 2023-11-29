import { PrismaClient } from '@prisma/client';

export class UserController {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  public async createUserOrUpdate(clerkUserId: string, userEmail: string, userName?: string) {
    const user = await this.prisma.user.upsert({
      where: { clerkUserId },
      update: { email: userEmail, name: userName },
      create: { clerkUserId, email: userEmail, name: userName },
    });
    return user;
  }
}
